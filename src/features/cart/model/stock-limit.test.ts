import { describe, expect, it } from 'vitest';
import { clampToStock, isOverStock, MAX_LINE_QUANTITY, maxOrderableQuantity } from './stock-limit';

describe('stock limit', () => {
  it('limits by availableQuantity, capped by the cart line limit; unknown means only the cart cap', () => {
    expect(maxOrderableQuantity(3)).toBe(3);
    expect(maxOrderableQuantity(5000)).toBe(MAX_LINE_QUANTITY);
    expect(maxOrderableQuantity(null)).toBe(MAX_LINE_QUANTITY);
    expect(maxOrderableQuantity(undefined)).toBe(MAX_LINE_QUANTITY);
    expect(maxOrderableQuantity(-2)).toBe(0);
  });

  it('clamps a typed quantity down to the max and reports it', () => {
    expect(clampToStock(10, 4)).toEqual({ quantity: 4, clamped: true, max: 4 });
    expect(clampToStock(2, 4)).toEqual({ quantity: 2, clamped: false, max: 4 });
    expect(clampToStock(0, 4)).toEqual({ quantity: 1, clamped: false, max: 4 });
    expect(clampToStock(1200, undefined)).toEqual({ quantity: MAX_LINE_QUANTITY, clamped: true, max: MAX_LINE_QUANTITY });
    expect(clampToStock(Number.NaN, 4, 3)).toEqual({ quantity: 3, clamped: false, max: 4 });
  });

  it('flags a line over stock only when stock is known', () => {
    expect(isOverStock(5, 3)).toBe(true);
    expect(isOverStock(1, 0)).toBe(true);
    expect(isOverStock(3, 3)).toBe(false);
    expect(isOverStock(50, undefined)).toBe(false);
    expect(isOverStock(50, null)).toBe(false);
  });
});
