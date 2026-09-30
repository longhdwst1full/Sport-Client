/**
 * Mã lỗi ổn định của API tra cứu đơn khách vãng lai (`api/src/modules/order/guest-order-lookup.constants.ts`).
 *
 * SECURITY: `verify` chỉ trả đúng một mã thất bại — 400 `GUEST_LOOKUP_INVALID` — cho mọi lý do (sai mã, hết hạn,
 * không có challenge, hết lượt thử, cặp mã đơn/email không tồn tại). Lý do thật chỉ nằm trong log của server.
 * Nếu giao diện phân biệt được các lý do này thì kẻ tấn công dò ra cặp (mã đơn, email) nào có thật.
 */
export const GuestLookupErrorCode = {
  INVALID: 'GUEST_LOOKUP_INVALID',
  TOKEN_INVALID: 'GUEST_LOOKUP_TOKEN_INVALID',
  /** Thiếu khoá HMAC phía server (503): tính năng tạm ngưng, không phải lỗi của khách. */
  UNAVAILABLE: 'GUEST_LOOKUP_UNAVAILABLE',
  /**
   * Đã gỡ khỏi API (trước đây là 429 khi hết lượt thử của một mã). Giữ lại **chỉ** để một backend cũ chưa
   * cập nhật vẫn được xử lý; nó dùng chung thông điệp với `INVALID` nên giao diện không lộ thêm gì.
   */
  LOCKED_LEGACY: 'GUEST_LOOKUP_LOCKED',
} as const;

export const GUEST_LOOKUP_RESEND_COOLDOWN_SECONDS = 60;
export const GUEST_LOOKUP_CODE_LENGTH = 6;
export const GUEST_LOOKUP_ROUTE = '/orders/lookup';

export const GUEST_LOOKUP_COPY = {
  title: 'Tra cứu đơn hàng',
  intro: 'Nhập mã đơn và email người nhận đã dùng khi đặt hàng. Chúng tôi sẽ gửi mã xác thực 6 chữ số tới email đó.',
  /**
   * SECURITY: luôn cùng một câu dù mã đơn/email có khớp hay không (và cả khi server giới hạn tần suất) —
   * không để giao diện tiết lộ đơn nào tồn tại.
   */
  sent: 'Nếu thông tin khớp với một đơn hàng, mã xác thực đã được gửi tới email của bạn. Mã có hiệu lực trong 10 phút.',
  codeLabel: 'Mã xác thực (6 chữ số)',
  viaLookupNotice: 'Bạn đang xem đơn bằng mã xác thực email. Quyền xem hết hạn lúc',
  viaLookupReadOnly: 'Để thanh toán, huỷ đơn hoặc đổi trả, vui lòng mở đơn trên trình duyệt đã đặt hàng hoặc liên hệ hotline.',
} as const;

/**
 * SECURITY: một câu duy nhất cho mọi thất bại của `verify`. Câu này phải đúng dù lý do thật là sai mã, mã hết hạn,
 * hết lượt thử hay không hề có đơn nào khớp — nên nó chỉ nói "không dùng được" và mời gửi mã mới, không khẳng định
 * mã "sai" cũng không khẳng định đơn có tồn tại.
 */
export const GUEST_LOOKUP_INVALID_MESSAGE =
  'Mã xác thực không dùng được. Mã có thể sai, đã hết hạn hoặc đã dùng quá số lần. Vui lòng gửi mã mới rồi thử lại.';

export const GUEST_LOOKUP_ERROR_MESSAGES: Record<string, string> = {
  [GuestLookupErrorCode.INVALID]: GUEST_LOOKUP_INVALID_MESSAGE,
  // Backend cũ: dùng đúng câu của INVALID để hai trường hợp không phân biệt được từ phía khách.
  [GuestLookupErrorCode.LOCKED_LEGACY]: GUEST_LOOKUP_INVALID_MESSAGE,
  [GuestLookupErrorCode.TOKEN_INVALID]: 'Phiên tra cứu đơn đã hết hạn. Vui lòng xác thực lại bằng email.',
  [GuestLookupErrorCode.UNAVAILABLE]: 'Tra cứu đơn bằng email đang tạm ngưng. Vui lòng thử lại sau hoặc gọi hotline.',
};
