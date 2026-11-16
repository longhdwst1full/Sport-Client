/**
 * Cổng VNPay chạy trên các domain này (sandbox `sandbox.vnpayment.vn`, production `*.vnpay.vn` /
 * `*.vnpayment.vn`). URL cổng là tham số hệ thống Admin đổi được (`VNPAY_PAYMENT_URL` bên API).
 */
const VNPAY_HOST_SUFFIXES = ['vnpayment.vn', 'vnpay.vn'] as const;

function isVnpayHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return VNPAY_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
}

/**
 * SECURITY: `redirectUrl` do API trả về được dùng thẳng cho `window.location.assign` và `href`. Chỉ nhận
 * `https:` tới domain VNPay, để một cấu hình sai (Admin gõ nhầm URL cổng) hoặc dữ liệu bị chèn không đưa
 * khách sang trang lạ / `javascript:` đúng lúc khách sắp nhập thông tin thẻ.
 *
 * Trả `null` khi không tin được: UI coi như cổng chưa sẵn sàng (đã có thông báo và đường liên hệ cửa hàng).
 */
export function trustedPaymentRedirectUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  return url.protocol === 'https:' && isVnpayHost(url.hostname) && !url.username && !url.password ? url.href : null;
}
