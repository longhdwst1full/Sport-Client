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
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tất cả sản phẩm' }]}
          />

          {/* Catalog Hero Banner */}
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-slate-950 via-slate-900 to-[#032617] p-8 text-white shadow-xl sm:p-12">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                <Sparkles className="size-3.5" /> Kho thiết bị chính hãng Bảo An Sport
              </span>
              <h1 className="mt-4 text-3xl font-black text-white sm:text-5xl">
                Thiết Bị Thể Thao Chuẩn Thi Đấu
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                Thiết bị rèn luyện sức mạnh, cardio, bóng bàn, võ thuật và phụ kiện thể thao cho phòng tập và gia đình.
              </p>
            </div>

            {/* Ambient blur lighting */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-emerald-500/15 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-10 right-1/4 size-60 rounded-full bg-emerald-400/10 blur-[80px]" />
          </div>

          {/* Quick Value Props Strip — dẫn sang trang chính sách thật. Bản trước khai "Miễn phí tại
              nhà", "Trả góp 0% duyệt 5 phút" mà không có nguồn dữ liệu nào đứng sau. */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { icon: Truck, ...STORE_POLICY_PAGES.SHIPPING },
              { icon: ShieldCheck, ...STORE_POLICY_PAGES.WARRANTY },
              { icon: RotateCcw, ...STORE_POLICY_PAGES.RETURNS },
              { icon: CreditCard, ...STORE_POLICY_PAGES.PAYMENT },
            ].map((prop) => {
              const Icon = prop.icon;
              return (
                <Link
                  key={prop.href}
                  href={prop.href}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition hover:border-emerald-400"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <strong className="block truncate text-xs font-bold text-slate-900">
                      {prop.title}
                    </strong>
                    <span className="block truncate text-[11px] text-slate-500">Xem chi tiết</span>
                  </div>
                </Link>
              );
            })}
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
        </main>
      </div>
    </StorefrontLayout>
  );
}
