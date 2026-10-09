import { ApiError } from '@/lib/api/fetcher';
import { apiErrorMessage } from '@/lib/api/error-message';

/** Mã lỗi ổn định của API Support (`api/src/modules/support/support.constants.ts`). */
export const SupportErrorCode = {
  TICKET_NOT_FOUND: 'SUPPORT_TICKET_NOT_FOUND',
  CUSTOMER_NOT_FOUND: 'SUPPORT_CUSTOMER_NOT_FOUND',
  CONVERSATION_NOT_FOUND: 'SUPPORT_CONVERSATION_NOT_FOUND',
  BRANCH_INVALID: 'SUPPORT_BRANCH_INVALID',
  TICKET_CLOSED: 'SUPPORT_TICKET_CLOSED',
  VERSION_CONFLICT: 'SUPPORT_VERSION_CONFLICT',
  CONCURRENT_UPDATE: 'SUPPORT_CONCURRENT_UPDATE',
  IDEMPOTENCY_KEY_INVALID: 'SUPPORT_IDEMPOTENCY_KEY_INVALID',
  IDEMPOTENCY_CONFLICT: 'SUPPORT_IDEMPOTENCY_CONFLICT',
  PERSISTENCE_DISABLED: 'SUPPORT_PERSISTENCE_DISABLED',
  CONSULTATION_RATE_LIMITED: 'SUPPORT_CONSULTATION_RATE_LIMITED',
  CONSULTATION_PHONE_INVALID: 'SUPPORT_CONSULTATION_PHONE_INVALID',
} as const;

const SUPPORT_ERROR_MESSAGES: Record<string, string> = {
  [SupportErrorCode.TICKET_NOT_FOUND]: 'Không tìm thấy yêu cầu hỗ trợ.',
  [SupportErrorCode.CUSTOMER_NOT_FOUND]: 'Tài khoản chưa có hồ sơ khách hàng nên chưa gửi được yêu cầu hỗ trợ.',
  [SupportErrorCode.CONVERSATION_NOT_FOUND]: 'Không tìm thấy cuộc trò chuyện với trợ lý để đính kèm.',
  [SupportErrorCode.BRANCH_INVALID]: 'Chi nhánh liên quan không hợp lệ hoặc đã ngừng hoạt động. Vui lòng thử lại.',
  [SupportErrorCode.TICKET_CLOSED]: 'Yêu cầu đã đóng. Vui lòng tạo yêu cầu mới nếu cần hỗ trợ thêm.',
  [SupportErrorCode.VERSION_CONFLICT]: 'Yêu cầu vừa có cập nhật mới. Hãy xem lại trao đổi rồi gửi lại.',
  [SupportErrorCode.CONCURRENT_UPDATE]: 'Yêu cầu vừa có cập nhật mới. Hãy xem lại trao đổi rồi gửi lại.',
  [SupportErrorCode.IDEMPOTENCY_KEY_INVALID]: 'Yêu cầu gửi không hợp lệ. Vui lòng bấm gửi lại.',
  [SupportErrorCode.IDEMPOTENCY_CONFLICT]: 'Nội dung khác với lần gửi trước đó. Vui lòng bấm gửi lại.',
  [SupportErrorCode.PERSISTENCE_DISABLED]: 'Hệ thống hỗ trợ đang tạm ngưng. Vui lòng gọi hotline.',
  [SupportErrorCode.CONSULTATION_RATE_LIMITED]: 'Số điện thoại này đã gửi nhiều yêu cầu trong 24 giờ. Nhân viên sẽ liên hệ, hoặc bạn gọi hotline.',
  [SupportErrorCode.CONSULTATION_PHONE_INVALID]: 'Số điện thoại chưa đúng định dạng Việt Nam.',
};

export function supportErrorCode(error: unknown): string | undefined {
  if (!(error instanceof ApiError)) return undefined;
  const payload = error.payload as { code?: unknown } | undefined;
  return typeof payload?.code === 'string' ? payload.code : undefined;
}

/** Thông điệp cho khách: ưu tiên theo mã lỗi ổn định, không dựa vào câu chữ `message` của backend. */
export function supportErrorMessage(error: unknown, fallback: string): string {
  const code = supportErrorCode(error);
  if (code && SUPPORT_ERROR_MESSAGES[code]) return SUPPORT_ERROR_MESSAGES[code];
  if (error instanceof ApiError && error.status === 429) return SUPPORT_ERROR_MESSAGES[SupportErrorCode.CONSULTATION_RATE_LIMITED];
  if (error instanceof ApiError && error.status === 503) return SUPPORT_ERROR_MESSAGES[SupportErrorCode.PERSISTENCE_DISABLED];
  return apiErrorMessage(error, fallback);
}

export function isSupportConflict(error: unknown): boolean {
  const code = supportErrorCode(error);
  return code === SupportErrorCode.VERSION_CONFLICT || code === SupportErrorCode.CONCURRENT_UPDATE || code === SupportErrorCode.TICKET_CLOSED;
}

/** Khoá idempotency bị từ chối (400 sai định dạng / 409 đã dùng cho nội dung khác): lần gửi sau sinh khoá mới. */
export function requiresFreshSupportIdempotencyKey(error: unknown): boolean {
  const code = supportErrorCode(error);
  return code === SupportErrorCode.IDEMPOTENCY_KEY_INVALID || code === SupportErrorCode.IDEMPOTENCY_CONFLICT;
}
