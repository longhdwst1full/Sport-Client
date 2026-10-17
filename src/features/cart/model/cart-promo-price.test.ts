import { describe, expect, it } from 'vitest';
import { resolveCartLinePrice } from './cart-promo-price';

const NOW = 1_000;
const promos = { v1: { price: 80, regularPrice: 100, maxQuantity: 2, endsAtMs: NOW + 1 } };

describe('resolveCartLinePrice', () => {
  it('trong số suất → giá flash', () => {
    expect(resolveCartLinePrice({ variantId: 'v1', price: 80, quantity: 2 }, promos, NOW)).toMatchObject({
      unitPrice: 80,
      lineTotal: 160,
      promo: 'applied',
    });
  });

  it('vượt số suất (suất 2, mua 4) → cả dòng giá thường', () => {
    expect(resolveCartLinePrice({ variantId: 'v1', price: 80, quantity: 4 }, promos, NOW)).toMatchObject({
      unitPrice: 100,
      lineTotal: 400,
      promo: 'exceeded',
      promoMaxQuantity: 2,
    });
  });

  it('hết suất (0) → giá thường; hết giờ hoặc chưa có dữ liệu → giữ ảnh chụp', () => {
    const soldOut = { v1: { ...promos.v1, maxQuantity: 0 } };
    expect(resolveCartLinePrice({ variantId: 'v1', price: 80, quantity: 1 }, soldOut, NOW).unitPrice).toBe(100);
    expect(resolveCartLinePrice({ variantId: 'v1', price: 80, quantity: 4 }, promos, NOW + 5).unitPrice).toBe(80);
    expect(resolveCartLinePrice({ variantId: 'v1', price: 80, quantity: 4 }, null, NOW).unitPrice).toBe(80);
  });
});
