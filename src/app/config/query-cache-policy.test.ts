import { describe, expect, it } from 'vitest';
import { CACHE_POLICY } from './query-cache-policy';

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
