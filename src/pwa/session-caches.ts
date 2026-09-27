/**
 * Runtime caches of the service worker that are filled while a visitor browses (public API
 * reference data, public page HTML). Names come from `public/sw-routing.js`
 * (`dctd-storefront-<kind>-<version>`); matching by prefix keeps this independent of the version.
 */
const SESSION_CACHE_PREFIXES = ['dctd-storefront-api-', 'dctd-storefront-pages-'] as const;

export function isSessionScopedCacheName(name: string): boolean {
  return SESSION_CACHE_PREFIXES.some((prefix) => name.startsWith(prefix));
}

/**
 * SECURITY: gọi khi đăng xuất / đổi tài khoản. Worker vốn không cache dữ liệu cá nhân (request có
 * `Authorization` và nhóm auth/account/cart/checkout/orders/payments bị bỏ qua), nhưng máy dùng
 * chung vẫn không nên giữ lại dấu vết duyệt web của phiên trước. Shell/static/icon được giữ để app
 * vẫn mở offline được.
 */
export async function clearSessionPwaCaches(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    const names = await window.caches.keys();
    await Promise.all(names.filter(isSessionScopedCacheName).map((name) => window.caches.delete(name)));
  } catch {
    // Storage bị chặn (ẩn danh/chính sách trình duyệt): không có cache nào để dọn.
  }
}
