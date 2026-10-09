import { describe, expect, it } from 'vitest';
import { PRICE_RANGES, parseCatalogUrlState, priceRangeHref } from './catalog-filter.constants';

const parse = (href: string) => {
  const params = new URL(href, 'https://x').searchParams;
  return parseCatalogUrlState((key) => params.get(key));
};

describe('khoảng giá /products', () => {
  it('mọi link ngân sách đều được parser đọc thành bộ lọc API', () => {
    for (const range of PRICE_RANGES.filter((item) => item.id !== 'all')) {
      const state = parse(priceRangeHref(range.id));
      expect(state.activePriceRange).toBe(range.id);
      expect(state.filters.minPrice).toBe(range.min);
      expect(state.filters.maxPrice).toBe(range.max);
    }
  });

  it('các khoảng nối tiếp nhau, không chồng và không hở', () => {
    const bounded = PRICE_RANGES.filter((item) => item.id !== 'all');
    for (let index = 1; index < bounded.length; index += 1) {
      expect(Number(bounded[index].min)).toBe(Number(bounded[index - 1].max) + 1);
    }
  });

  it('id lạ không lọc gì', () => {
    expect(parse('/products?price=2m-10m').filters.minPrice).toBeUndefined();
  });
});
