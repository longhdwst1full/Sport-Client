/**
 * Địa chỉ backend thật — CHỈ đọc ở server. Không dùng `process.env.NEXT_PUBLIC_API_URL` dạng tĩnh ở bất
 * kỳ module nào trình duyệt tải: Next nhúng biến `NEXT_PUBLIC_*` vào JS lúc build và lộ địa chỉ backend.
 *
 * Thứ tự: `API_URL` (khuyến nghị, đặt trên Vercel) → `INTERNAL_API_URL` (rewrite cũ) → tên cũ
 * `NEXT_PUBLIC_API_URL` đọc ĐỘNG (Next không nhúng truy cập động) để môi trường chưa đổi biến vẫn chạy
 * → API local.
 */
export function backendOrigin(): string {
  const legacyKey = ['NEXT_PUBLIC', 'API_URL'].join('_');
  const value =
    process.env.API_URL || process.env.INTERNAL_API_URL || process.env[legacyKey] || 'http://localhost:4000';
  return value.replace(/\/+$/, '');
}

/** Header bí mật để backend nhận diện request đi từ server storefront (`STOREFRONT_PROXY_SECRET`). */
export const STOREFRONT_PROXY_SECRET_HEADER = 'x-storefront-proxy-secret';
/** IP thật của khách, backend chỉ tin khi kèm secret hợp lệ (dùng cho giới hạn tần suất). */
export const STOREFRONT_CLIENT_IP_HEADER = 'x-storefront-client-ip';

export function storefrontProxySecret(): string | undefined {
  return process.env.STOREFRONT_PROXY_SECRET || undefined;
}
