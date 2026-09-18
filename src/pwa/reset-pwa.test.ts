import { describe, expect, it } from 'vitest';
import { isStorefrontRegistration } from './reset-pwa';

const origin = 'https://shop.example.com';

function registration(scope: string, scriptURL: string): ServiceWorkerRegistration {
  return {
    scope,
    active: { scriptURL },
    waiting: null,
    installing: null,
  } as unknown as ServiceWorkerRegistration;
}

describe('PWA reset registration boundary', () => {
  it('chỉ nhận worker Storefront tại root scope', () => {
    expect(isStorefrontRegistration(registration(`${origin}/`, `${origin}/sw.js`), origin)).toBe(true);
  });

  it('không gỡ worker của ứng dụng khác cùng origin', () => {
    expect(
      isStorefrontRegistration(registration(`${origin}/admin/`, `${origin}/admin/sw.js`), origin),
    ).toBe(false);
    expect(isStorefrontRegistration(registration(`${origin}/`, `${origin}/other-sw.js`), origin)).toBe(false);
  });

  it('không gỡ worker cùng đường dẫn nhưng thuộc origin khác', () => {
    expect(
      isStorefrontRegistration(registration('https://other.example.com/', 'https://other.example.com/sw.js'), origin),
    ).toBe(false);
  });
});
