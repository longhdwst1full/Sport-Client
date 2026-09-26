import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CartDto, CartItemDto } from '@/generated/api/cart/cart.schemas';

const api = vi.hoisted(() => ({
  createGuestCart: vi.fn(),
  getAccountCart: vi.fn(),
  getGuestCart: vi.fn(),
  removeAccountCartItem: vi.fn(),
  removeGuestCartItem: vi.fn(),
  setAccountCartItem: vi.fn(),
  setGuestCartItem: vi.fn(),
  mergeGuestCartIntoAccount: vi.fn(),
}));
vi.mock('@/generated/api/cart/cart', () => api);
// Token giỏ khách ở test không cần localStorage thật: giữ trong biến.
const tokenStore = vi.hoisted(() => {
  let token: string | undefined;
  return {
    readGuestCartToken: () => token,
    saveGuestCartToken: (value: string) => { token = value; },
    clearGuestCartToken: () => { token = undefined; },
  };
});
vi.mock('../model/guest-cart-token.store', () => tokenStore);

import { ApiError } from '@/lib/api/fetcher';
import { syncAccountCart, syncCartAfterAuth, toLocalCartItems, UnavailableCartLinesError } from './cart-sync';

const item = (variantId: string, quantity: number, extra: Partial<CartItemDto> = {}): CartItemDto => ({
  id: `item-${variantId}`,
  productVariantId: variantId,
  productId: `product-${variantId}`,
  productType: 'STANDARD',
  sku: `SKU-${variantId}`,
  name: 'Mặc định',
  productName: 'Tạ tay',
  productSlug: 'ta-tay',
  quantity,
  unitPricePreview: '450000.00',
  lineTotalPreview: null,
  imageUrl: null,
  ...extra,
});
const cart = (items: CartItemDto[], version = 1): CartDto => ({
  id: '1', status: 'ACTIVE', currencyCode: 'VND', version, items, subtotalPreview: '0.00', expiresAt: null,
});

describe('cart sync across devices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tokenStore.clearGuestCartToken();
  });

  it('rebuilds local cart lines from the account cart', () => {
    expect(toLocalCartItems(cart([item('7', 2)]))).toEqual([{
      productId: 'product-7',
      variantId: '7',
      sku: 'SKU-7',
      productType: 'STANDARD',
      name: 'Tạ tay — Mặc định',
      imageUrl: undefined,
      price: 450000,
      quantity: 2,
    }]);
  });

  it('writes only changed lines and removes lines no longer in the local cart', async () => {
    api.getAccountCart.mockResolvedValue(cart([item('7', 2), item('8', 1)]));
    api.removeAccountCartItem.mockResolvedValue(cart([item('7', 2)], 2));
    api.setAccountCartItem.mockResolvedValue(cart([item('7', 2), item('9', 3)], 3));

    await syncAccountCart([{ variantId: '7', quantity: 2 }, { variantId: '9', quantity: 3 }]);

    expect(api.removeAccountCartItem).toHaveBeenCalledWith('item-8', { expectedCartVersion: 1 });
    expect(api.setAccountCartItem).toHaveBeenCalledTimes(1);
    expect(api.setAccountCartItem).toHaveBeenCalledWith({ productVariantId: '9', quantity: 3, expectedCartVersion: 2 });
  });

  it('reports SKUs the server no longer sells instead of failing the whole cart', async () => {
    // Sau khi catalog seed lại, localStorage còn ID biến thể cũ: API trả 422 cho dòng đó.
    api.getAccountCart.mockResolvedValue(cart([]));
    api.setAccountCartItem
      .mockRejectedValueOnce(new ApiError(422, { message: 'Biến thể sản phẩm hiện không thể bán.' }))
      .mockResolvedValueOnce(cart([item('9', 1)], 2));

    await expect(
      syncAccountCart([{ variantId: 'old-1751', quantity: 1 }, { variantId: '9', quantity: 1 }]),
    ).rejects.toEqual(expect.objectContaining({ variantIds: ['old-1751'] }));
    // Dòng còn bán vẫn được ghi.
    expect(api.setAccountCartItem).toHaveBeenCalledTimes(2);
    expect(UnavailableCartLinesError).toBeDefined();
  });

  it('on login pushes the device cart, merges on the server, then returns the account cart', async () => {
    api.createGuestCart.mockResolvedValue({ ...cart([]), cartToken: 'guest-token' });
    api.setGuestCartItem.mockResolvedValue(cart([item('7', 1)], 2));
    api.mergeGuestCartIntoAccount.mockResolvedValue(cart([item('7', 3)]));
    // Máy khác đã có 3 cái trong tài khoản; server lấy số lớn hơn nên giỏ trả về là 3.
    api.getAccountCart.mockResolvedValue(cart([item('7', 3)]));

    const result = await syncCartAfterAuth([
      { productId: 'product-7', variantId: '7', sku: 'SKU-7', productType: 'STANDARD', name: 'Tạ tay', price: 1, quantity: 1 },
    ]);

    expect(api.setGuestCartItem).toHaveBeenCalledWith(
      { productVariantId: '7', quantity: 1, expectedCartVersion: 1 },
      { headers: { 'x-cart-token': 'guest-token' } },
    );
    expect(api.mergeGuestCartIntoAccount).toHaveBeenCalledWith({ headers: { 'x-cart-token': 'guest-token' } });
    expect(result?.map(({ variantId, quantity }) => ({ variantId, quantity }))).toEqual([{ variantId: '7', quantity: 3 }]);
  });

  it('never blocks login when the sync fails', async () => {
    api.createGuestCart.mockRejectedValue(new Error('offline'));

    await expect(syncCartAfterAuth([
      { productId: 'p', variantId: '7', sku: 'S', productType: 'STANDARD', name: 'n', price: 1, quantity: 1 },
    ])).resolves.toBeUndefined();
  });
});
