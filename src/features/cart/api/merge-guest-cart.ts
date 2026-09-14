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
 * Lỗi ở bước này **không được chặn đăng nhập**: khách đã xác thực thành công rồi,
 * hỏng việc gộp giỏ thì cùng lắm là mất giỏ tạm, không phải mất phiên.
 */
export async function mergeGuestCartAfterAuth(): Promise<void> {
  const guestToken = readGuestCartToken();
  if (!guestToken) return;

  try {
    await mergeGuestCartIntoAccount({ headers: { 'x-cart-token': guestToken } });
    // Server đã đóng giỏ vãng lai; giữ token lại chỉ gây nhầm ở lần checkout sau.
    clearGuestCartToken();
  } catch {
    // Im lặng có chủ đích: xem chú thích ở đầu hàm.
  }
}
