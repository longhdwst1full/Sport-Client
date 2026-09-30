import { ApiError } from '@/lib/api/fetcher';
import { apiErrorMessage } from '@/lib/api/error-message';
import { GUEST_LOOKUP_ERROR_MESSAGES, GuestLookupErrorCode } from './guest-order-lookup.constants';

export function guestLookupErrorCode(error: unknown): string | undefined {
  if (!(error instanceof ApiError)) return undefined;
  const payload = error.payload as { code?: unknown } | undefined;
  return typeof payload?.code === 'string' ? payload.code : undefined;
}

/** Thông điệp theo mã lỗi ổn định; 429 không mã (throttle theo IP) là "thử lại sau". */
export function guestLookupErrorMessage(error: unknown, fallback: string): string {
  const code = guestLookupErrorCode(error);
  if (code && GUEST_LOOKUP_ERROR_MESSAGES[code]) return GUEST_LOOKUP_ERROR_MESSAGES[code];
  if (error instanceof ApiError && error.status === 429) return 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.';
  return apiErrorMessage(error, fallback);
}

/** Grant không còn dùng được (hết hạn/bị thu hồi): bỏ khỏi storage và mời xác thực lại. */
export function isGuestLookupTokenInvalid(error: unknown): boolean {
  return guestLookupErrorCode(error) === GuestLookupErrorCode.TOKEN_INVALID
    || (error instanceof ApiError && error.status === 401);
}

/** Mã OTP bị khoá: phải gửi mã mới, không cho nhập tiếp. */
export function isGuestLookupLocked(error: unknown): boolean {
  return guestLookupErrorCode(error) === GuestLookupErrorCode.LOCKED;
}
