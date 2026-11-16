import { describe, expect, it } from 'vitest';
import { PRICE_RANGES, isSameCatalogFilters, parseCatalogUrlState, priceRangeHref, toListCatalogParams } from './catalog-filter.constants';

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

  it('?minPrice/?maxPrice tự do thắng ?price=, đảo khi min > max, bỏ giá trị rác', () => {
    const custom = parse('/products?price=under-500k&minPrice=1000000&maxPrice=3000000');
    expect(custom.activePriceRange).toBe('all');
    expect(custom.filters).toMatchObject({ minPrice: '1000000', maxPrice: '3000000' });
    expect(parse('/products?minPrice=9000000&maxPrice=1000000').filters).toMatchObject({
      minPrice: '1000000',
      maxPrice: '9000000',
    });
    const junk = parse('/products?minPrice=abc&maxPrice=-1').filters;
    expect(junk.minPrice).toBeUndefined();
    expect(junk.maxPrice).toBeUndefined();
  });

  it('khoảng giá khác nhau là bộ lọc khác', () => {
    expect(isSameCatalogFilters(parse('/products?minPrice=1').filters, parse('/products?minPrice=2').filters)).toBe(false);
  });
});

describe('thương hiệu & còn hàng', () => {
  it('đọc ?brand=&instock=1 thành bộ lọc và tham số API dạng brand[]', () => {
    const state = parse('/products?brand=tokado&instock=1');
    expect(state.activeBrand).toBe('tokado');
    expect(state.inStockOnly).toBe(true);
    expect(toListCatalogParams(state.filters)).toMatchObject({ brand: ['tokado'], inStock: true });
  });

  it('không có tham số thì không gửi brand/inStock', () => {
    const params = toListCatalogParams(parse('/products').filters);
    expect(params).not.toHaveProperty('brand');
    expect(params).not.toHaveProperty('inStock');
  });

  it('khác thương hiệu hoặc cờ còn hàng là bộ lọc khác (không dùng nhầm trang SSR)', () => {
    expect(isSameCatalogFilters({ brand: 'a' }, { brand: 'b' })).toBe(false);
    expect(isSameCatalogFilters({ inStock: true }, {})).toBe(false);
    expect(isSameCatalogFilters({ brand: 'a', inStock: true }, { brand: 'a', inStock: true })).toBe(true);
  });
});
