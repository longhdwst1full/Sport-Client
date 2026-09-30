/**
 * Nhận biết tin nhắn hỏi về đơn hàng để mời khách ẩn danh xác thực đơn bằng email (trợ lý không tra đơn của khách
 * ẩn danh khi chưa có grant). Chỉ là gợi ý UI — không chặn gửi và không thay quyết định của backend.
 */
// `\b` của JS chỉ hiểu ký tự ASCII nên không đặt trước chữ có dấu như "đơn".
const ORDER_INTENT_PATTERN =
  /(đơn\s*hàng|don\s*hang|mã\s*đơn|ma\s*don|đơn\s+(của|cua)\s+(tôi|toi|mình|minh|em)|tra\s*(cứu|cuu)\s*đơn|vận\s*đơn|\border\b|\bDH\d{6,}\b)/i;

export function mentionsOrder(text: string | null | undefined): boolean {
  return Boolean(text && ORDER_INTENT_PATTERN.test(text));
}
