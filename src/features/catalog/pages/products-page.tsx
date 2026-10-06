import { Suspense } from 'react';
import { listCatalogProducts } from '@/generated/api/catalog/catalog';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { STORE_POLICY_PAGES } from '@/shared/constants';
import { Breadcrumb } from '@/foundation/components/navigation';
import { Skeleton } from '@/foundation/components/feedback';
import { ProductsCatalogView } from '../components/products-catalog-view';
import { ProductCardSkeleton } from '../components/product-card';
import { CATALOG_PAGE_SIZE } from '../model/product.mapper';
import { parseCatalogUrlState, type CatalogListFilters } from '../model/catalog-filter.constants';
import type { CatalogInitialPage } from '../hooks/use-catalog-filters';

/**
 * Lấy trước trang 1 trên server để HTML có sẵn thẻ sản phẩm + link (SEO), cùng `limit` và bộ lọc
 * với hook client nên cache khớp đúng query key. Lỗi API không chặn trang: client tự tải lại.
 */
export async function loadCatalogFirstPage(
  filters: CatalogListFilters,
): Promise<CatalogInitialPage | undefined> {
  try {
    const page = await listCatalogProducts({ page: 1, limit: CATALOG_PAGE_SIZE.SCOPED, ...filters });
    return { page, fetchedAt: Date.now(), filters };
  } catch {
    return undefined;
  }
}

type SearchParamsRecord = Record<string, string | string[] | undefined>;
import { FlashSaleSection } from '@/features/promotions';


/** Khung chờ cùng bố cục `ProductsCatalogView` (sidebar lg + lưới 3 cột) để khỏi nhảy layout khi hydrate. */
function ProductsCatalogViewSkeleton() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start" role="status" aria-label="Đang tải danh mục sản phẩm">
      <div className="hidden w-64 shrink-0 space-y-3 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs lg:block">
        <Skeleton className="h-4 w-32 rounded" />
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-8 rounded-xl" />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <Skeleton className="mb-4 h-12 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function ProductsPage({ searchParams }: { searchParams?: Promise<SearchParamsRecord> } = {}) {
  const query = (await searchParams) ?? {};
  const { filters } = parseCatalogUrlState((key) => {
    const value = query[key];
    return Array.isArray(value) ? value[0] : value;
  });
  const initial = await loadCatalogFirstPage(filters);

  return (
      <main className="bg-slate-50/60 pb-20 pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tất cả sản phẩm' }]}
          />

          {/* Compact Catalog Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 px-6 py-6 sm:px-8 sm:py-8 text-white shadow-md">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-950/60 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-brand-300 backdrop-blur-md">
                <Sparkles aria-hidden className="size-3" /> Bảo An Sport — Tổng Kho Thể Thao Chính Hãng
              </span>
              <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl lg:text-4xl tracking-tight">
                Thiết Bị Thể Thao Chuẩn Thi Đấu
              </h1>
              <p className="mt-1.5 text-xs text-slate-300 sm:text-sm">
                Rèn luyện sức mạnh, cardio, bóng bàn, cầu lông, võ thuật và phụ kiện thể thao chính hãng.
              </p>
            </div>

            {/* Ambient lighting */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-brand-500/20 blur-[80px]" />
          </div>

          {/* Thin Trust Benefits Bar (Single sleek strip) */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-3 text-xs font-semibold text-slate-600 shadow-xs">
            <Link
              href={STORE_POLICY_PAGES.SHIPPING.href}
              className="inline-flex items-center gap-2 rounded transition hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              <Truck aria-hidden className="size-4 text-brand-600" />
              <span>Giao & Lắp Đặt Toàn Quốc</span>
            </Link>
            <span className="hidden sm:inline text-slate-300">•</span>
            <Link
              href={STORE_POLICY_PAGES.WARRANTY.href}
              className="inline-flex items-center gap-2 rounded transition hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              <ShieldCheck aria-hidden className="size-4 text-brand-600" />
              <span>Bảo Hành Chính Hãng 100%</span>
            </Link>
            <span className="hidden sm:inline text-slate-300">•</span>
            <Link
              href={STORE_POLICY_PAGES.RETURNS.href}
              className="inline-flex items-center gap-2 rounded transition hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              <RotateCcw aria-hidden className="size-4 text-brand-600" />
              <span>Đổi Trả Minh Bạch</span>
            </Link>
            <span className="hidden sm:inline text-slate-300">•</span>
            <Link
              href={STORE_POLICY_PAGES.PAYMENT.href}
              className="inline-flex items-center gap-2 rounded transition hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              <CreditCard aria-hidden className="size-4 text-brand-600" />
              <span>Thanh Toán An Toàn</span>
            </Link>
          </div>

          {/* Interactive Products Catalog View */}
          <div className="mt-10">
            {/* useSearchParams trong view cần ranh giới Suspense để trang vẫn prerender được. */}
            <Suspense fallback={<ProductsCatalogViewSkeleton />}>
              <ProductsCatalogView initial={initial} />
            </Suspense>
          </div>

          {/* Flash Deals Banner for Catalog */}
          <div className="mt-16 overflow-hidden rounded-[32px]">
            <FlashSaleSection />
          </div>
        </div>
      </main>
  );
}
