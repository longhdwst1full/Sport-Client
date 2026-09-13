/**
 * Key storage của Storefront. Không dùng string literal rải rác trong feature
 * (kế thừa `core/storage/constants.ts` của `dragon-web-v2`/`admin-client`).
 */
export const CookieKey = {
  ACCESS_TOKEN: 'dctd_sf_access_token',
  REFRESH_TOKEN: 'dctd_sf_refresh_token',
} as const;

export const LocalStorageKey = {
  GUEST_CART_TOKEN: 'dctd-storefront-guest-cart-token-v1',
  GUEST_ORDER_ACCESS: 'baoan_guest_order_access_v1',
  CART: 'dctd-storefront-cart-v2',
  PROMO_MODAL_DISMISSED_UNTIL: 'baoan_promo_modal_dismissed_until',
} as const;
