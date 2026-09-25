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

/**
 * Cờ bật tính năng chưa có backend thật.
 *
 * Tra cứu bảo hành hiện chỉ đọc dữ liệu mẫu (`shared/data/mocks`), nên tắt mặc định để khách không
 * tưởng là chức năng thật. Chỉ bật bằng `NEXT_PUBLIC_FEATURE_WARRANTY=true` khi đã có API bảo hành.
 */
export const FEATURE_FLAGS = {
  WARRANTY_LOOKUP: process.env.NEXT_PUBLIC_FEATURE_WARRANTY === 'true',
} as const;
