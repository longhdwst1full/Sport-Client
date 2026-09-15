/**
 * Địa chỉ công khai của storefront.
 *
 * Dùng cho dữ liệu có cấu trúc (JSON-LD), sitemap và link tuyệt đối. Lấy từ biến môi
 * trường để bản xem thử và bản chạy thật không cùng khai một domain — khai sai domain
 * trong JSON-LD làm công cụ tìm kiếm gom nhầm trang.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://baoansport.vn'
).replace(/\/$/, '');

export function siteUrl(path = ''): string {
  return `${SITE_URL}${path.startsWith('/') ? path : path && `/${path}`}`;
}

/** Ảnh thay thế khi sản phẩm chưa có ảnh; dùng chung cho lưới, giỏ và trang thanh toán. */
export const PRODUCT_PLACEHOLDER_IMAGE = '/images/product-placeholder.svg';
