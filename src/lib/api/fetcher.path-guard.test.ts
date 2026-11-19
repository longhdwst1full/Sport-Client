import { describe, expect, it } from 'vitest';
import { ApiError, apiFetcher, hasDotSegment } from './fetcher';

describe('hasDotSegment', () => {
  it.each([
    '/api/v1/catalog/products/../../health',
    '/api/v1/catalog/products/%2e%2e/health',
    '/api/v1/catalog/products/%2E./health',
    '/api/v1/catalog/products/./x',
    '/api/v1/catalog/products/..\\admin',
  ])('phát hiện %s', (url) => expect(hasDotSegment(url)).toBe(true));

  it.each([
    '/api/v1/catalog/products/ao-the-thao',
    '/api/v1/catalog/products/ao..the',
    '/api/v1/catalog/products?q=..%2F',
    undefined,
  ])('cho qua %s', (url) => expect(hasDotSegment(url)).toBe(false));
});

describe('apiFetcher path guard', () => {
  it('từ chối 404 trước khi gọi mạng khi path có segment ..', async () => {
    await expect(apiFetcher({ url: '/api/v1/catalog/products/../../health', method: 'GET' })).rejects.toMatchObject({
      status: 404,
    });
    await expect(apiFetcher({ url: '/api/v1/catalog/products/../../health', method: 'GET' })).rejects.toBeInstanceOf(ApiError);
  });
});
