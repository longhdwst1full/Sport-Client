const CACHE_PREFIX = 'dctd-storefront-';
const CACHE_NAME = `${CACHE_PREFIX}v3`;
const APP_SHELL = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
];
const PUBLIC_NAVIGATIONS = new Set(['/']);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== 'GET' || requestUrl.origin !== self.location.origin) return;
  if (requestUrl.pathname.startsWith('/api/') || requestUrl.pathname.startsWith('/admin')) return;

  const isOnlineOnlyNavigation = event.request.mode === 'navigate' && [
    '/account',
    '/orders',
    '/profile',
    '/checkout',
  ].some((prefix) => requestUrl.pathname.startsWith(prefix));
  if (isOnlineOnlyNavigation) {
    // SECURITY: Customer/Order/Checkout luôn network-only; offline chỉ trả trang
    // thông báo tĩnh, không dùng lại personalized HTML từ cache.
    event.respondWith(fetch(event.request).catch(() => caches.match('/offline')));
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok && PUBLIC_NAVIGATIONS.has(requestUrl.pathname)) {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached ?? caches.match('/offline'))),
    );
    return;
  }

  const isPublicStatic =
    requestUrl.pathname.startsWith('/_next/static/') ||
    requestUrl.pathname === '/icon.svg' ||
    requestUrl.pathname === '/icon-192.png' ||
    requestUrl.pathname === '/icon-512.png' ||
    requestUrl.pathname === '/manifest.webmanifest';
  if (!isPublicStatic) return;

  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ??
        fetch(event.request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        }),
    ),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
