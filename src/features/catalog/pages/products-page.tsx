import { listCatalogProducts } from '@/generated/api/catalog/catalog';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { STORE_POLICY_PAGES } from '@/shared/constants';
import { Breadcrumb } from '@/foundation/components/navigation';
import { ProductsCatalogView } from '../components/products-catalog-view';
import { CATALOG_PAGE_SIZE } from '../model/product.mapper';
import { parseCatalogUrlState, toListCatalogParams, type CatalogListFilters } from '../model/catalog-filter.constants';
import type { CatalogInitialPage } from '../hooks/use-catalog-filters';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';

/**
 * Lấy trước trang 1 trên server để HTML có sẵn thẻ sản phẩm + link (SEO), cùng `limit` và bộ lọc
 * với hook client nên cache khớp đúng query key. Lỗi API không chặn trang: client tự tải lại.
 */
const CATALOG_PROMISES = [
  { href: STORE_POLICY_PAGES.SHIPPING.href, icon: Truck, label: 'Giao & Lắp Đặt Toàn Quốc', iconClassName: 'text-neutral-600' },
  { href: STORE_POLICY_PAGES.WARRANTY.href, icon: ShieldCheck, label: 'Bảo Hành Chính Hãng', iconClassName: 'text-success-600' },
  { href: STORE_POLICY_PAGES.RETURNS.href, icon: RotateCcw, label: 'Đổi Trả Minh Bạch', iconClassName: 'text-amber-600' },
  { href: STORE_POLICY_PAGES.PAYMENT.href, icon: CreditCard, label: 'Thanh Toán An Toàn', iconClassName: 'text-neutral-600' },
] as const;

export async function loadCatalogFirstPage(
  filters: CatalogListFilters,
  {
    includeFacets = false,
    requestHeaders,
  }: {
    includeFacets?: boolean;
    /** Header theo request (IP khách) — chỉ truyền từ trang động; trang ISR bỏ trống. */
    requestHeaders?: Record<string, string>;
  } = {},
): Promise<CatalogInitialPage | undefined> {
  try {
    const page = await listCatalogProducts(
      {
        page: 1,
        limit: CATALOG_PAGE_SIZE.SCOPED,
        ...toListCatalogParams(filters),
        ...(includeFacets ? { includeFacets: true } : {}),
      },
      requestHeaders ? { headers: requestHeaders } : undefined,
    );
    return { page, fetchedAt: Date.now(), filters };
  } catch {
    return undefined;
  }
}

type SearchParamsRecord = Record<string, string | string[] | undefined>;


export async function ProductsPage({
  searchParams,
  categories,
  requestHeaders,
}: {
  searchParams?: Promise<SearchParamsRecord>;
  /** Cây danh mục (cache dùng chung ở route) để tra tên danh mục đang lọc. */
  categories?: CatalogCategoryDto[];
  /** Header theo request (IP khách) do route động truyền vào; feature không tự gọi `next/headers`. */
  requestHeaders?: Record<string, string>;
} = {}) {
  const query = (await searchParams) ?? {};
  const { filters } = parseCatalogUrlState((key) => {
    const value = query[key];
    return Array.isArray(value) ? value[0] : value;
  });
  // `includeFacets`: sidebar có sẵn danh sách thương hiệu ngay trong HTML đầu.
  const initial = await loadCatalogFirstPage(filters, { includeFacets: true, requestHeaders });
  const initialCategoryName = categories?.find((item) => item.slug === filters.category)?.name;

  const breadcrumbItems = initialCategoryName
    ? [
        { label: 'Trang chủ', href: '/' },
        { label: 'Tất cả sản phẩm', href: '/products' },
        { label: initialCategoryName },
      ]
    : [{ label: 'Trang chủ', href: '/' }, { label: 'Tất cả sản phẩm' }];

  const pageTitle = initialCategoryName ? `${initialCategoryName} chính hãng` : 'Thiết bị & phụ kiện thể thao';
  const pageDescription = initialCategoryName
    ? `Khám phá các dòng sản phẩm ${initialCategoryName.toLowerCase()} chất lượng cao, bảo hành chính hãng, giao hàng & lắp đặt tận nơi toàn quốc.`
    : 'Rèn luyện sức mạnh, cardio, bóng bàn, cầu lông, võ thuật và phụ kiện thể thao chính hãng uy tín toàn quốc.';

  return (
      <main className="bg-neutral-50/40 pb-20 pt-8">
        <div className="page-container">
          <Breadcrumb
            className="mb-6"
            items={breadcrumbItems}
          />

          {/* Catalog Hero Banner with Integrated Trust Badges */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between pb-6 border-b border-neutral-200/80">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-neutral-700 shadow-2xs">
                Bảo An Sport — Thể thao chính hãng
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl lg:text-4xl">
                {pageTitle}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                {pageDescription}
              </p>
            </div>

            {/* Quick Trust Badges in Header */}
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              {CATALOG_PROMISES.map(({ href, icon: Icon, label, iconClassName }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 shadow-2xs transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus-ring"
                >
                  <Icon aria-hidden className={`size-3.5 shrink-0 ${iconClassName}`} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Interactive Products Catalog View */}
          <div className="mt-6">
            {/* Không bọc Suspense: route đọc `searchParams` nên luôn render động, `useSearchParams` có sẵn
                ở server. Bọc Suspense làm lưới bị stream SAU footer trong HTML (crawler đọc footer trước
                sản phẩm) dù trên màn hình vẫn đúng thứ tự. */}
            <ProductsCatalogView initial={initial} initialCategoryName={initialCategoryName} />
          </div>
        </div>
      </main>
  );
}
