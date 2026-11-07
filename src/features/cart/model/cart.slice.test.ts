import { describe, expect, it } from 'vitest';
import { addCartItem, cartSlice, clearCart } from './cart.slice';

describe('cartSlice', () => {
  it('increments the same product and clears the cart', () => {
    const product = {
      productId: 'product-1',
      variantId: 'variant-1',
      sku: 'TA-5KG',
      productType: 'STANDARD' as const,
      name: 'Tạ tay',
      price: 450_000,
    };
    const once = cartSlice.reducer(undefined, addCartItem(product));
    const twice = cartSlice.reducer(once, addCartItem(product));

    expect(twice.items).toEqual([{ ...product, quantity: 2 }]);
    expect(cartSlice.reducer(twice, clearCart()).items).toEqual([]);
  });

  it('keeps two SKUs of the same product as separate cart lines', () => {
    const base = {
      productId: 'product-1',
      productType: 'STANDARD' as const,
      name: 'Tạ tay',
      price: 450_000,
    };
    const first = cartSlice.reducer(undefined, addCartItem({
      ...base,
      variantId: 'variant-5kg',
      sku: 'TA-5KG',
    }));
    const second = cartSlice.reducer(first, addCartItem({
      ...base,
      variantId: 'variant-10kg',
      sku: 'TA-10KG',
      price: 750_000,
    }));

    expect(second.items).toHaveLength(2);
    expect(second.items.map((item) => item.variantId)).toEqual(['variant-5kg', 'variant-10kg']);
  });

  it('never lets a line exceed the known availableQuantity, even when merging with an existing line', () => {
    const product = {
      productId: 'product-1',
      variantId: 'variant-1',
      sku: 'TA-5KG',
      productType: 'STANDARD' as const,
      name: 'Tạ tay',
      price: 450_000,
    };
    const first = cartSlice.reducer(undefined, addCartItem({ ...product, quantity: 2, availableQuantity: 3 }));
    const merged = cartSlice.reducer(first, addCartItem({ ...product, quantity: 3, availableQuantity: 3 }));

    expect(merged.items).toEqual([{ ...product, quantity: 3, availableQuantity: 3 }]);
  });

  it('does not add a variant known to be out of stock', () => {
    const state = cartSlice.reducer(undefined, addCartItem({
      productId: 'product-1',
      variantId: 'variant-1',
      sku: 'TA-5KG',
      productType: 'STANDARD' as const,
      name: 'Tạ tay',
      price: 450_000,
      availableQuantity: 0,
    }));

    expect(state.items).toEqual([]);
  });
});
