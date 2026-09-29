export const ASSISTANT_TITLE = 'Trợ lý mua sắm';
/** Trần phía client; server còn kẹp theo tham số `ASSISTANT_MAX_INPUT_CHARS` (lỗi `ASSISTANT_INPUT_TOO_LONG`). */
export const ASSISTANT_MESSAGE_MAX_LENGTH = 2000;
export const ASSISTANT_HISTORY_PAGE_SIZE = 30;
export const ASSISTANT_DIALOG_ID = 'assistant-chat-dialog';

/** Mã lỗi ổn định của API Assistant (`api/src/modules/assistant/assistant.constants.ts`). */
export const AssistantErrorCode = {
  UNAVAILABLE: 'ASSISTANT_UNAVAILABLE',
  QUOTA_EXCEEDED: 'ASSISTANT_QUOTA_EXCEEDED',
  INPUT_TOO_LONG: 'ASSISTANT_INPUT_TOO_LONG',
  INPUT_EMPTY: 'ASSISTANT_INPUT_EMPTY',
  CONTENT_INVALID: 'ASSISTANT_CONTENT_INVALID',
  INVALID_BRANCH: 'ASSISTANT_INVALID_BRANCH',
  CONVERSATION_NOT_FOUND: 'ASSISTANT_CONVERSATION_NOT_FOUND',
  CONVERSATION_CLOSED: 'ASSISTANT_CONVERSATION_CLOSED',
  MESSAGE_NOT_FOUND: 'ASSISTANT_MESSAGE_NOT_FOUND',
  FEEDBACK_NOT_ALLOWED: 'ASSISTANT_FEEDBACK_NOT_ALLOWED',
  CUSTOMER_PROFILE_REQUIRED: 'ASSISTANT_CUSTOMER_PROFILE_REQUIRED',
  SESSION_REQUIRED: 'ASSISTANT_SESSION_REQUIRED',
  IDEMPOTENCY_KEY_REUSED: 'IDEMPOTENCY_KEY_REUSED',
  TURN_IN_PROGRESS: 'ASSISTANT_TURN_IN_PROGRESS',
} as const;

export const ASSISTANT_HEADERS = {
  /** Session key của khách ẩn danh; khách đăng nhập dùng bearer của transport, không gửi header này. */
  SESSION: 'x-assistant-session',
  IDEMPOTENCY: 'idempotency-key',
} as const;

export const ASSISTANT_HANDOFF_SUBJECT = 'Chuyển nhân viên từ trợ lý mua sắm';

export const ASSISTANT_COPY = {
  unavailableTitle: 'Trợ lý đang tạm ngưng',
  unavailableBody: 'Bạn vẫn có thể liên hệ nhân viên qua hotline hoặc trang liên hệ.',
  contactLink: 'Liên hệ hỗ trợ',
  greeting: 'Xin chào! Mình có thể giúp bạn tìm sản phẩm, xem giá, còn hàng hay không, phí giao hàng và chính sách đổi trả.',
  inputLabel: 'Nhập câu hỏi cho trợ lý',
  inputPlaceholder: 'Hỏi về sản phẩm, đơn hàng, đổi trả...',
  sendError: 'Không gửi được tin nhắn. Vui lòng thử lại.',
  historyError: 'Không tải được lịch sử trò chuyện.',
  feedbackError: 'Không gửi được đánh giá.',
  handoff: 'Chuyển nhân viên',
  handoffSuggested: 'Trợ lý chưa trả lời được câu này. Bạn có muốn chuyển cho nhân viên?',
  handoffLoginRequired: 'Vui lòng đăng nhập để chuyển yêu cầu cho nhân viên — phiếu hỗ trợ gắn với tài khoản của bạn.',
  handedOff: 'Cuộc trò chuyện đã được chuyển cho nhân viên. Theo dõi phản hồi trong mục Hỗ trợ của tôi.',
  inStock: 'Còn hàng',
  outOfStock: 'Hết hàng',
  viewProduct: 'Xem sản phẩm',
  addToCart: 'Thêm vào giỏ',
} as const;
