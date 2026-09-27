import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

interface SwRouting {
  CACHE_PREFIX: string;
  CACHE_NAMES: Record<string, string>;
  API_SWR_FRESH_MS: number;
  APP_SHELL: string[];
  SESSION_SCOPED_CACHES: string[];
  STRATEGY: Record<string, string>;
  classifyRequest(input: {
    method: string;
    url: string;
    mode?: string;
    hasAuthorization?: boolean;
    selfOrigin: string;
  }): string;
  isCacheableResponse(response: { status: number; type?: string; headers?: Record<string, string> }): boolean;
  isFreshApiEntry(cachedAt: unknown, now: number): boolean;
  isStorefrontCache(name: string): boolean;
  isObsoleteCache(name: string): boolean;
}

/** `public/sw-routing.js` là script worker thuần, nạp bằng `importScripts`; test chạy nó với `self` giả. */
function loadRouting(): SwRouting {
  const source = readFileSync(fileURLToPath(new URL('../../public/sw-routing.js', import.meta.url)), 'utf8');
  const fakeSelf: { StorefrontSwRouting?: SwRouting } = {};
  new Function('self', source)(fakeSelf);
  if (!fakeSelf.StorefrontSwRouting) throw new Error('sw-routing.js did not register');
  return fakeSelf.StorefrontSwRouting;
}

const R = loadRouting();
const S = R.STRATEGY;
const SITE = 'https://baoansport.vn';
const API = 'https://sport-api-doc.vercel.app';

function classify(url: string, extra: Partial<Parameters<SwRouting['classifyRequest']>[0]> = {}) {
  return R.classifyRequest({ method: 'GET', url, mode: 'cors', selfOrigin: SITE, ...extra });
}

describe('SW routing — API', () => {
  it.each([
    `${API}/api/v1/catalog/categories`,
    `${API}/api/v1/content/posts?postType=POLICY`,
    `${API}/api/v1/content/posts/chinh-sach-bao-hanh`,
    `${API}/api/v1/shipping/areas/provinces`,
    `${API}/api/v1/shipping/areas/wards?districtCode=1B2729`,
    `${API}/api/v1/system/parameters/public`,
    `${SITE}/api/v1/catalog/categories`,
  ])('dữ liệu tham chiếu công khai dùng stale-while-revalidate: %s', (url) => {
    expect(classify(url)).toBe(S.API_SWR);
  });

  it.each([
    '/api/v1/auth/me',
    '/api/v1/auth/refresh',
    '/api/v1/account/profile',
    '/api/v1/account/cart',
    '/api/v1/account/orders',
    '/api/v1/account/payments/orders/DH1',
    '/api/v1/carts/guest',
    '/api/v1/checkouts/guest/abc',
    '/api/v1/orders/guest/DH1',
    '/api/v1/payments/guest/orders/DH1',
    '/api/v1/payments/vnpay/return',
    '/api/v1/returns/x',
    '/api/v1/customers/me',
    '/api/v1/admin/reviews',
  ])('không bao giờ chặn/cache API nhạy cảm: %s', (path) => {
    expect(classify(`${API}${path}`)).toBe(S.BYPASS);
    expect(classify(`${SITE}${path}`)).toBe(S.BYPASS);
  });

  it('sản phẩm, đánh giá, flash sale đi thẳng mạng (giá/tồn kho/suất)', () => {
    expect(classify(`${API}/api/v1/catalog/products?page=1`)).toBe(S.BYPASS);
    expect(classify(`${API}/api/v1/catalog/products/may-chay-bo`)).toBe(S.BYPASS);
    expect(classify(`${API}/api/v1/catalog/products/may-chay-bo/reviews`)).toBe(S.BYPASS);
    expect(classify(`${API}/api/v1/promotions/flash-sales`)).toBe(S.BYPASS);
  });

  it('request có Authorization không bao giờ được cache, kể cả đường dẫn công khai', () => {
    expect(classify(`${API}/api/v1/catalog/categories`, { hasAuthorization: true })).toBe(S.BYPASS);
    expect(classify(`${SITE}/`, { mode: 'navigate', hasAuthorization: true })).toBe(S.BYPASS);
  });

  it('mọi method khác GET đều bỏ qua', () => {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      expect(classify(`${API}/api/v1/catalog/categories`, { method })).toBe(S.BYPASS);
      expect(classify(`${SITE}/api/revalidate`, { method })).toBe(S.BYPASS);
    }
  });
});

describe('SW routing — navigation', () => {
  it.each(['/cart', '/checkout', '/checkout/vnpay-return', '/profile', '/orders', '/orders/DH1', '/returns/R1', '/login', '/register', '/reset-password', '/pwa'])(
    'màn hình cá nhân/giao dịch là network-only: %s',
    (path) => {
      expect(classify(`${SITE}${path}`, { mode: 'navigate' })).toBe(S.NAV_ONLINE_ONLY);
    },
  );

  it('không nhầm tiền tố: /cartoon không phải /cart', () => {
    expect(classify(`${SITE}/cartoon`, { mode: 'navigate' })).toBe(S.NAV_NETWORK);
  });

  it.each(['/', '/news', '/news/huong-dan-chon-ta', '/chinh-sach', '/chinh-sach/bao-hanh', '/category', '/contact'])(
    'trang biên tập công khai được cache network-first: %s',
    (path) => {
      expect(classify(`${SITE}${path}`, { mode: 'navigate' })).toBe(S.NAV_PUBLIC);
    },
  );

  it('trang có giá (sản phẩm, danh mục con, flash sale) và URL có query không vào cache trang', () => {
    expect(classify(`${SITE}/products/may-chay-bo`, { mode: 'navigate' })).toBe(S.NAV_NETWORK);
    expect(classify(`${SITE}/category/gym`, { mode: 'navigate' })).toBe(S.NAV_NETWORK);
    expect(classify(`${SITE}/flash-sale`, { mode: 'navigate' })).toBe(S.NAV_NETWORK);
    expect(classify(`${SITE}/news?utm_source=zalo`, { mode: 'navigate' })).toBe(S.NAV_NETWORK);
  });

  it('không chặn Admin chung origin', () => {
    expect(classify(`${SITE}/admin`, { mode: 'navigate' })).toBe(S.BYPASS);
    expect(classify(`${SITE}/admin/orders`, { mode: 'navigate' })).toBe(S.BYPASS);
  });
});

describe('SW routing — static & images', () => {
  it('asset build và icon dùng cache-first', () => {
    expect(classify(`${SITE}/_next/static/chunks/main-abc.js`)).toBe(S.STATIC);
    expect(classify(`${SITE}/icon-192.png`)).toBe(S.STATIC);
    expect(classify(`${SITE}/manifest.webmanifest`)).toBe(S.STATIC);
  });

  it('ảnh cùng origin cache-first; ảnh origin khác (opaque) để HTTP cache lo', () => {
    expect(classify(`${SITE}/_next/image?url=%2Fimages%2Flogo.png&w=256&q=75`)).toBe(S.IMAGE);
    expect(classify(`${SITE}/images/logo.png`)).toBe(S.IMAGE);
    expect(classify('https://res.cloudinary.com/demo/image/upload/a.jpg')).toBe(S.BYPASS);
  });

  it('RSC payload khi điều hướng client-side không bị cache', () => {
    expect(classify(`${SITE}/news?_rsc=1a2b`)).toBe(S.BYPASS);
  });

  it('app shell có trang offline và đủ icon cài đặt', () => {
    expect(R.APP_SHELL).toEqual(expect.arrayContaining(['/', '/offline', '/icon-192.png', '/icon-512.png']));
  });
});

describe('SW routing — response & cache hygiene', () => {
  it('chỉ cache 200 không opaque, không no-store/private, không Vary theo Cookie/Authorization', () => {
    expect(R.isCacheableResponse({ status: 200, type: 'cors', headers: {} })).toBe(true);
    expect(R.isCacheableResponse({ status: 200, type: 'basic', headers: { 'cache-control': 'public, max-age=60' } })).toBe(true);
    expect(R.isCacheableResponse({ status: 304, type: 'basic', headers: {} })).toBe(false);
    expect(R.isCacheableResponse({ status: 404, type: 'cors', headers: {} })).toBe(false);
    expect(R.isCacheableResponse({ status: 500, type: 'cors', headers: {} })).toBe(false);
    expect(R.isCacheableResponse({ status: 0, type: 'opaque', headers: {} })).toBe(false);
    expect(R.isCacheableResponse({ status: 200, type: 'opaque', headers: {} })).toBe(false);
    expect(R.isCacheableResponse({ status: 200, type: 'basic', headers: { 'cache-control': 'private, no-cache, no-store' } })).toBe(false);
    expect(R.isCacheableResponse({ status: 200, type: 'cors', headers: { vary: 'Origin, Cookie' } })).toBe(false);
    expect(R.isCacheableResponse({ status: 200, type: 'cors', headers: { vary: 'Authorization' } })).toBe(false);
  });

  it('bản API đã cache chỉ được trả ngay trong cửa sổ tươi', () => {
    const now = 1_000_000_000;
    expect(R.isFreshApiEntry(String(now - 1_000), now)).toBe(true);
    expect(R.isFreshApiEntry(String(now - R.API_SWR_FRESH_MS), now)).toBe(false);
    expect(R.isFreshApiEntry(null, now)).toBe(false);
    expect(R.isFreshApiEntry('abc', now)).toBe(false);
    expect(R.isFreshApiEntry(String(now + 60_000), now)).toBe(false);
  });

  it('activate chỉ xoá cache Storefront phiên bản cũ', () => {
    expect(R.isObsoleteCache('dctd-storefront-v3')).toBe(true);
    expect(R.isObsoleteCache(R.CACHE_NAMES.api)).toBe(false);
    expect(R.isObsoleteCache(R.CACHE_NAMES.shell)).toBe(false);
    expect(R.isObsoleteCache('dctd-admin-v1')).toBe(false);
    expect(R.isObsoleteCache('workbox-precache')).toBe(false);
  });

  it('mọi cache đều mang prefix Storefront và có phiên bản', () => {
    for (const name of Object.values(R.CACHE_NAMES)) {
      expect(name.startsWith(R.CACHE_PREFIX)).toBe(true);
      expect(name).toMatch(/-v\d+$/);
    }
  });

  it('đăng xuất dọn cache API và trang, giữ shell/static để app vẫn mở offline', () => {
    expect(R.SESSION_SCOPED_CACHES).toEqual(expect.arrayContaining([R.CACHE_NAMES.api, R.CACHE_NAMES.pages]));
    expect(R.SESSION_SCOPED_CACHES).not.toContain(R.CACHE_NAMES.shell);
  });
});
