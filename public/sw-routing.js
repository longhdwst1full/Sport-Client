/*
 * Storefront service-worker routing rules.
 *
 * Pure functions only: no `caches`, no `fetch`, no event listeners. `sw.js` loads this file with
 * `importScripts`, and `src/pwa/sw-routing.test.ts` evaluates it with a fake `self` so every rule
 * below is covered by unit tests. Changing a rule here changes what the worker caches — bump
 * `CACHE_VERSION` whenever cached semantics change (`.agent/rules/03-pwa-security-caching.md`).
 */
(function (root) {
  'use strict';

  var CACHE_PREFIX = 'dctd-storefront-';
  var CACHE_VERSION = 'v4';

  var CACHE_NAMES = {
    shell: CACHE_PREFIX + 'shell-' + CACHE_VERSION,
    static: CACHE_PREFIX + 'static-' + CACHE_VERSION,
    images: CACHE_PREFIX + 'images-' + CACHE_VERSION,
    pages: CACHE_PREFIX + 'pages-' + CACHE_VERSION,
    api: CACHE_PREFIX + 'api-' + CACHE_VERSION,
  };

  /** Runtime caches are trimmed (oldest first) so a long browsing session cannot fill storage. */
  var CACHE_LIMITS = { static: 200, images: 120, pages: 30, api: 80 };

  /**
   * Cached public API answers are served instantly (and revalidated in background) only while
   * younger than this. Older entries go network-first and are used only when the network fails,
   * so a freshly published post/category shows up within this window even with the SW in front.
   */
  var API_SWR_FRESH_MS = 5 * 60 * 1000;

  var OFFLINE_URL = '/offline';

  var APP_SHELL = [
    '/',
    OFFLINE_URL,
    '/manifest.webmanifest',
    '/icon.svg',
    '/icon-192.png',
    '/icon-512.png',
    '/icon-maskable-512.png',
    '/apple-touch-icon.png',
  ];

  var SHELL_ASSETS = APP_SHELL.filter(function (path) {
    return path !== '/' && path !== OFFLINE_URL;
  });

  /**
   * SECURITY: personalized or transactional screens. Their HTML is never cached; offline they get
   * the static `/offline` page only.
   */
  var ONLINE_ONLY_NAV_PREFIXES = [
    '/account',
    '/orders',
    '/returns',
    '/profile',
    '/checkout',
    '/cart',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/pwa',
  ];

  /**
   * Public editorial navigations whose HTML is identical for every visitor (no server component
   * reads cookies/headers) and carries no price/stock. Product and category detail pages are left
   * out on purpose: their HTML shows prices, and an offline copy would show a stale price without
   * a label (`04-offline-commerce-ux.md`).
   */
  var PUBLIC_NAV_EXACT = ['/', '/category', '/news', '/chinh-sach', '/contact'];
  var PUBLIC_NAV_PATTERNS = [/^\/news\/[^/]+$/, /^\/chinh-sach\/[^/]+$/];

  /**
   * SECURITY: API families that carry identity, cart, checkout, order, payment or return data.
   * Checked BEFORE the public allowlist so a future public-looking sub-path cannot slip through.
   */
  var SENSITIVE_API_PATTERN =
    /^\/api\/v1\/(auth|account|me|customers?|carts?|checkouts?|orders?|payments?|returns?|admin)(\/|$)/;

  /**
   * Public, rarely-changing reference data served stale-while-revalidate. Products, reviews and
   * flash sales are NOT here: price/stock/slots must come from the network (React Query already
   * de-duplicates them in memory).
   */
  var API_SWR_PATTERNS = [
    /^\/api\/v1\/catalog\/categories$/,
    /^\/api\/v1\/content\/posts(\/[^/]+)?$/,
    /^\/api\/v1\/shipping\/areas\/(provinces|districts|wards)$/,
    /^\/api\/v1\/system\/parameters\/public$/,
  ];

  var STRATEGY = {
    BYPASS: 'bypass',
    NAV_ONLINE_ONLY: 'nav-online-only',
    NAV_PUBLIC: 'nav-public',
    NAV_NETWORK: 'nav-network',
    STATIC: 'static-cache-first',
    IMAGE: 'image-cache-first',
    API_SWR: 'api-swr',
  };

  function startsWithAny(pathname, prefixes) {
    for (var i = 0; i < prefixes.length; i += 1) {
      var prefix = prefixes[i];
      if (pathname === prefix || pathname.indexOf(prefix + '/') === 0) return true;
    }
    return false;
  }

  function matchesAny(pathname, patterns) {
    for (var i = 0; i < patterns.length; i += 1) {
      if (patterns[i].test(pathname)) return true;
    }
    return false;
  }

  function isPublicNavigation(pathname) {
    return PUBLIC_NAV_EXACT.indexOf(pathname) !== -1 || matchesAny(pathname, PUBLIC_NAV_PATTERNS);
  }

  /**
   * Decide how the worker handles one request.
   *
   * @param {{ method: string, url: string, mode?: string, hasAuthorization?: boolean, selfOrigin: string }} input
   * @returns {string} one of STRATEGY
   */
  function classifyRequest(input) {
    if (!input || String(input.method).toUpperCase() !== 'GET') return STRATEGY.BYPASS;
    // SECURITY: a request carrying a bearer token is by definition user-scoped; never cache it,
    // even when the path is public (the API may personalize the answer).
    if (input.hasAuthorization) return STRATEGY.BYPASS;

    var url;
    try {
      url = new URL(input.url);
    } catch (error) {
      return STRATEGY.BYPASS;
    }
    var pathname = url.pathname;

    // API: same-origin (Next rewrite on localhost) or the configured API origin in production.
    if (pathname.indexOf('/api/') === 0) {
      if (SENSITIVE_API_PATTERN.test(pathname)) return STRATEGY.BYPASS;
      if (matchesAny(pathname, API_SWR_PATTERNS)) return STRATEGY.API_SWR;
      return STRATEGY.BYPASS;
    }

    // Cross-origin non-API (remote product images with `no-cors`) would be opaque responses:
    // unreadable status and padded storage quota. Leave them to the HTTP cache.
    if (url.origin !== input.selfOrigin) return STRATEGY.BYPASS;

    // Another app (Admin) may share the origin; never intercept it.
    if (startsWithAny(pathname, ['/admin'])) return STRATEGY.BYPASS;

    if (input.mode === 'navigate') {
      if (startsWithAny(pathname, ONLINE_ONLY_NAV_PREFIXES)) return STRATEGY.NAV_ONLINE_ONLY;
      if (url.search === '' && isPublicNavigation(pathname)) return STRATEGY.NAV_PUBLIC;
      return STRATEGY.NAV_NETWORK;
    }

    if (pathname.indexOf('/_next/static/') === 0) return STRATEGY.STATIC;
    if (SHELL_ASSETS.indexOf(pathname) !== -1) return STRATEGY.STATIC;
    if (pathname === '/_next/image' || pathname.indexOf('/images/') === 0) return STRATEGY.IMAGE;
    return STRATEGY.BYPASS;
  }

  function headerValue(headers, name) {
    if (!headers) return '';
    if (typeof headers.get === 'function') return headers.get(name) || '';
    return headers[name] || headers[name.toLowerCase()] || '';
  }

  /**
   * Whether a response may be written to a cache.
   *
   * Browsers never expose `Set-Cookie` to a service worker (forbidden response header), so it
   * cannot be tested here; the route allowlist above is what keeps cookie-setting endpoints
   * (`/auth/*`) out. What CAN be tested is the server's own caching intent.
   *
   * @param {{ status: number, type?: string, headers?: Headers | Record<string, string> }} response
   */
  function isCacheableResponse(response) {
    if (!response || response.status !== 200) return false;
    if (response.type && response.type !== 'basic' && response.type !== 'cors' && response.type !== 'default') {
      return false; // opaque / opaqueredirect / error
    }
    var cacheControl = headerValue(response.headers, 'cache-control').toLowerCase();
    if (cacheControl.indexOf('no-store') !== -1 || cacheControl.indexOf('private') !== -1) return false;
    var vary = headerValue(response.headers, 'vary').toLowerCase();
    if (vary.indexOf('*') !== -1 || vary.indexOf('cookie') !== -1 || vary.indexOf('authorization') !== -1) {
      return false;
    }
    return true;
  }

  /** Whether a cached public API entry is young enough to serve before revalidating. */
  function isFreshApiEntry(cachedAtMs, nowMs) {
    var cachedAt = Number(cachedAtMs);
    if (!Number.isFinite(cachedAt) || cachedAt <= 0) return false;
    var age = nowMs - cachedAt;
    return age >= 0 && age < API_SWR_FRESH_MS;
  }

  function isStorefrontCache(name) {
    return typeof name === 'string' && name.indexOf(CACHE_PREFIX) === 0;
  }

  /** Caches from older worker versions; activate deletes these and nothing else on the origin. */
  function isObsoleteCache(name) {
    if (!isStorefrontCache(name)) return false;
    for (var key in CACHE_NAMES) {
      if (CACHE_NAMES[key] === name) return false;
    }
    return true;
  }

  /** Caches that may hold anything derived from a session's browsing; dropped on sign-out. */
  var SESSION_SCOPED_CACHES = [CACHE_NAMES.api, CACHE_NAMES.pages];

  root.StorefrontSwRouting = {
    CACHE_PREFIX: CACHE_PREFIX,
    CACHE_VERSION: CACHE_VERSION,
    CACHE_NAMES: CACHE_NAMES,
    CACHE_LIMITS: CACHE_LIMITS,
    API_SWR_FRESH_MS: API_SWR_FRESH_MS,
    OFFLINE_URL: OFFLINE_URL,
    APP_SHELL: APP_SHELL,
    SESSION_SCOPED_CACHES: SESSION_SCOPED_CACHES,
    STRATEGY: STRATEGY,
    classifyRequest: classifyRequest,
    isCacheableResponse: isCacheableResponse,
    isFreshApiEntry: isFreshApiEntry,
    isStorefrontCache: isStorefrontCache,
    isObsoleteCache: isObsoleteCache,
  };
})(self);
