import type { MetadataRoute } from 'next';
import { listCatalogCategories, listCatalogProducts } from '@/generated/api/catalog/catalog';
import { listPublishedPosts } from '@/generated/api/content/content';
import { POLICY_POST_TYPE } from '@/features/content';
import { absoluteUrl } from '@/lib/seo/page-metadata';

/**
 * Sitemap dựng từ dữ liệu thật của API, làm mới mỗi giờ (và ngay khi `/api/revalidate` được gọi).
 *
 * Bản trước liệt kê slug viết cứng — phần lớn không tồn tại trong catalog, tức là mời Google vào
 * một loạt trang 404. Nhóm nào API lỗi thì bỏ nhóm đó (vẫn trả sitemap hợp lệ gồm các trang tĩnh
 * và nhóm còn lại), không bịa slug thay thế. Chỉ liệt kê trang công khai index được; trang cá
 * nhân/giao dịch đã chặn ở `robots.ts`.
 */
export const revalidate = 3600;

const PRODUCT_PAGE_LIMIT = 100;
/** Trần số trang sản phẩm quét mỗi lần dựng sitemap (100 × 50 = 5.000 URL), tránh vòng lặp dài. */
const MAX_PRODUCT_PAGES = 50;
/** `ListPublishedPostsParams.limit` tối đa 50 theo contract. */
const POST_PAGE_LIMIT = 50;
const MAX_POST_PAGES = 20;
/** Số request song song tối đa tới API mỗi đợt, tránh dội cả 50 trang cùng lúc lên backend. */
const FETCH_CONCURRENCY = 5;

function logGroupError(group: string, error: unknown): void {
  // Sitemap vẫn trả về được; log để phát hiện nhóm URL bị thiếu thay vì im lặng.
  console.error(`[sitemap] Không lấy được nhóm "${group}":`, error);
}

/**
 * Lấy trang 1 để biết tổng số trang, sau đó tải các trang còn lại theo đợt `FETCH_CONCURRENCY`.
 * Trang lỗi giữa chừng bị bỏ qua, các trang khác vẫn giữ. Trang 1 lỗi thì ném ra cho nhóm tự xử lý.
 */
async function collectPages<T>(
  fetchPage: (page: number) => Promise<{ items: T[]; totalPages: number }>,
  maxPages: number,
  group: string,
): Promise<T[]> {
  const first = await fetchPage(1);
  const lastPage = Math.min(first.totalPages, maxPages);
  const items = [...first.items];
  const rest = Array.from({ length: Math.max(lastPage - 1, 0) }, (_, index) => index + 2);

  for (let start = 0; start < rest.length; start += FETCH_CONCURRENCY) {
    const batch = rest.slice(start, start + FETCH_CONCURRENCY);
    const results = await Promise.allSettled(batch.map((page) => fetchPage(page)));
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') items.push(...result.value.items);
      else logGroupError(`${group} trang ${batch[index]}`, result.reason);
    });
  }
  return items;
}

async function productEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const products = await collectPages(
      async (page) => {
        const { items, meta } = await listCatalogProducts({ page, limit: PRODUCT_PAGE_LIMIT });
        return { items, totalPages: meta.totalPages };
      },
      MAX_PRODUCT_PAGES,
      'products',
    );
    // Một slug có thể lặp lại nếu catalog đổi thứ tự giữa hai trang; sitemap không được trùng URL.
    const seen = new Set<string>();
    return products.flatMap((product) => {
      if (seen.has(product.slug)) return [];
      seen.add(product.slug);
      // DTO danh sách chưa có `updatedAt` nên không khai `lastModified` (không bịa ngày).
      return [
        {
          url: absoluteUrl(`/products/${product.slug}`),
          changeFrequency: 'daily' as const,
          priority: 0.8,
          ...(product.imageUrl ? { images: [absoluteUrl(product.imageUrl)] } : {}),
        },
      ];
    });
  } catch (error) {
    logGroupError('products', error);
    return [];
  }
}

async function categoryEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const { items } = await listCatalogCategories();
    return items
      .filter((category) => category.productCount > 0)
      .map((category) => ({
        url: absoluteUrl(`/category/${category.slug}`),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch (error) {
    logGroupError('categories', error);
    return [];
  }
}

async function postEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    // Bản trước gọi một lần không tham số nên chỉ lấy được trang đầu (mặc định của API).
    const posts = await collectPages(
      async (page) => {
        const { items, meta } = await listPublishedPosts({ page, limit: POST_PAGE_LIMIT });
        return { items, totalPages: Math.ceil(meta.total / Math.max(meta.limit, 1)) };
      },
      MAX_POST_PAGES,
      'posts',
    );
    return posts.map((post) => {
      const isPolicy = post.postType === POLICY_POST_TYPE;
      const publishedAt = post.publishedAt ? new Date(post.publishedAt) : undefined;
      return {
        url: absoluteUrl(isPolicy ? `/chinh-sach/${post.slug}` : `/news/${post.slug}`),
        ...(publishedAt && !Number.isNaN(publishedAt.getTime()) ? { lastModified: publishedAt } : {}),
        changeFrequency: 'monthly' as const,
        priority: isPolicy ? 0.4 : 0.6,
        ...(!isPolicy && post.coverUrl ? { images: [absoluteUrl(post.coverUrl)] } : {}),
      };
    });
  } catch (error) {
    logGroupError('posts', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/products'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/category'), changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/news'), changeFrequency: 'daily', priority: 0.7 },
    { url: absoluteUrl('/flash-sale'), changeFrequency: 'daily', priority: 0.6 },
    { url: absoluteUrl('/chinh-sach'), changeFrequency: 'monthly', priority: 0.4 },
    { url: absoluteUrl('/contact'), changeFrequency: 'yearly', priority: 0.4 },
  ];
  const [products, categories, posts] = await Promise.all([
    productEntries(),
    categoryEntries(),
    postEntries(),
  ]);
  return [...staticRoutes, ...categories, ...products, ...posts];
}
