import { Suspense } from 'react';
import { CheckoutPage, CheckoutSkeleton } from '@/features/checkout';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

export const metadata = { title: 'Đặt hàng & Thanh toán', robots: NOINDEX_ROBOTS };
export default function Page() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPage />
    </Suspense>
  );
}
