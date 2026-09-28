import type { MetadataRoute } from 'next';
import { listCatalogCategories, listCatalogProducts } from '@/generated/api/catalog/catalog';
import { listPublishedPosts } from '@/generated/api/content/content';
import { POLICY_POST_TYPE } from '@/features/content';
import { SITE_URL } from '@/lib/seo/page-metadata';

/**
 * Sitemap dựng từ dữ liệu thật của API, làm mới mỗi giờ (và ngay khi `/api/revalidate` được gọi).
 *
 * Bản trước liệt kê slug viết cứng — phần lớn không tồn tại trong catalog, tức là mời Google vào
 * một loạt trang 404. Nhóm nào API lỗi thì bỏ nhóm đó, không bịa slug thay thế.
 */
export const revalidate = 3600;

const PRODUCT_PAGE_LIMIT = 100;
/** Trần số trang sản phẩm quét mỗi lần dựng sitemap (100 × 50 = 5.000 URL), tránh vòng lặp dài. */
const MAX_PRODUCT_PAGES = 50;

const url = (path: string) => `${SITE_URL}${path}`;

async function productEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  try {
    for (let page = 1; page <= MAX_PRODUCT_PAGES; page += 1) {
      const { items, meta } = await listCatalogProducts({ page, limit: PRODUCT_PAGE_LIMIT });
      for (const product of items) {
        entries.push({ url: url(`/products/${product.slug}`), changeFrequency: 'daily', priority: 0.8 });
      }
      if (page >= meta.totalPages || items.length === 0) break;
    }
  } catch {
    // Giữ những trang đã lấy được; lỗi giữa chừng không làm mất cả sitemap.
  }
  return entries;
}

async function categoryEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const { items } = await listCatalogCategories();
    return items
      .filter((category) => category.productCount > 0)
      .map((category) => ({
        url: url(`/category/${category.slug}`),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}

async function postEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const { items } = await listPublishedPosts();
    return items.map((post) => ({
      url: url(post.postType === POLICY_POST_TYPE ? `/chinh-sach/${post.slug}` : `/news/${post.slug}`),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      changeFrequency: 'monthly' as const,
      priority: post.postType === POLICY_POST_TYPE ? 0.4 : 0.6,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'daily', priority: 1 },
    { url: url('/products'), changeFrequency: 'daily', priority: 0.9 },
    { url: url('/category'), changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/news'), changeFrequency: 'daily', priority: 0.7 },
    { url: url('/flash-sale'), changeFrequency: 'daily', priority: 0.6 },
    { url: url('/chinh-sach'), changeFrequency: 'monthly', priority: 0.4 },
    { url: url('/contact'), changeFrequency: 'yearly', priority: 0.4 },
  ];
  const [products, categories, posts] = await Promise.all([
    productEntries(),
    categoryEntries(),
    postEntries(),
  ]);
  return [...staticRoutes, ...categories, ...products, ...posts];
}
