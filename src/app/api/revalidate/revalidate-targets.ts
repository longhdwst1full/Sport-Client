/**
 * Map một sự kiện "nội dung công khai vừa đổi" của API sang các trang ISR phải làm mới.
 *
 * Pure function để test được; route handler chỉ xác thực rồi gọi `revalidatePath` theo kết quả.
 * Các trang ISR đọc API bằng Axios (không qua `fetch` của Next) nên không có tag để
 * `revalidateTag` — làm mới theo đường dẫn là cơ chế duy nhất áp dụng được.
 */
export const REVALIDATE_RESOURCES = ['post', 'product', 'category', 'all'] as const;
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
    case 'all':
      return [{ path: '/', type: 'layout' }];
  }
}
