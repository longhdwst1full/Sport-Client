/**
 * Map một sự kiện "nội dung công khai vừa đổi" của API sang các trang ISR phải làm mới.
 *
 * Pure function để test được; route handler chỉ xác thực rồi gọi `revalidatePath`/`revalidateTag`.
 * Trang ISR đọc API bằng Axios (không qua `fetch` của Next); riêng dữ liệu dùng chung (danh mục,
 * banner) đi qua `unstable_cache` có tag (`app/(storefront)/_data/public-data.ts`), nên phải làm
 * mới cả tag — chỉ `revalidatePath` thì trang dựng lại vẫn đọc cây danh mục cũ trong cache.
 */
import { PUBLIC_DATA_TAGS } from '../../(storefront)/_data/public-data-tags';
export const REVALIDATE_RESOURCES = ['post', 'product', 'category', 'banner', 'flash-sale', 'system-parameter', 'all'] as const;
export type RevalidateResource = (typeof REVALIDATE_RESOURCES)[number];

export interface RevalidateTarget {
  path: string;
  /** `page` cho mẫu động (`/news/[slug]`), `layout` để làm mới cả cây; bỏ trống cho đường dẫn cụ thể. */
  type?: 'page' | 'layout';
}

export interface RevalidateRequest {
  resource: RevalidateResource;
  slug?: string;
}

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,199}$/i;

export function parseRevalidateRequest(body: unknown): RevalidateRequest | undefined {
  if (!body || typeof body !== 'object') return undefined;
  const { resource, slug } = body as { resource?: unknown; slug?: unknown };
  if (typeof resource !== 'string' || !(REVALIDATE_RESOURCES as readonly string[]).includes(resource)) {
    return undefined;
  }
  if (slug !== undefined && (typeof slug !== 'string' || !SLUG_PATTERN.test(slug))) return undefined;
  return { resource: resource as RevalidateResource, slug: slug as string | undefined };
}

export function revalidateTargets({ resource, slug }: RevalidateRequest): RevalidateTarget[] {
  switch (resource) {
    case 'post':
      // Bài viết: danh sách tin, trang chính sách, slider trang chủ, sitemap. Không biết slug
      // thuộc tin hay chính sách nên làm mới cả hai route chi tiết (route sai loại tự trả 404).
      return [
        { path: '/' },
        { path: '/news' },
        { path: '/chinh-sach' },
        { path: '/sitemap.xml' },
        ...(slug
          ? [{ path: `/news/${slug}` }, { path: `/chinh-sach/${slug}` }]
          : [
              { path: '/news/[slug]', type: 'page' as const },
              { path: '/chinh-sach/[slug]', type: 'page' as const },
            ]),
      ];
    case 'product':
      // Giá/tồn kho cuối cùng luôn do checkout báo giá lại; đây chỉ làm mới HTML/metadata.
      return [
        { path: '/' },
        { path: '/category' },
        { path: '/category/[slug]', type: 'page' },
        { path: '/sitemap.xml' },
        slug ? { path: `/products/${slug}` } : { path: '/products/[slug]', type: 'page' },
      ];
    case 'category':
      return [
        { path: '/' },
        { path: '/category' },
        { path: '/category/[slug]', type: 'page' },
        // Trang sản phẩm tra slug danh mục theo tên để dựng breadcrumb/liên quan.
        { path: '/products/[slug]', type: 'page' },
        { path: '/sitemap.xml' },
      ];
    case 'banner':
      // Banner chỉ hiện ở trang chủ (slider + thẻ khuyến mãi); dữ liệu đi qua tag `banners`.
      return [{ path: '/' }];
    case 'flash-sale':
      // Giá flash hiện ở trang chủ, trang flash sale và trang chi tiết; suất/giá cuối vẫn do checkout chốt.
      return [{ path: '/' }, { path: '/flash-sale' }, { path: '/products/[slug]', type: 'page' }];
    case 'system-parameter':
    case 'all':
      // Tham số công khai (hotline, phí giao…) dùng ở layout nên làm mới cả cây.
      return [{ path: '/', type: 'layout' }];
  }
}

/** Tag của `unstable_cache` cần làm mới theo cùng sự kiện. */
export function revalidateTags({ resource }: RevalidateRequest): string[] {
  switch (resource) {
    case 'post':
      return [];
    case 'product':
    case 'category':
      // Số sản phẩm của danh mục (`productCount`) đổi theo sản phẩm.
      return [PUBLIC_DATA_TAGS.categories];
    case 'banner':
      return [PUBLIC_DATA_TAGS.banners];
    case 'flash-sale':
      return [PUBLIC_DATA_TAGS.flashSales];
    case 'system-parameter':
      return [];
    case 'all':
      return [PUBLIC_DATA_TAGS.categories, PUBLIC_DATA_TAGS.banners, PUBLIC_DATA_TAGS.flashSales];
  }
}
