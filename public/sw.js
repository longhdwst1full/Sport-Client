/*
 * Storefront service worker. Routing rules (what is cached, and how) live in `sw-routing.js` as
 * pure functions with unit tests; this file only wires them to the Cache/Fetch APIs.
 *
 * Registered only in production builds (`src/pwa/pwa-registration.tsx`).
 */
importScripts('/sw-routing.js');

const R = self.StorefrontSwRouting;
const { CACHE_NAMES, CACHE_LIMITS, STRATEGY, OFFLINE_URL } = R;
const CACHED_AT_HEADER = 'x-dctd-sw-cached-at';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAMES.shell).then((cache) => cache.addAll(R.APP_SHELL)));
  // No skipWaiting here: a waiting worker activates only after the user confirms the update
  // prompt (SKIP_WAITING message), so an open checkout never switches worker mid-flow.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      // SECURITY: only this app's older versions; other apps on the origin keep their caches.
      .then((keys) => Promise.all(keys.filter(R.isObsoleteCache).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  // Cache.keys() keeps insertion order; drop the oldest first.
  await Promise.all(keys.slice(0, Math.max(keys.length - maxEntries, 0)).map((key) => cache.delete(key)));
}

async function putIfCacheable(cacheName, key, response, limit) {
  if (!R.isCacheableResponse(response)) return;
  const cache = await caches.open(cacheName);
  await cache.put(key, response);
  if (limit) await trimCache(cacheName, limit);
}

async function cacheFirst(event, cacheName, limit) {
  const cached = await caches.match(event.request, { cacheName });
  if (cached) return cached;
  const response = await fetch(event.request);
  event.waitUntil(putIfCacheable(cacheName, event.request, response.clone(), limit));
  return response;
}

function offlineFallback() {
  return caches.match(OFFLINE_URL, { cacheName: CACHE_NAMES.shell });
}

async function networkOnlyNavigation(event) {
  try {
    return await fetch(event.request);
  } catch {
    // SECURITY: personalized screens never get a cached copy, only the static offline page.
    return offlineFallback();
  }
}

async function publicNavigation(event) {
  const url = new URL(event.request.url);
  const key = url.origin + url.pathname;
  try {
    const response = await fetch(event.request);
    event.waitUntil(putIfCacheable(CACHE_NAMES.pages, key, response.clone(), CACHE_LIMITS.pages));
    return response;
  } catch {
    const cached =
      (await caches.match(key, { cacheName: CACHE_NAMES.pages })) ??
      (await caches.match(key, { cacheName: CACHE_NAMES.shell }));
    return cached ?? offlineFallback();
  }
}

async function networkNavigation(event) {
  try {
    return await fetch(event.request);
  } catch {
    return offlineFallback();
  }
}

/** Store with a timestamp so the freshness window can be enforced on read. */
async function stampedCopy(response) {
  const headers = new Headers(response.headers);
  headers.set(CACHED_AT_HEADER, String(Date.now()));
  const body = await response.blob();
  return new Response(body, { status: response.status, statusText: response.statusText, headers });
}

async function refreshApi(request) {
  const response = await fetch(request);
  if (R.isCacheableResponse(response)) {
    const cache = await caches.open(CACHE_NAMES.api);
    await cache.put(request, await stampedCopy(response.clone()));
    await trimCache(CACHE_NAMES.api, CACHE_LIMITS.api);
  }
  return response;
}

async function apiStaleWhileRevalidate(event) {
  const cached = await caches.match(event.request, { cacheName: CACHE_NAMES.api });
  if (cached && R.isFreshApiEntry(cached.headers.get(CACHED_AT_HEADER), Date.now())) {
    event.waitUntil(refreshApi(event.request).catch(() => undefined));
    return cached;
  }
  try {
    return await refreshApi(event.request);
  } catch (error) {
    // Offline: an older public answer beats an empty address form / category menu.
    // A real HTTP error (4xx/5xx) is returned above as-is, never masked by the cache.
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const strategy = R.classifyRequest({
    method: request.method,
    url: request.url,
    mode: request.mode,
    hasAuthorization: request.headers.has('authorization'),
    selfOrigin: self.location.origin,
  });

  switch (strategy) {
    case STRATEGY.NAV_ONLINE_ONLY:
      event.respondWith(networkOnlyNavigation(event));
      return;
    case STRATEGY.NAV_PUBLIC:
      event.respondWith(publicNavigation(event));
      return;
    case STRATEGY.NAV_NETWORK:
      event.respondWith(networkNavigation(event));
      return;
    case STRATEGY.STATIC:
      event.respondWith(cacheFirst(event, CACHE_NAMES.static, CACHE_LIMITS.static));
      return;
    case STRATEGY.IMAGE:
      event.respondWith(cacheFirst(event, CACHE_NAMES.images, CACHE_LIMITS.images));
      return;
    case STRATEGY.API_SWR:
      event.respondWith(apiStaleWhileRevalidate(event));
      return;
    default:
      // BYPASS: auth, account, cart, checkout, orders, payments, returns, admin, mutations,
      // RSC payloads, remote images — the browser handles them exactly as without a worker.
      return;
  }
});

function reply(event, payload) {
  event.ports?.[0]?.postMessage(payload);
}

self.addEventListener('message', (event) => {
  // SECURITY: lệnh ở đây xoá cache/kích hoạt worker mới — chỉ nhận từ trang cùng origin.
  if (event.origin !== self.location.origin) return;
  const type = event.data?.type;
  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  if (type === 'CLEAR_SESSION_CACHES') {
    // Sign-out / account switch: drop runtime caches filled while browsing.
    event.waitUntil(
      Promise.all(R.SESSION_SCOPED_CACHES.map((name) => caches.delete(name))).then(() =>
        reply(event, { ok: true }),
      ),
    );
    return;
  }
  if (type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.filter(R.isStorefrontCache).map((key) => caches.delete(key))))
        .then(() => reply(event, { ok: true })),
    );
  }
});
