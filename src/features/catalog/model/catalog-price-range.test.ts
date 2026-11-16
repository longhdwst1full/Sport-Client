import { describe, expect, it } from 'vitest';
import {
  PRICE_SLIDER,
  formatPriceRangeLabel,
  normalizePriceRange,
  parsePriceInput,
  parsePriceParam,
  snapToStep,
} from './catalog-price-range';

describe('parse', () => {
  it('parsePriceParam chỉ nhận số nguyên không âm', () => {
    expect(parsePriceParam('500000')).toBe(500000);
    expect(parsePriceParam('-5')).toBeNull();
    expect(parsePriceParam('1.5')).toBeNull();
    expect(parsePriceParam('abc')).toBeNull();
    expect(parsePriceParam('')).toBeNull();
    expect(parsePriceParam(null)).toBeNull();
  });

  it('parsePriceInput bỏ dấu phân cách/ký hiệu, rỗng thì null', () => {
    expect(parsePriceInput('1.500.000 ₫')).toBe(1500000);
    expect(parsePriceInput('')).toBeNull();
    expect(parsePriceInput('abc')).toBeNull();
  });
});

describe('normalizePriceRange', () => {
  it('đảo khi min > max', () => {
    expect(normalizePriceRange(5_000_000, 1_000_000)).toEqual({ min: 1_000_000, max: 5_000_000 });
  });
  it('min 0 và max chạm cuối thanh = không giới hạn', () => {
    expect(normalizePriceRange(0, PRICE_SLIDER.max)).toEqual({ min: null, max: null });
  });
  it('kẹp min vào miền, bỏ NaN', () => {
    expect(normalizePriceRange(PRICE_SLIDER.max * 2, null).min).toBe(PRICE_SLIDER.max);
    expect(normalizePriceRange(Number.NaN, null)).toEqual({ min: null, max: null });
  });
});

describe('snap & label', () => {
  it('snapToStep làm tròn về bước và kẹp miền', () => {
    expect(snapToStep(149_999)).toBe(100_000);
    expect(snapToStep(-10)).toBe(0);
    expect(snapToStep(PRICE_SLIDER.max + 1)).toBe(PRICE_SLIDER.max);
  });
  it('formatPriceRangeLabel', () => {
    const f = (v: number) => `${v}đ`;
    expect(formatPriceRangeLabel(null, null, f)).toBeNull();
    expect(formatPriceRangeLabel(100, null, f)).toBe('Từ 100đ');
    expect(formatPriceRangeLabel(null, 200, f)).toBe('Đến 200đ');
    expect(formatPriceRangeLabel(100, 200, f)).toBe('100đ – 200đ');
  });
});
