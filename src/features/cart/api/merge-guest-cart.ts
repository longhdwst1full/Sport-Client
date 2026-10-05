import { mergeGuestCartIntoAccount } from '@/generated/api/cart/cart';
import { clearGuestCartToken, readGuestCartToken } from '../model/guest-cart-token.store';

/**
 * Gộp giỏ khách vãng lai vào giỏ tài khoản ngay sau khi đăng nhập hoặc đăng ký.
 *
 * Kịch bản thật: khách duyệt web, bỏ hàng vào giỏ, đến lúc thanh toán mới tạo
 * tài khoản. Không gộp thì giỏ vừa chọn biến mất đúng lúc khách sắp mua.
 *
 * Phạm vi: **chỉ trên cùng một trình duyệt** — token giỏ vãng lai nằm ở máy khách.
 * Đây không phải đồng bộ giỏ giữa nhiều thiết bị.
 *
 * Lỗi ở bước này **không được chặn đăng nhập**, nhưng cũng **không được nuốt im lặng**: nơi gọi
 * cần biết gộp thất bại để giữ nguyên giỏ trên máy thay vì thay bằng giỏ tài khoản (có thể rỗng).
 * Token giỏ khách chỉ bị xoá khi gộp thành công, nên còn token lúc đã đăng nhập nghĩa là còn một
 * lần gộp đang chờ — xem `retryPendingGuestCartMerge`. Server gộp trong transaction có khoá và
 * idempotent (giỏ khách chuyển CONVERTED), nên gọi lại với cùng token là an toàn.
 *
 * @returns `true` khi đã gộp (hoặc không có gì để gộp), `false` khi gộp lỗi và token được giữ lại.
 */
export async function mergeGuestCartAfterAuth(): Promise<boolean> {
  const guestToken = readGuestCartToken();
  if (!guestToken) return true;

  try {
    await mergeGuestCartIntoAccount({ headers: { 'x-cart-token': guestToken } });
  } catch {
    // Giữ token để lần sau gộp lại; không ném lỗi để không chặn đăng nhập.
    return false;
  }
  // Server đã đóng giỏ vãng lai; giữ token lại chỉ gây nhầm ở lần checkout sau.
  clearGuestCartToken();
  return true;
}
