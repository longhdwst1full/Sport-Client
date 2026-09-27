/**
 * Trạng thái báo giá phí giao tại thời điểm khách bấm "Đặt hàng".
 *
 * Báo giá tự động chạy sau 700 ms debounce kể từ lần đổi form cuối (đổi phương thức thanh toán, cách
 * giao, ghi chú…). Trong khoảng debounce đó chưa có quote nhưng cũng chưa có lượt gọi nào đang chạy;
 * trước đây trang coi khoảng này là "không tính được phí" và báo "Chưa có phí vận chuyển" dù API vẫn
 * báo giá bình thường. Lượt báo giá lỗi thật cũng bị câu chung đó che mất lý do từ API.
 */
export type CheckoutQuoteGate =
  | { kind: 'ADDRESS_INCOMPLETE' }
  | { kind: 'QUOTING' }
  | { kind: 'QUOTE_FAILED'; reason: string }
  | { kind: 'READY' };

export function resolveCheckoutQuoteGate(input: {
  readyToQuote: boolean;
  autoQuoting: boolean;
  hasQuote: boolean;
  /** Lỗi của lượt báo giá gần nhất; rỗng khi chưa có lỗi hoặc form vừa đổi. */
  quoteError: string;
}): CheckoutQuoteGate {
  if (!input.readyToQuote) return { kind: 'ADDRESS_INCOMPLETE' };
  if (input.hasQuote) return { kind: 'READY' };
  if (input.autoQuoting) return { kind: 'QUOTING' };
  if (input.quoteError) return { kind: 'QUOTE_FAILED', reason: input.quoteError };
  // Đủ địa chỉ, chưa có quote, chưa lỗi: effect báo giá đang chờ hết debounce.
  return { kind: 'QUOTING' };
}
