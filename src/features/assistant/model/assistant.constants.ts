export const ASSISTANT_TITLE = 'Trợ lý mua sắm';
/** Trần phía client; server còn kẹp theo tham số `ASSISTANT_MAX_INPUT_CHARS` (lỗi `ASSISTANT_INPUT_TOO_LONG`). */
export const ASSISTANT_MESSAGE_MAX_LENGTH = 2000;
export const ASSISTANT_HISTORY_PAGE_SIZE = 30;
export const ASSISTANT_DIALOG_ID = 'assistant-chat-dialog';

/**
 * Một lượt chat gồm nhiều vòng LLM + tool (API: `ASSISTANT_LLM_TIMEOUT_MS` × số bước), dài hơn hẳn timeout 10 giây
 * mặc định của `apiClient`. Chỉ lời gọi `sendChatMessage` dùng trần này.
 */
export const ASSISTANT_SEND_TIMEOUT_MS = 90_000;

/**
 * IDEMPOTENCY: lượt đang chạy (`ASSISTANT_TURN_IN_PROGRESS`) thì giữ nguyên khoá và hỏi lại lịch sử định kỳ; quá trần
 * thì gửi lại đúng khoá đó (API replay lượt gốc, hoặc chạy lại lượt kẹt sau `TURN_REDRIVE_AFTER_MS` = 120 giây).
 */
export const ASSISTANT_TURN_POLL = {
  INTERVAL_MS: 3_000,
  MAX_WAIT_MS: 120_000,
} as const;

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
  ORDER_LOOKUP_TOKEN_INVALID: 'ASSISTANT_ORDER_LOOKUP_TOKEN_INVALID',
} as const;

export const ASSISTANT_HEADERS = {
  /** Session key của khách ẩn danh; khách đăng nhập dùng bearer của transport, không gửi header này. */
  SESSION: 'x-assistant-session',
  IDEMPOTENCY: 'idempotency-key',
  /** Grant tra đơn khách vãng lai (OTP email). Chỉ khách ẩn danh; KHÔNG bao giờ đưa vào nội dung chat. */
  ORDER_LOOKUP_TOKEN: 'x-order-lookup-token',
} as const;

/**
 * Gợi ý câu hỏi hiện dưới lời chào khi hội thoại chưa có tin của khách. Mỗi câu nằm trong phạm vi tool khách của API
 * (`api/src/modules/assistant/tools/client-tools.ts`), ghi ở `tool`:
 * - Không có gợi ý "đang giảm giá": chưa có tool lọc khuyến mãi.
 * - Không hỏi "phí giao hàng về <tỉnh>": `calculate_shipping` cần chi nhánh của hội thoại mà Storefront chưa gửi
 *   `branchId`; hỏi giao hàng/lắp đặt chung đi qua `search_knowledge`.
 * - `orderLookup: true`: khách ẩn danh chưa có grant tra đơn thì chip dẫn tới `/orders/lookup` thay vì gửi (trợ lý
 *   không tra đơn khi thiếu grant, gửi chỉ tốn lượt).
 */
export const ASSISTANT_SUGGESTIONS = [
  { id: 'treadmill-family', content: 'Gợi ý máy chạy bộ cho gia đình', tool: 'search_products' },
  { id: 'exercise-bike-budget', content: 'Xe đạp tập dưới 5 triệu', tool: 'search_products' },
  { id: 'table-tennis-compare', content: 'So sánh các mẫu bàn bóng bàn', tool: 'compare_products' },
  { id: 'return-policy', content: 'Chính sách đổi trả thế nào?', tool: 'get_return_policy' },
  { id: 'delivery-install', content: 'Shop có giao hàng và lắp đặt tận nơi không?', tool: 'search_knowledge' },
  { id: 'my-order', content: 'Tra cứu đơn hàng của tôi', tool: 'get_my_order_status', orderLookup: true },
] as const;

export type AssistantSuggestion = (typeof ASSISTANT_SUGGESTIONS)[number];

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
  orderLookupHint: 'Để trợ lý xem được đơn của bạn khi chưa đăng nhập, hãy xác thực đơn bằng email trước.',
  orderLookupLink: 'Tra cứu đơn bằng email',
  handedOff: 'Cuộc trò chuyện đã được chuyển cho nhân viên. Theo dõi phản hồi trong mục Hỗ trợ của tôi.',
  inStock: 'Còn hàng',
  outOfStock: 'Hết hàng',
  viewProduct: 'Xem sản phẩm',
  buyNow: 'Mua ngay',
  suggestionsLabel: 'Gợi ý câu hỏi',
} as const;
