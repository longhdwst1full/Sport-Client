import { Suspense } from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { STORE_POLICY_PAGES } from '@/shared/constants';
import { Breadcrumb } from '@/foundation/components/navigation';
import { ProductsCatalogView } from '../components/products-catalog-view';
import { FlashSaleSection } from '@/features/promotions';


export function ProductsPage() {
  return (
    <StorefrontLayout>
      <div className="bg-slate-50/60 pb-20 pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tất cả sản phẩm' }]}
          />

          {/* Compact Catalog Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-6 py-6 sm:px-8 sm:py-8 text-white shadow-md">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                <Sparkles className="size-3" /> Bảo An Sport — Tổng Kho Thể Thao Chính Hãng
              </span>
              <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl lg:text-4xl tracking-tight">
                Thiết Bị Thể Thao Chuẩn Thi Đấu
              </h1>
              <p className="mt-1.5 text-xs text-slate-300 sm:text-sm">
                Rèn luyện sức mạnh, cardio, bóng bàn, cầu lông, võ thuật và phụ kiện thể thao chính hãng.
              </p>
            </div>

            {/* Ambient lighting */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-emerald-500/20 blur-[80px]" />
          </div>

          {/* Thin Trust Benefits Bar (Single sleek strip) */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-3 text-xs font-semibold text-slate-600 shadow-xs">
            <Link
              href={STORE_POLICY_PAGES.SHIPPING.href}
              className="inline-flex items-center gap-2 hover:text-emerald-700 transition"
            >
              <Truck className="size-4 text-emerald-600" />
              <span>Giao & Lắp Đặt Toàn Quốc</span>
            </Link>
            <span className="hidden sm:inline text-slate-300">•</span>
            <Link
              href={STORE_POLICY_PAGES.WARRANTY.href}
              className="inline-flex items-center gap-2 hover:text-emerald-700 transition"
            >
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Bảo Hành Chính Hãng 100%</span>
            </Link>
            <span className="hidden sm:inline text-slate-300">•</span>
            <Link
              href={STORE_POLICY_PAGES.RETURNS.href}
              className="inline-flex items-center gap-2 hover:text-emerald-700 transition"
            >
              <RotateCcw className="size-4 text-emerald-600" />
              <span>Đổi Trả Minh Bạch</span>
            </Link>
            <span className="hidden sm:inline text-slate-300">•</span>
            <Link
              href={STORE_POLICY_PAGES.PAYMENT.href}
              className="inline-flex items-center gap-2 hover:text-emerald-700 transition"
            >
              <CreditCard className="size-4 text-emerald-600" />
              <span>Thanh Toán An Toàn</span>
            </Link>
          </div>

          {/* Interactive Products Catalog View */}
          <div className="mt-10">
            {/* useSearchParams trong view cần ranh giới Suspense để trang vẫn prerender được. */}
            <Suspense fallback={<div className="h-40 animate-pulse rounded-[28px] bg-slate-100" />}>
              <ProductsCatalogView />
            </Suspense>
          </div>

          {/* Flash Deals Banner for Catalog */}
          <div className="mt-16 overflow-hidden rounded-[32px]">
            <FlashSaleSection />
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
