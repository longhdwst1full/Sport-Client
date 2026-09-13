import { LocalStorageKey, safeStorage } from '@/core/storage';

export const GUEST_CART_TOKEN_KEY = LocalStorageKey.GUEST_CART_TOKEN;

// Token lưu dạng chuỗi thô, không JSON-encode: đổi format sẽ làm khách đang có
// giỏ hàng dở mất token sau lần deploy tiếp theo.
export function readGuestCartToken(): string | null {
  return safeStorage()?.getItem(GUEST_CART_TOKEN_KEY) ?? null;
}

export function saveGuestCartToken(token: string): void {
  try {
    safeStorage()?.setItem(GUEST_CART_TOKEN_KEY, token);
  } catch {
    // Storage bị chặn/đầy: giỏ hàng phiên này vẫn hoạt động, chỉ không khôi phục được.
  }
}

export function clearGuestCartToken(): void {
  safeStorage()?.removeItem(GUEST_CART_TOKEN_KEY);
}
