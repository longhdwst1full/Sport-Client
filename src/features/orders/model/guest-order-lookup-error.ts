import { ApiError } from '@/lib/api/fetcher';
import { apiErrorMessage } from '@/lib/api/error-message';
import { GUEST_LOOKUP_ERROR_MESSAGES, GuestLookupErrorCode } from './guest-order-lookup.constants';

export function guestLookupErrorCode(error: unknown): string | undefined {
  if (!(error instanceof ApiError)) return undefined;
  const payload = error.payload as { code?: unknown } | undefined;
  return typeof payload?.code === 'string' ? payload.code : undefined;
}

/**
 * Thông điệp theo mã lỗi ổn định.
 *
 * SECURITY: mọi lý do `verify` thất bại đều tới đây dưới cùng một mã `GUEST_LOOKUP_INVALID`, nên hàm này không
 * được suy ra lý do từ status hay từ `message` của backend — làm vậy sẽ dựng lại đúng kênh rò rỉ mà API vừa bịt.
 * 429 không mã là throttle theo IP ở tầng ngoài (chưa chạm tới challenge nào) nên nói "thử lại sau" là an toàn.
 */
export function guestLookupErrorMessage(error: unknown, fallback: string): string {
  const code = guestLookupErrorCode(error);
  if (code && GUEST_LOOKUP_ERROR_MESSAGES[code]) return GUEST_LOOKUP_ERROR_MESSAGES[code];
  if (error instanceof ApiError && error.status === 503) {
    return GUEST_LOOKUP_ERROR_MESSAGES[GuestLookupErrorCode.UNAVAILABLE];
  }
  if (error instanceof ApiError && error.status === 429) return 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.';
  return apiErrorMessage(error, fallback);
}

/** Grant không còn dùng được (hết hạn/bị thu hồi): bỏ khỏi storage và mời xác thực lại. */
export function isGuestLookupTokenInvalid(error: unknown): boolean {
  return guestLookupErrorCode(error) === GuestLookupErrorCode.TOKEN_INVALID
    || (error instanceof ApiError && error.status === 401);
}

/**
 * Chỉ đúng với backend **cũ** còn trả `GUEST_LOOKUP_LOCKED`: khoá ô nhập và bắt gửi mã mới.
 *
 * API hiện tại đã gộp trường hợp hết lượt vào `GUEST_LOOKUP_INVALID`, nên với backend mới hàm này luôn `false`
 * và khách cứ nhập lại bình thường — server mới là nơi đếm lượt. Giữ nhánh này để bản cũ chưa deploy không rơi
 * vào vòng lặp nhập mã đã chết; xoá được khi mọi môi trường đã lên bản đã hardening.
 */
export function isGuestLookupLocked(error: unknown): boolean {
  return guestLookupErrorCode(error) === GuestLookupErrorCode.LOCKED_LEGACY;
}
