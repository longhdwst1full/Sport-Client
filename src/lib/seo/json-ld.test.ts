import { describe, expect, it } from 'vitest';
import {
  buildArticleJsonLd,
  buildBreadcrumbListJsonLd,
  buildProductJsonLd,
  ORGANIZATION_ID,
  serializeJsonLd,
} from './json-ld';
import { absoluteUrl, buildCanonicalPath, SITE_URL } from './page-metadata';

describe('serializeJsonLd', () => {
  it('escape `<` để không đóng thẻ script sớm', () => {
    expect(serializeJsonLd({ name: '</script>' })).toBe('{"name":"\\u003c/script>"}');
  });
});

describe('buildCanonicalPath', () => {
  it('bỏ mọi query khi không có allowlist', () => {
    expect(buildCanonicalPath('/products/', { sort: 'PRICE_ASC', utm_source: 'fb' })).toBe('/products');
  });

  it('giữ tham số được phép theo thứ tự cố định và bỏ page=1', () => {
    const params = new URLSearchParams('sort=NEWEST&page=2&q=ta');
    expect(buildCanonicalPath('news', params, ['page'])).toBe('/news?page=2');
    expect(buildCanonicalPath('/news', { page: '1' }, ['page'])).toBe('/news');
  });
});

describe('absoluteUrl', () => {
  it('ghép domain cho path tương đối và giữ nguyên URL tuyệt đối', () => {
    expect(absoluteUrl('/a')).toBe(`${SITE_URL}/a`);
    expect(absoluteUrl('https://res.cloudinary.com/x.jpg')).toBe('https://res.cloudinary.com/x.jpg');
  });
});

describe('buildProductJsonLd', () => {
  it('khai offer VND, tồn kho và rating khi có dữ liệu thật', () => {
    const ld = buildProductJsonLd({
      name: 'Máy chạy bộ',
      path: '/products/may-chay-bo',
      images: ['https://cdn/x.jpg', null],
      price: '1890000.00',
      inStock: false,
      brand: 'Elip',
      rating: { value: 4.56, count: 3 },
    });
    expect(ld.offers).toMatchObject({
      price: '1890000',
      priceCurrency: 'VND',
      availability: 'https://schema.org/OutOfStock',
      seller: { '@id': ORGANIZATION_ID },
    });
    expect(ld.image).toEqual(['https://cdn/x.jpg']);
    expect(ld.aggregateRating).toMatchObject({ ratingValue: 4.6, reviewCount: 3 });
  });

  it('không khai offers/rating/availability khi thiếu dữ liệu', () => {
    const ld = buildProductJsonLd({ name: 'A', path: '/products/a', price: '0', rating: { value: 0, count: 0 } });
    expect(ld).not.toHaveProperty('offers');
    expect(ld).not.toHaveProperty('aggregateRating');
    expect(ld).not.toHaveProperty('brand');
    const noStock = buildProductJsonLd({ name: 'A', path: '/products/a', price: 100 });
    expect(noStock.offers).not.toHaveProperty('availability');
  });
});

describe('buildBreadcrumbListJsonLd', () => {
  it('đánh số từ 1 và để trống item cho trang hiện tại', () => {
    const ld = buildBreadcrumbListJsonLd([{ name: 'Trang chủ', path: '/' }, { name: 'Gym' }]);
    expect(ld.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Gym' },
    ]);
  });
});

describe('buildArticleJsonLd', () => {
  it('dùng publisher của site và dateModified mặc định bằng datePublished', () => {
    const ld = buildArticleJsonLd({
      headline: 'x'.repeat(200),
      path: '/news/a',
      datePublished: '2026-01-01T00:00:00Z',
    });
    expect(ld.headline).toHaveLength(110);
    expect(ld.dateModified).toBe('2026-01-01T00:00:00Z');
    expect(ld.publisher).toEqual({ '@id': ORGANIZATION_ID });
    expect(ld.mainEntityOfPage).toEqual({ '@type': 'WebPage', '@id': `${SITE_URL}/news/a` });
  });
});
