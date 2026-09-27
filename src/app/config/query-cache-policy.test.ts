import { describe, expect, it } from 'vitest';
import { CACHE_POLICY, cachePolicyForQueryKey, DEFAULT_STALE_TIME } from './query-cache-policy';

/**
 * Chính sách cache là quyết định nghiệp vụ, không phải con số tuỳ ý: cache quá tay ở nhóm dữ liệu
 * dùng để RA QUYẾT ĐỊNH (giỏ hàng, báo giá, suất flash sale) nghĩa là khách bấm đặt hàng dựa trên
 * một con số không còn đúng.
 */
describe('CACHE_POLICY', () => {
  it('dữ liệu càng ít đổi thì giữ càng lâu', () => {
    expect(CACHE_POLICY.REFERENCE.staleTime).toBeGreaterThan(CACHE_POLICY.LOOKUP.staleTime);
    expect(CACHE_POLICY.LOOKUP.staleTime).toBeGreaterThan(CACHE_POLICY.CATALOG.staleTime);
  });

  /** Giữ trong bộ nhớ phải lâu hơn thời gian coi là còn tươi, nếu không cache bị dọn trước khi dùng lại. */
  it('gcTime luôn dài hơn staleTime', () => {
    for (const [name, policy] of Object.entries(CACHE_POLICY)) {
      expect(policy.gcTime, name).toBeGreaterThan(policy.staleTime);
    }
  });

  /**
   * Chốt trần: không nhóm nào được giữ quá một giờ. Dữ liệu cũ hơn thế thì khách phải tải lại
   * trang mới thấy thay đổi, và đó là thứ không ai đoán được khi đang dùng.
   */
  it('không nhóm nào giữ quá một giờ', () => {
    for (const [name, policy] of Object.entries(CACHE_POLICY)) {
      expect(policy.gcTime, name).toBeLessThanOrEqual(60 * 60_000);
    }
  });
});

describe('cachePolicyForQueryKey', () => {
  it('xếp địa giới và tham số công khai vào REFERENCE', () => {
    expect(cachePolicyForQueryKey(['/api/v1/shipping/areas/provinces'])).toBe(CACHE_POLICY.REFERENCE);
    expect(cachePolicyForQueryKey(['/api/v1/shipping/areas/wards', { districtCode: '1' }])).toBe(
      CACHE_POLICY.REFERENCE,
    );
    expect(cachePolicyForQueryKey(['/api/v1/system/parameters/public'])).toBe(CACHE_POLICY.REFERENCE);
  });

  it('xếp danh mục và bài viết vào LOOKUP', () => {
    expect(cachePolicyForQueryKey(['/api/v1/catalog/categories'])).toBe(CACHE_POLICY.LOOKUP);
    expect(cachePolicyForQueryKey(['/api/v1/content/posts', { postType: 'POLICY' }])).toBe(CACHE_POLICY.LOOKUP);
    expect(cachePolicyForQueryKey(['/api/v1/content/posts/bao-hanh'])).toBe(CACHE_POLICY.LOOKUP);
  });

  it('xếp sản phẩm và đánh giá vào CATALOG, kể cả key infinite', () => {
    expect(cachePolicyForQueryKey(['/api/v1/catalog/products', { page: 1 }, 'infinite'])).toBe(
      CACHE_POLICY.CATALOG,
    );
    expect(cachePolicyForQueryKey(['/api/v1/catalog/products/may-chay-bo'])).toBe(CACHE_POLICY.CATALOG);
    expect(cachePolicyForQueryKey(['/api/v1/catalog/products/may-chay-bo/reviews'])).toBe(CACHE_POLICY.CATALOG);
  });

  it.each([
    '/api/v1/account/profile',
    '/api/v1/account/orders',
    '/api/v1/account/cart',
    '/api/v1/carts/guest',
    '/api/v1/checkouts/guest/token',
    '/api/v1/orders/guest/DH001',
    '/api/v1/payments/guest/orders/DH001',
    '/api/v1/account/payments/orders/DH001',
    '/api/v1/auth/me',
    '/api/v1/promotions/flash-sales',
  ])('không bao giờ cache dài dữ liệu cá nhân/giao dịch: %s', (path) => {
    expect(cachePolicyForQueryKey([path])).toBeUndefined();
  });

  it('key không phải đường dẫn API thì không có policy', () => {
    expect(cachePolicyForQueryKey(['payment', 'DH001'])).toBeUndefined();
    expect(cachePolicyForQueryKey([])).toBeUndefined();
  });

  it('dữ liệu tham chiếu không refetch khi quay lại tab, catalog thì có', () => {
    expect(CACHE_POLICY.REFERENCE.refetchOnWindowFocus).toBe(false);
    expect(CACHE_POLICY.LOOKUP.refetchOnWindowFocus).toBe(false);
    expect(CACHE_POLICY.CATALOG.refetchOnWindowFocus).toBe(true);
    expect(DEFAULT_STALE_TIME).toBeLessThan(CACHE_POLICY.CATALOG.staleTime);
  });
});
