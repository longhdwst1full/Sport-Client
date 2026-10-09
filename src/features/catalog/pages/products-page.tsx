import { Suspense } from 'react';
import { listCatalogProducts } from '@/generated/api/catalog/catalog';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { STORE_POLICY_PAGES } from '@/shared/constants';
import { Breadcrumb } from '@/foundation/components/navigation';
import { Skeleton } from '@/foundation/components/feedback';
import { ProductsCatalogView } from '../components/products-catalog-view';
import { ProductCardSkeleton } from '../components/product-card';
import { CATALOG_PAGE_SIZE } from '../model/product.mapper';
import { parseCatalogUrlState, type CatalogListFilters } from '../model/catalog-filter.constants';
import type { CatalogInitialPage } from '../hooks/use-catalog-filters';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';

/**
 * Lấy trước trang 1 trên server để HTML có sẵn thẻ sản phẩm + link (SEO), cùng `limit` và bộ lọc
 * với hook client nên cache khớp đúng query key. Lỗi API không chặn trang: client tự tải lại.
 */
const CATALOG_PROMISES = [
  { href: STORE_POLICY_PAGES.SHIPPING.href, icon: Truck, label: 'Giao & Lắp Đặt Toàn Quốc', iconClassName: 'text-neutral-700' },
  { href: STORE_POLICY_PAGES.WARRANTY.href, icon: ShieldCheck, label: 'Bảo Hành Chính Hãng', iconClassName: 'text-success-600' },
  { href: STORE_POLICY_PAGES.RETURNS.href, icon: RotateCcw, label: 'Đổi Trả Minh Bạch', iconClassName: 'text-neutral-700' },
  { href: STORE_POLICY_PAGES.PAYMENT.href, icon: CreditCard, label: 'Thanh Toán An Toàn', iconClassName: 'text-neutral-700' },
] as const;

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
      <div className="hidden w-64 shrink-0 space-y-3 surface-card p-5 shadow-xs lg:block">
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

export async function ProductsPage({
  searchParams,
  categories,
}: {
  searchParams?: Promise<SearchParamsRecord>;
  /** Cây danh mục (cache dùng chung ở route) để tra tên danh mục đang lọc. */
  categories?: CatalogCategoryDto[];
} = {}) {
  const query = (await searchParams) ?? {};
  const { filters } = parseCatalogUrlState((key) => {
    const value = query[key];
    return Array.isArray(value) ? value[0] : value;
  });
  const initial = await loadCatalogFirstPage(filters);
  const initialCategoryName = categories?.find((item) => item.slug === filters.category)?.name;

  return (
      <main className="bg-white pb-20 pt-8">
        <div className="page-container">
          <Breadcrumb
            className="mb-6"
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tất cả sản phẩm' }]}
          />

          {/* Compact Catalog Hero Banner */}
          {/* Tiêu đề trang trên nền trang (không khối tối): trang danh sách để ảnh sản phẩm tạo màu. */}
          <div className="max-w-2xl">
            <span className="eyebrow text-neutral-500">Bảo An Sport — Thể thao chính hãng</span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl lg:text-4xl">
              Thiết bị & phụ kiện thể thao
            </h1>
            <p className="mt-1.5 text-sm text-neutral-600">
              Rèn luyện sức mạnh, cardio, bóng bàn, cầu lông, võ thuật và phụ kiện thể thao chính hãng.
            </p>
          </div>

          {/* Thin Trust Benefits Bar (Single sleek strip) */}
          <ul className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 text-xs font-semibold text-neutral-600 lg:grid-cols-4">
            {CATALOG_PROMISES.map(({ href, icon: Icon, label, iconClassName }) => (
              <li key={href} className="bg-white">
                <Link
                  href={href}
                  className="flex h-full items-center justify-center gap-2 px-3 py-3 text-center transition hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900"
                >
                  <Icon aria-hidden className={`size-4 shrink-0 ${iconClassName}`} />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Interactive Products Catalog View */}
          <div className="mt-10">
            {/* useSearchParams trong view cần ranh giới Suspense để trang vẫn prerender được. */}
            <Suspense fallback={<ProductsCatalogViewSkeleton />}>
              <ProductsCatalogView initial={initial} initialCategoryName={initialCategoryName} />
            </Suspense>
          </div>

          {/* Flash Deals Banner for Catalog */}
          <div className="mt-16 overflow-hidden rounded-4xl">
            <FlashSaleSection />
          </div>
        </div>
      </main>
  );
}
