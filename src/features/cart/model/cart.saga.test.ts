import { afterEach, describe, expect, it, vi } from 'vitest';
import { readPersistedCart } from './cart.saga';

describe('readPersistedCart', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('keeps only the minimal valid cart shape', () => {
    const removeItem = vi.fn();
    // `safeStorage()` đọc qua `window.localStorage`, nên stub phải đặt ở `window`.
    const localStorage = {
      getItem: () =>
        JSON.stringify([
          {
            productId: 'product-1',
            variantId: 'variant-1',
            sku: 'TA-5KG',
            productType: 'STANDARD',
            name: 'Tạ tay',
            slug: 'ta-tay',
            price: 400_000,
            regularPrice: 450_000,
            quantity: 2,
            customerEmail: 'x@y.z',
          },
          {
            productId: 'product-3',
            variantId: 'variant-3',
            sku: 'BONG',
            productType: 'STANDARD',
            name: 'Bóng',
            price: 100_000,
            regularPrice: 'abc',
            quantity: 1,
          },
          { productId: 'product-2', name: 'Thảm', price: 200_000 },
        ]),
      removeItem,
    };
    vi.stubGlobal('window', { localStorage });

    expect(readPersistedCart()).toEqual([
      {
        productId: 'product-1',
        variantId: 'variant-1',
        sku: 'TA-5KG',
        productType: 'STANDARD',
        name: 'Tạ tay',
        slug: 'ta-tay',
        price: 400_000,
        regularPrice: 450_000,
        quantity: 2,
      },
      // regularPrice sai kiểu bị bỏ, dòng vẫn giữ.
      { productId: 'product-3', variantId: 'variant-3', sku: 'BONG', productType: 'STANDARD', name: 'Bóng', price: 100_000, quantity: 1 },
    ]);
    expect(removeItem).not.toHaveBeenCalled();
  });
});
