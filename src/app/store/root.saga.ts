import { select, takeEvery } from 'redux-saga/effects';
import { addCartItem, clearCart, removeCartItem, updateQuantity, type CartItem } from './cart.slice';
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

export function* rootSaga() {
  yield takeEvery(
    [addCartItem.type, removeCartItem.type, updateQuantity.type, clearCart.type],
    persistCart,
  );
}
