/** Mã lỗi ổn định của API tra cứu đơn khách vãng lai (`api/src/modules/order`). */
export const GuestLookupErrorCode = {
  INVALID: 'GUEST_LOOKUP_INVALID',
  LOCKED: 'GUEST_LOOKUP_LOCKED',
  TOKEN_INVALID: 'GUEST_LOOKUP_TOKEN_INVALID',
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

export const GUEST_LOOKUP_ERROR_MESSAGES: Record<string, string> = {
  [GuestLookupErrorCode.INVALID]: 'Mã xác thực không đúng hoặc đã hết hạn. Kiểm tra lại hoặc gửi mã mới.',
  [GuestLookupErrorCode.LOCKED]: 'Bạn đã nhập sai quá số lần cho phép. Vui lòng gửi mã mới.',
  [GuestLookupErrorCode.TOKEN_INVALID]: 'Phiên tra cứu đơn đã hết hạn. Vui lòng xác thực lại bằng email.',
};
