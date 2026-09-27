import { describe, expect, it } from 'vitest';
import { isSessionScopedCacheName } from './session-caches';

describe('isSessionScopedCacheName', () => {
  it('dọn cache API và trang của mọi phiên bản', () => {
    expect(isSessionScopedCacheName('dctd-storefront-api-v4')).toBe(true);
    expect(isSessionScopedCacheName('dctd-storefront-pages-v9')).toBe(true);
  });

  it('giữ shell/static/ảnh và không chạm cache của ứng dụng khác', () => {
    expect(isSessionScopedCacheName('dctd-storefront-shell-v4')).toBe(false);
    expect(isSessionScopedCacheName('dctd-storefront-static-v4')).toBe(false);
    expect(isSessionScopedCacheName('dctd-admin-api-v1')).toBe(false);
  });
});
