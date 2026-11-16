// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CartDto, CartItemDto } from '@/generated/api/cart/cart.schemas';
import { LocalStorageKey } from '@/core/storage';

const api = vi.hoisted(() => ({
  getAccountCart: vi.fn(),
  removeAccountCartItem: vi.fn(),
  setAccountCartItem: vi.fn(),
  updateAccountCartItem: vi.fn(),
}));
vi.mock('@/generated/api/cart/cart', () => api);

const auth = vi.hoisted(() => ({ authenticated: true }));
vi.mock('@/core/auth/customer-auth-token.store', () => ({
  isCustomerAuthenticated: () => auth.authenticated,
}));

import {
  clearAccountCartRestore,
  hasPendingAccountCartRestore,
  restoreAccountCartFromDevice,
  syncAccountCartForCheckout,
} from './account-cart-restore';

const serverItem = (variantId: string, quantity: number): CartItemDto => ({
  id: `item-${variantId}`,
  productVariantId: variantId,
  productId: `product-${variantId}`,
  productType: 'STANDARD',
  sku: `SKU-${variantId}`,
  name: 'Mặc định',
  productName: `Sản phẩm ${variantId}`,
  productSlug: `san-pham-${variantId}`,
  quantity,
  availableQuantity: 5,
  unitPricePreview: '100000.00',
  lineTotalPreview: null,
  imageUrl: null,
});
const cart = (items: CartItemDto[], version = 1): CartDto => ({
  id: '1', status: 'ACTIVE', currencyCode: 'VND', version, items, subtotalPreview: '0.00', expiresAt: null,
});
const localLine = (variantId: string, quantity: number) => ({
  productId: `product-${variantId}`,
  variantId,
  sku: `SKU-${variantId}`,
  productType: 'STANDARD',
  name: `Sản phẩm ${variantId}`,
  price: 100000,
  quantity,
});
/** Giỏ trên máy, đúng định dạng saga persist. */
const persistLocalCart = (lines: ReturnType<typeof localLine>[]) =>
  window.localStorage.setItem(LocalStorageKey.CART, JSON.stringify(lines));

describe('khôi phục giỏ tài khoản sau checkout một phần', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    auth.authenticated = true;
  });

  it('mua ngay một món trong giỏ nhiều món: đặt cờ trước khi cắt giỏ server', async () => {
    persistLocalCart([localLine('A', 1), localLine('B', 2), localLine('C', 1)]);
    api.getAccountCart.mockImplementation(async () => {
      // Cờ phải có TRƯỚC lệnh ghi đầu tiên: tab đóng giữa chừng vẫn được khôi phục lần sau.
      expect(hasPendingAccountCartRestore()).toBe(true);
      return cart([serverItem('A', 1), serverItem('B', 2), serverItem('C', 1)]);
    });
    api.removeAccountCartItem.mockImplementation(async (itemId: string) =>
      cart([serverItem('A', 1), ...(itemId === 'item-B' ? [serverItem('C', 1)] : [])], 2),
    );

    await syncAccountCartForCheckout([{ variantId: 'A', quantity: 1 }]);

    expect(api.removeAccountCartItem).toHaveBeenCalledTimes(2);
    expect(hasPendingAccountCartRestore()).toBe(true);
  });

  it('thanh toán cả giỏ: không đặt cờ', async () => {
    persistLocalCart([localLine('A', 1), localLine('B', 2)]);
    api.getAccountCart.mockResolvedValue(cart([serverItem('A', 1), serverItem('B', 2)]));

    await syncAccountCartForCheckout([{ variantId: 'A', quantity: 1 }, { variantId: 'B', quantity: 2 }]);

    expect(hasPendingAccountCartRestore()).toBe(false);
  });

  it('khôi phục: đẩy các dòng còn lại lên giỏ server (kể cả giỏ CONVERTED đã thay bằng giỏ rỗng) rồi bỏ cờ', async () => {
    // Sau khi đặt đơn A, giỏ máy chỉ còn B, C; giỏ server là giỏ mới rỗng.
    persistLocalCart([localLine('B', 2), localLine('C', 1)]);
    window.localStorage.setItem(LocalStorageKey.ACCOUNT_CART_RESTORE_PENDING, 'true');
    api.getAccountCart.mockResolvedValue(cart([], 5));
    api.setAccountCartItem
      .mockResolvedValueOnce(cart([serverItem('B', 2)], 6))
      .mockResolvedValueOnce(cart([serverItem('B', 2), serverItem('C', 1)], 7));

    const restored = await restoreAccountCartFromDevice();

    expect(api.setAccountCartItem).toHaveBeenNthCalledWith(1, { productVariantId: 'B', quantity: 2, expectedCartVersion: 5 });
    expect(api.setAccountCartItem).toHaveBeenNthCalledWith(2, { productVariantId: 'C', quantity: 1, expectedCartVersion: 6 });
    expect(restored?.map((item) => [item.variantId, item.quantity])).toEqual([['B', 2], ['C', 1]]);
    expect(hasPendingAccountCartRestore()).toBe(false);
  });

  it('không có cờ hoặc chưa đăng nhập: không gọi API', async () => {
    persistLocalCart([localLine('B', 2)]);
    expect(await restoreAccountCartFromDevice()).toBeUndefined();

    window.localStorage.setItem(LocalStorageKey.ACCOUNT_CART_RESTORE_PENDING, 'true');
    auth.authenticated = false;
    expect(await restoreAccountCartFromDevice()).toBeUndefined();

    expect(api.getAccountCart).not.toHaveBeenCalled();
  });

  it('lỗi mạng: giữ cờ để lần mở app sau thử lại', async () => {
    persistLocalCart([localLine('B', 2)]);
    window.localStorage.setItem(LocalStorageKey.ACCOUNT_CART_RESTORE_PENDING, 'true');
    api.getAccountCart.mockRejectedValue(new Error('network'));

    await expect(restoreAccountCartFromDevice()).rejects.toThrow('network');
    expect(hasPendingAccountCartRestore()).toBe(true);
  });

  it('đăng xuất bỏ cờ, để giỏ máy đã xoá không bị đẩy lên tài khoản kế tiếp', () => {
    window.localStorage.setItem(LocalStorageKey.ACCOUNT_CART_RESTORE_PENDING, 'true');
    clearAccountCartRestore();
    expect(hasPendingAccountCartRestore()).toBe(false);
  });
});
