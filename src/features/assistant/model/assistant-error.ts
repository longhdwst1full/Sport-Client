import { ApiError } from '@/lib/api/fetcher';
import { apiErrorMessage } from '@/lib/api/error-message';
import { ASSISTANT_COPY, AssistantErrorCode, ASSISTANT_HEADERS } from './assistant.constants';

export function assistantErrorCode(error: unknown): string | undefined {
  if (!(error instanceof ApiError)) return undefined;
  const payload = error.payload as { code?: unknown } | undefined;
  return typeof payload?.code === 'string' ? payload.code : undefined;
}

/** 503 `ASSISTANT_UNAVAILABLE` (tắt, thiếu khoá, DB tắt): hiển thị "Trợ lý đang tạm ngưng", không phải lỗi mạng. */
export function isAssistantUnavailable(error: unknown): boolean {
  return error instanceof ApiError && error.status === 503 && assistantErrorCode(error) === AssistantErrorCode.UNAVAILABLE;
}

/**
 * Hội thoại không dùng tiếp được: không tìm thấy/không thuộc actor (404), session key sai (400) hoặc đã đóng (409).
 * Bỏ hội thoại đang nhớ để lần gửi sau tạo hội thoại mới.
 */
export function isAssistantConversationGone(error: unknown): boolean {
  const code = assistantErrorCode(error);
  return (
    code === AssistantErrorCode.CONVERSATION_NOT_FOUND ||
    code === AssistantErrorCode.SESSION_REQUIRED ||
    code === AssistantErrorCode.CONVERSATION_CLOSED
  );
}

/**
 * IDEMPOTENCY: chỉ khoá đã dùng cho nội dung khác (`IDEMPOTENCY_KEY_REUSED`) mới phải đổi khoá. Lượt gốc chưa xong
 * (`ASSISTANT_TURN_IN_PROGRESS`) thì GIỮ khoá: đổi khoá sẽ sinh lượt thứ hai và trừ quota lần nữa cho cùng một tin.
 */
export function requiresFreshIdempotencyKey(error: unknown): boolean {
  return assistantErrorCode(error) === AssistantErrorCode.IDEMPOTENCY_KEY_REUSED;
}

/** 409 `ASSISTANT_TURN_IN_PROGRESS`: lượt cùng khoá đang chạy ở server. */
export function isAssistantTurnInProgress(error: unknown): boolean {
  return assistantErrorCode(error) === AssistantErrorCode.TURN_IN_PROGRESS;
}

const ASSISTANT_ERROR_MESSAGES: Record<string, string> = {
  [AssistantErrorCode.UNAVAILABLE]: ASSISTANT_COPY.unavailableTitle,
  [AssistantErrorCode.QUOTA_EXCEEDED]: 'Bạn đã dùng hết lượt hỏi trợ lý hôm nay. Vui lòng quay lại sau hoặc liên hệ nhân viên.',
  [AssistantErrorCode.INPUT_TOO_LONG]: 'Tin nhắn quá dài. Vui lòng rút gọn rồi gửi lại.',
  [AssistantErrorCode.INPUT_EMPTY]: 'Vui lòng nhập nội dung tin nhắn.',
  [AssistantErrorCode.CUSTOMER_PROFILE_REQUIRED]:
    'Tài khoản này chưa dùng được trợ lý (không phải tài khoản khách hàng hoặc đang bị khoá). Vui lòng liên hệ hotline.',
  [AssistantErrorCode.CONTENT_INVALID]: 'Tin nhắn chứa ký tự không hợp lệ. Vui lòng sửa lại rồi gửi.',
  [AssistantErrorCode.ORDER_LOOKUP_TOKEN_INVALID]: 'Phiên tra cứu đơn không hợp lệ. Vui lòng tra cứu lại đơn bằng email rồi gửi lại.',
  [AssistantErrorCode.INVALID_BRANCH]: 'Chi nhánh đã chọn không còn hoạt động. Vui lòng tải lại trang rồi thử lại.',
  [AssistantErrorCode.CONVERSATION_CLOSED]: 'Cuộc trò chuyện đã kết thúc. Gửi lại để bắt đầu cuộc trò chuyện mới.',
  [AssistantErrorCode.CONVERSATION_NOT_FOUND]: 'Không tìm thấy cuộc trò chuyện. Gửi lại để bắt đầu cuộc trò chuyện mới.',
  [AssistantErrorCode.SESSION_REQUIRED]: 'Phiên trò chuyện đã hết hạn. Gửi lại để bắt đầu cuộc trò chuyện mới.',
  [AssistantErrorCode.TURN_IN_PROGRESS]: 'Trợ lý vẫn đang xử lý câu trước. Vui lòng thử lại sau giây lát.',
  [AssistantErrorCode.FEEDBACK_NOT_ALLOWED]: 'Câu trả lời này đã được đánh giá.',
};

/** Hết lượt (429) — khách ẩn danh có hạn mức theo phiên thấp hơn tài khoản nên được mời đăng nhập. */
export function isAssistantQuotaExceeded(error: unknown): boolean {
  return (
    assistantErrorCode(error) === AssistantErrorCode.QUOTA_EXCEEDED || (error instanceof ApiError && error.status === 429)
  );
}

const ANONYMOUS_QUOTA_MESSAGE = 'Bạn đã dùng hết lượt hỏi trợ lý cho khách chưa đăng nhập hôm nay. Đăng nhập để hỏi tiếp.';

export function assistantErrorMessage(
  error: unknown,
  fallback: string = ASSISTANT_COPY.sendError,
  options: { isAuthenticated?: boolean } = {},
): string {
  if (options.isAuthenticated === false && isAssistantQuotaExceeded(error)) return ANONYMOUS_QUOTA_MESSAGE;
  const code = assistantErrorCode(error);
  if (code && ASSISTANT_ERROR_MESSAGES[code]) return ASSISTANT_ERROR_MESSAGES[code];
  if (error instanceof ApiError && error.status === 429) return ASSISTANT_ERROR_MESSAGES[AssistantErrorCode.QUOTA_EXCEEDED];
  return apiErrorMessage(error, fallback);
}

/**
 * SECURITY: `sessionKey` chỉ gửi cho khách ẩn danh; khách đăng nhập đi bằng bearer của `apiFetcher` (backend ưu tiên
 * bearer), không gửi kèm session key cũ để không trộn hai danh tính trên một request.
 */
export function assistantRequestHeaders(
  sessionKey: string | null | undefined,
  idempotencyKey?: string,
  orderLookupToken?: string | null,
): Record<string, string> {
  const headers: Record<string, string> = {};
  if (sessionKey) headers[ASSISTANT_HEADERS.SESSION] = sessionKey;
  if (idempotencyKey) headers[ASSISTANT_HEADERS.IDEMPOTENCY] = idempotencyKey;
  // SECURITY: grant tra đơn chỉ đi qua header (không bao giờ trong nội dung tin nhắn) và chỉ cho khách ẩn danh —
  // caller không truyền token khi đã đăng nhập (backend cũng bỏ qua nếu có bearer).
  if (orderLookupToken) headers[ASSISTANT_HEADERS.ORDER_LOOKUP_TOKEN] = orderLookupToken;
  return headers;
}

/** Header grant tra đơn sai định dạng (400): bỏ grant đó để lần gửi sau không gửi lại. */
export function isAssistantOrderLookupTokenInvalid(error: unknown): boolean {
  return assistantErrorCode(error) === AssistantErrorCode.ORDER_LOOKUP_TOKEN_INVALID;
}
