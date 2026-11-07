import { describe, expect, it } from 'vitest';
import { stockLabel } from './stock-label';

describe('stockLabel', () => {
  it('says "Chỉ còn N" at or below the low-stock threshold', () => {
    expect(stockLabel(1, true)).toEqual({ tone: 'low', text: 'Chỉ còn 1 sản phẩm' });
    expect(stockLabel(10, true)).toEqual({ tone: 'low', text: 'Chỉ còn 10 sản phẩm' });
  });

  it('says "Còn N" above the threshold and "Còn hàng" at the API cap', () => {
    expect(stockLabel(11, true)).toEqual({ tone: 'ok', text: 'Còn 11 sản phẩm' });
    expect(stockLabel(999, true)).toEqual({ tone: 'ok', text: 'Còn hàng' });
  });

  it('shows nothing when out of stock and falls back to inStock when the number is missing', () => {
    expect(stockLabel(0, false)).toBeNull();
    expect(stockLabel(null, true)).toEqual({ tone: 'ok', text: 'Còn hàng' });
    expect(stockLabel(null, null)).toBeNull();
  });
});
