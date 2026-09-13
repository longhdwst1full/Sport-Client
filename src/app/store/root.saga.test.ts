import { afterEach, describe, expect, it, vi } from 'vitest';
import { readPersistedCart } from './root.saga';

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
            price: 450_000,
            quantity: 2,
            customerEmail: 'x@y.z',
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
        price: 450_000,
        quantity: 2,
      },
    ]);
    expect(removeItem).not.toHaveBeenCalled();
  });
});
