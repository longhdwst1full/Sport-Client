'use client';

import { RouteErrorContent } from '@/shared/components/route-error-content';

/** Lỗi render trong storefront: giữ header/footer để khách vẫn điều hướng/gọi hotline được. */
export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <RouteErrorContent digest={error.digest} onRetry={reset} />
    </main>
  );
}
