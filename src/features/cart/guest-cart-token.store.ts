export const GUEST_CART_TOKEN_KEY = 'dctd-storefront-guest-cart-token-v1';

export function readGuestCartToken(): string | null {
  return typeof window === 'undefined' ? null : window.localStorage.getItem(GUEST_CART_TOKEN_KEY);
}

export function saveGuestCartToken(token: string): void {
  if (typeof window !== 'undefined') window.localStorage.setItem(GUEST_CART_TOKEN_KEY, token);
}

export function clearGuestCartToken(): void {
  if (typeof window !== 'undefined') window.localStorage.removeItem(GUEST_CART_TOKEN_KEY);
}
