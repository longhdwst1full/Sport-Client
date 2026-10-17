import { describe, expect, it } from 'vitest';
import { activeFlashPrice } from './use-variant-flash-prices';
import type { VariantFlashPrice } from '../model/variant-flash-price';

const deal = (endsAtMs: number): VariantFlashPrice => ({
  price: 1,
  priceLabel: '1 ₫',
  originalPriceLabel: null,
  discountPercent: null,
  availableQuantity: 1,
  soldPercent: 0,
  endsAtMs,
});

describe('activeFlashPrice', () => {
  it('trả giá còn hạn, bỏ giá đã qua giờ kết thúc', () => {
    const prices = { a: deal(Date.now() + 60_000), b: deal(Date.now() - 1) };
    expect(activeFlashPrice(prices, 'a')).toBeDefined();
    expect(activeFlashPrice(prices, 'b')).toBeUndefined();
  });
  it('chưa có dữ liệu / không có biến thể → undefined', () => {
    expect(activeFlashPrice(null, 'a')).toBeUndefined();
    expect(activeFlashPrice({ a: deal(Date.now() + 1000) }, null)).toBeUndefined();
  });
});
