import { Suspense } from 'react';
import { CheckoutPage } from '@/features/checkout';
import { NOINDEX_ROBOTS } from '@/shared/seo/page-metadata';

export const metadata = { title: 'Đặt hàng & Thanh toán', robots: NOINDEX_ROBOTS };
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid place-items-center bg-slate-50">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
            <span className="size-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <span>Đang chuẩn bị thông tin đặt hàng...</span>
          </div>
        </div>
      }
    >
      <CheckoutPage />
    </Suspense>
  );
}
