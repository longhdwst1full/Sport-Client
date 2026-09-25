import { call, debounce, select, takeEvery } from 'redux-saga/effects';
import { isCustomerAuthenticated } from '@/features/auth/model/auth-token.store';
import { syncAccountCart, toCartLines } from '@/features/cart/api/cart-sync';
import {
  addCartItem,
  clearCart,
  hydrateCart,
  removeCartItem,
  resetCartForSignOut,
  updateQuantity,
  type CartItem,
} from './cart.slice';
import type { RootState } from './store';
import { createBrowserStore, LocalStorageKey } from '@/core/storage';

const CART_STORAGE_KEY = LocalStorageKey.CART;

// Hydration chỉ nhận field trong allowlist và bỏ bản ghi sai schema
// (`07-state-tools-performance.md`, RULE-CORE-01).
const cartStore = createBrowserStore<CartItem[]>(CART_STORAGE_KEY, {
  parse: (parsed) =>
    Array.isArray(parsed)
      ? parsed
          .filter(isCartItem)
          .map(({ productId, variantId, sku, productType, name, price, quantity, imageUrl }) => ({
            productId,
            variantId,
            sku,
            productType,
            name,
            price,
            quantity,
            imageUrl,
          }))
      : [],
});

function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'productId' in value &&
    typeof value.productId === 'string' &&
    'variantId' in value &&
    typeof value.variantId === 'string' &&
    'sku' in value &&
    typeof value.sku === 'string' &&
    'productType' in value &&
    (value.productType === 'STANDARD' || value.productType === 'BUNDLE') &&
    'name' in value &&
    typeof value.name === 'string' &&
    'price' in value &&
    typeof value.price === 'number' &&
    'quantity' in value &&
    typeof value.quantity === 'number' &&
    value.quantity > 0
  );
}

export function readPersistedCart(): CartItem[] {
  return cartStore.read() ?? [];
}

function* persistCart() {
  const items: CartItem[] = yield select((state: RootState) => state.cart.items);
  cartStore.write(items);
}

/**
 * Đang đăng nhập thì giỏ tài khoản là nguồn chung giữa các máy: mỗi thay đổi do người dùng thực hiện
 * được ghi lên server (gom các thao tác liên tiếp trong 400ms). `hydrateCart` (tải từ server/local) và
 * `resetCartForSignOut` không ghi ngược lên, nếu không sẽ tự xoá giỏ tài khoản khi đăng xuất.
 * Lỗi mạng chỉ bỏ qua: giỏ trên máy vẫn đúng và checkout luôn đồng bộ lại trước khi báo giá.
 */
function* writeThroughAccountCart() {
  if (!isCustomerAuthenticated()) return;
  const items: CartItem[] = yield select((state: RootState) => state.cart.items);
  try {
    yield call(syncAccountCart, toCartLines(items), 'lenient');
  } catch {
    // Có chủ đích: xem chú thích ở trên.
  }
}

export function* rootSaga() {
  yield takeEvery(
    [addCartItem.type, removeCartItem.type, updateQuantity.type, clearCart.type, hydrateCart.type, resetCartForSignOut.type],
    persistCart,
  );
  yield debounce(
    400,
    [addCartItem.type, removeCartItem.type, updateQuantity.type, clearCart.type],
    writeThroughAccountCart,
  );
}
