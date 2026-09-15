import type { AxiosRequestConfig } from 'axios';

/**
 * Mọi lời gọi thanh toán từ trình duyệt đi qua route API của Next rồi mới sang backend:
 * `client -> /api/v1/payments/** -> backend thật`.
 *
 * `baseURL: ''` khiến Axios dùng chính origin của Next thay vì `NEXT_PUBLIC_API_URL`,
 * nên địa chỉ backend không xuất hiện trong bundle phía client.
 *
 * Chỉ áp cho thanh toán. Catalog và nội dung công khai vẫn gọi thẳng backend vì
 * không mang thông tin nhạy cảm và đi qua proxy chỉ thêm một chặng mạng.
 */
export function paymentRequest(options: AxiosRequestConfig = {}): AxiosRequestConfig {
  return { ...options, baseURL: '' };
}
