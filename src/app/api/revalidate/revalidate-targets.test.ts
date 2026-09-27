import { describe, expect, it } from 'vitest';
import { parseRevalidateRequest, revalidateTargets } from './revalidate-targets';

describe('parseRevalidateRequest', () => {
  it('nhận đúng resource và slug hợp lệ', () => {
    expect(parseRevalidateRequest({ resource: 'post', slug: 'chinh-sach-bao-hanh' })).toEqual({
      resource: 'post',
      slug: 'chinh-sach-bao-hanh',
    });
    expect(parseRevalidateRequest({ resource: 'all' })).toEqual({ resource: 'all', slug: undefined });
  });

  it.each([
    undefined,
    null,
    'post',
    {},
    { resource: 'order' },
    { resource: 'post', slug: '../../etc' },
    { resource: 'post', slug: 'a/b' },
    { resource: 'post', slug: 42 },
    { resource: 'post', slug: '' },
  ])('từ chối payload không hợp lệ: %j', (body) => {
    expect(parseRevalidateRequest(body)).toBeUndefined();
  });
});

describe('revalidateTargets', () => {
  const paths = (input: Parameters<typeof revalidateTargets>[0]) => revalidateTargets(input).map((t) => t.path);

  it('bài viết có slug làm mới đúng trang chi tiết, danh sách, trang chủ và sitemap', () => {
    expect(paths({ resource: 'post', slug: 'bao-hanh' })).toEqual(
      expect.arrayContaining(['/', '/news', '/chinh-sach', '/sitemap.xml', '/news/bao-hanh', '/chinh-sach/bao-hanh']),
    );
  });

  it('bài viết không slug làm mới mọi trang chi tiết theo mẫu route', () => {
    expect(revalidateTargets({ resource: 'post' })).toEqual(
      expect.arrayContaining([
        { path: '/news/[slug]', type: 'page' },
        { path: '/chinh-sach/[slug]', type: 'page' },
      ]),
    );
  });

  it('sản phẩm và danh mục làm mới trang danh mục và sitemap', () => {
    expect(paths({ resource: 'product', slug: 'may-chay-bo' })).toEqual(
      expect.arrayContaining(['/', '/category', '/products/may-chay-bo', '/sitemap.xml']),
    );
    expect(revalidateTargets({ resource: 'category' })).toEqual(
      expect.arrayContaining([
        { path: '/category/[slug]', type: 'page' },
        { path: '/products/[slug]', type: 'page' },
      ]),
    );
  });

  it('all làm mới cả cây từ layout gốc', () => {
    expect(revalidateTargets({ resource: 'all' })).toEqual([{ path: '/', type: 'layout' }]);
  });
});
