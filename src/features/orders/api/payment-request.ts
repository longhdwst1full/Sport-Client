import type { AxiosRequestConfig } from 'axios';

/**
 * Mọi lời gọi thanh toán từ trình duyệt đi qua route API của Next rồi mới sang backend:
 * `client -> /api/v1/payments/** -> backend thật`.
 *
 * `baseURL: ''` buộc Axios dùng chính origin của Next kể cả khi chạy ở server (server component
 * mặc định gọi thẳng backend qua `backendOrigin()`).
 *
 * Mọi lời gọi khác từ trình duyệt cũng đi same-origin qua proxy `app/api/v1/[...path]`.
 */
export function paymentRequest(options: AxiosRequestConfig = {}): AxiosRequestConfig {
  return { ...options, baseURL: '' };
}
