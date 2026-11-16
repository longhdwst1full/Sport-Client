import { isCustomerAuthenticated } from '@/core/auth/customer-auth-token.store';
import { createBrowserStore, LocalStorageKey } from '@/core/storage';
import type { CartItem } from '../model/cart.slice';
import { readPersistedCart } from '../model/cart.saga';
import { syncAccountCart, toCartLines, toLocalCartItems, type CartLine } from './cart-sync';

/**
 * Báo giá checkout của tài khoản đọc TOÀN BỘ giỏ trên server (contract không nhận danh sách dòng), nên
 * "Mua ngay" hoặc chọn một phần giỏ phải cắt giỏ server xuống đúng các dòng đang thanh toán. Các dòng còn
 * lại chỉ còn ở giỏ trên máy.
 *
 * Trước đây không có gì đẩy chúng lên lại: bỏ ngang checkout rồi mở lại app thì `Providers` tải giỏ server
 * (đã bị cắt) về và ghi đè giỏ máy; thanh toán VNPay thì trang chuyển sang cổng trước khi lệnh ghi
 * (debounce 400ms) kịp chạy, còn đặt đơn chuyển giỏ server sang CONVERTED. Cả hai đường đều mất các dòng
 * khách không mua.
 *
 * Cờ này đánh dấu "giỏ server đang bị cắt, giỏ trên máy là bản đúng". Nó nằm cùng localStorage với giỏ trên
 * máy, nên storage bị chặn thì cờ cũng không đặt được và không có lệnh đẩy giỏ rỗng nào lên server.
 */
const restorePendingStore = createBrowserStore<true>(LocalStorageKey.ACCOUNT_CART_RESTORE_PENDING, {
  parse: (raw) => (raw === true ? true : undefined),
});

export function hasPendingAccountCartRestore(): boolean {
  return restorePendingStore.read() === true;
}

/**
 * Đăng xuất / đổi tài khoản phải bỏ cờ: giỏ trên máy vừa bị xoá, đẩy nó lên tài khoản kế tiếp sẽ xoá sạch
 * giỏ của người đó.
 */
export function clearAccountCartRestore(): void {
  restorePendingStore.clear();
}

/**
 * Thay cho `syncAccountCart(lines)` ở bước báo giá. Đặt cờ TRƯỚC khi cắt giỏ server, để tab bị đóng giữa
 * chừng vẫn được khôi phục ở lần mở app sau.
 */
export async function syncAccountCartForCheckout(lines: CartLine[]): Promise<void> {
  const checkoutIds = new Set(lines.map((line) => line.variantId));
  const trimsCart = readPersistedCart().some((item) => !checkoutIds.has(item.variantId));
  if (trimsCart) restorePendingStore.write(true);
  await syncAccountCart(lines);
}

/**
 * Đẩy giỏ trên máy lên giỏ tài khoản nếu checkout trước đó đã cắt nó; trả giỏ server sau khi khôi phục.
 *
 * Trả `undefined` khi không có gì cần làm (không có cờ / chưa đăng nhập). Lỗi mạng thì ném và GIỮ cờ, để lần
 * sau thử lại. Đọc giỏ đã persist (không phải state Redux) vì saga ghi localStorage đồng bộ ngay sau mỗi
 * thao tác giỏ, nên giá trị này đúng cả khi gọi lúc rời trang.
 */
export async function restoreAccountCartFromDevice(): Promise<CartItem[] | undefined> {
  if (!hasPendingAccountCartRestore() || !isCustomerAuthenticated()) return undefined;
  const restored = await syncAccountCart(toCartLines(readPersistedCart()), 'lenient');
  restorePendingStore.clear();
  return toLocalCartItems(restored);
}
