import { listCatalogProducts } from '@/generated/api/catalog/catalog';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { STORE_POLICY_PAGES } from '@/shared/constants';
import { Breadcrumb } from '@/foundation/components/navigation';
import { ProductsCatalogView } from '../components/products-catalog-view';
import { CATALOG_PAGE_SIZE } from '../model/product.mapper';
import { parseCatalogUrlState, type CatalogListFilters } from '../model/catalog-filter.constants';
import type { CatalogInitialPage } from '../hooks/use-catalog-filters';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';

/**
 * Lấy trước trang 1 trên server để HTML có sẵn thẻ sản phẩm + link (SEO), cùng `limit` và bộ lọc
 * với hook client nên cache khớp đúng query key. Lỗi API không chặn trang: client tự tải lại.
 */
const CATALOG_PROMISES = [
  { href: STORE_POLICY_PAGES.SHIPPING.href, icon: Truck, label: 'Giao & Lắp Đặt Toàn Quốc', iconClassName: 'text-sky-600' },
  { href: STORE_POLICY_PAGES.WARRANTY.href, icon: ShieldCheck, label: 'Bảo Hành Chính Hãng', iconClassName: 'text-emerald-600' },
  { href: STORE_POLICY_PAGES.RETURNS.href, icon: RotateCcw, label: 'Đổi Trả Minh Bạch', iconClassName: 'text-amber-600' },
  { href: STORE_POLICY_PAGES.PAYMENT.href, icon: CreditCard, label: 'Thanh Toán An Toàn', iconClassName: 'text-indigo-600' },
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
      <main className="bg-slate-50/40 pb-20 pt-8">
        <div className="page-container">
          <Breadcrumb
            className="mb-6"
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tất cả sản phẩm' }]}
          />

          {/* Compact Catalog Hero Banner */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/80 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-red-600 shadow-2xs">
              Bảo An Sport — Thể thao chính hãng
            </div>
            <h1 className="mt-2.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
              Thiết bị & phụ kiện thể thao
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-medium">
              Rèn luyện sức mạnh, cardio, bóng bàn, cầu lông, võ thuật và phụ kiện thể thao chính hãng.
            </p>
          </div>

          {/* Thin Trust Benefits Bar */}
          <ul className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-2xs lg:grid-cols-4">
            {CATALOG_PROMISES.map(({ href, icon: Icon, label, iconClassName }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex h-full items-center justify-center gap-2 rounded-xl bg-slate-50/80 px-3 py-2.5 text-xs font-extrabold text-slate-700 transition hover:bg-red-50 hover:text-red-700 hover:border-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-600"
                >
                  <Icon aria-hidden className={`size-4 shrink-0 ${iconClassName}`} />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Interactive Products Catalog View */}
          <div className="mt-10">
            {/* Không bọc Suspense: route đọc `searchParams` nên luôn render động, `useSearchParams` có sẵn
                ở server. Bọc Suspense làm lưới bị stream SAU footer trong HTML (crawler đọc footer trước
                sản phẩm) dù trên màn hình vẫn đúng thứ tự. */}
            <ProductsCatalogView initial={initial} initialCategoryName={initialCategoryName} />
          </div>

          {/* Flash Deals Banner for Catalog */}
          <div className="mt-16 overflow-hidden rounded-4xl">
            <FlashSaleSection />
          </div>
        </div>
      </main>
  );
}
