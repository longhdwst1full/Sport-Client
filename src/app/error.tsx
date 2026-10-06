'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RouteErrorContent } from '@/shared/components/route-error-content';

/** Lỗi ngoài vỏ storefront (đăng nhập, PWA…); lỗi trong storefront do `(storefront)/error.tsx` giữ header/footer. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 sm:px-6">
      <Link href="/" aria-label="Bảo An Sport - Trang chủ" className="mb-10 rounded-lg">
        <Image src="/images/logo.png" alt="" width={202} height={48} className="h-12 w-auto" />
      </Link>
      <RouteErrorContent digest={error.digest} onRetry={reset} />
    </main>
  );
}
