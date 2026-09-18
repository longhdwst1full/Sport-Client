export function isStorefrontRegistration(
  registration: ServiceWorkerRegistration,
  origin: string,
): boolean {
  const rootUrl = new URL('/', origin).href;
  const scriptUrl = new URL('/sw.js', origin).href;
  return (
    registration.scope === rootUrl &&
    [registration.active, registration.waiting, registration.installing].some(
      (worker) => worker?.scriptURL === scriptUrl,
    )
  );
}

export async function resetPwaAndReload(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    // SECURITY: nhiều ứng dụng có thể chung origin; reset chỉ gỡ worker của Storefront.
    await Promise.all(
      registrations
        .filter((registration) => isStorefrontRegistration(registration, window.location.origin))
        .map((registration) => registration.unregister()),
    );
  }
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name.startsWith('dctd-storefront-'))
        .map((name) => caches.delete(name)),
    );
  }
  window.location.reload();
}
