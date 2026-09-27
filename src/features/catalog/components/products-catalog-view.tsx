'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, X, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import { useProductShowcase } from '../hooks/use-product-showcase';
import { useCategoryTabs } from '../hooks/use-category-tabs';
import { useDebounce } from '@/shared/hooks';
import { CATALOG_PAGE_SIZE, type ProductShowcaseItem } from '../model/product.mapper';
import { ProductListSort } from '@/generated/api/catalog/catalog.schemas';
import { ProductCard } from './product-card';
import { CatalogSidebarFilters, type PriceRangeOption } from './catalog-sidebar-filters';
import { CatalogActiveChips } from './catalog-active-chips';
import { CatalogMobileFilterDrawer } from './catalog-mobile-filter-drawer';

// Khoảng giá gửi thẳng lên API (`minPrice`/`maxPrice`, VND) để lọc trên toàn bộ catalog
const PRICE_RANGES: PriceRangeOption[] = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under-2m', label: 'Dưới 2 triệu', max: '1999999' },
  { id: '2m-10m', label: '2 - 10 triệu', min: '2000000', max: '10000000' },
  { id: 'over-10m', label: 'Trên 10 triệu', min: '10000001' },
];

const SORT_OPTIONS: Array<{ value: ProductListSort; label: string }> = [
  { value: ProductListSort.NEWEST, label: 'Mới nhất' },
  { value: ProductListSort.PRICE_ASC, label: 'Giá: Thấp đến Cao' },
  { value: ProductListSort.PRICE_DESC, label: 'Giá: Cao đến Thấp' },
  { value: ProductListSort.NAME_ASC, label: 'Tên: A → Z' },
];

const isSort = (value: string | null): value is ProductListSort =>
  SORT_OPTIONS.some((option) => option.value === value);

export function ProductsCatalogView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Tab lấy từ danh mục thật (slug từ API)
  const { tabs, isPending: isTabsPending } = useCategoryTabs();

  // URL State Sync
  const activeTabSlug = searchParams.get('category') || null;
  const priceParam = searchParams.get('price');
  const activePriceRange = PRICE_RANGES.some((range) => range.id === priceParam)
    ? priceParam!
    : 'all';
  const sortParam = searchParams.get('sort');
  const activeSort: ProductListSort = isSort(sortParam) ? sortParam : ProductListSort.NEWEST;
  const urlSearch = searchParams.get('q') ?? '';

  const updateQuery = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const setActiveTabSlug = (slug: string | null) => updateQuery({ category: slug });
  const setActivePriceRange = (id: string) => updateQuery({ price: id === 'all' ? null : id });
  const setActiveSort = (sort: ProductListSort) =>
    updateQuery({ sort: sort === ProductListSort.NEWEST ? null : sort });

  // Search input state with debounce
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearch.trim() === urlSearch) return;
    updateQuery({ q: debouncedSearch.trim() || null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const selectedPriceRange = PRICE_RANGES.find((range) => range.id === activePriceRange);

  // Lọc danh mục chạy server-side (gồm cả nhánh con). Search cũng server-side.
  const {
    products,
    total,
    hasMore,
    loadMore,
    isPending,
    isLoadingMore,
    isLoadMoreError,
    isError,
    refetch,
  } = useProductShowcase(activeTabSlug ?? undefined, urlSearch, {
    pageSize: CATALOG_PAGE_SIZE.SCOPED,
    sort: activeSort === ProductListSort.NEWEST ? undefined : activeSort,
    minPrice: selectedPriceRange?.min,
    maxPrice: selectedPriceRange?.max,
  });

  // CONTRACT: API danh sách sản phẩm chỉ nhận category/search/sort/minPrice/maxPrice. Lọc thương
  // hiệu và "còn hàng" từng chạy trên client trên đúng một trang đã tải, nên cho kết quả sai (bỏ sót
  // sản phẩm ở trang sau, đếm "tìm thấy" lệch tổng). Gỡ cho đến khi API có tham số `brand`/`inStock`.
  const displayedProducts = products;

  const activeCategoryLabel = useMemo(() => {
    if (!activeTabSlug) return null;
    return tabs.find((t) => t.slug === activeTabSlug)?.label ?? activeTabSlug;
  }, [tabs, activeTabSlug]);

  const activePriceLabel = useMemo(() => {
    if (activePriceRange === 'all') return null;
    return PRICE_RANGES.find((p) => p.id === activePriceRange)?.label ?? null;
  }, [activePriceRange]);

  const hasActiveFilters =
    activeTabSlug !== null ||
    activePriceRange !== 'all' ||
    activeSort !== ProductListSort.NEWEST ||
    urlSearch !== '';

  const activeFilterCount =
    (activeTabSlug !== null ? 1 : 0) +
    (activePriceRange !== 'all' ? 1 : 0) +
    (urlSearch !== '' ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    router.replace(pathname, { scroll: false });
  };

  const handleBuyNow = (product: ProductShowcaseItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.isSellable || !product.defaultVariantId || !product.defaultVariantSku) {
      router.push(`/products/${product.slug}`);
      return;
    }

    dispatch(
      addCartItem({
        productId: product.id,
        variantId: product.defaultVariantId,
        sku: product.defaultVariantSku,
        productType: product.productType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
        price: product.numericPrice,
        quantity: 1,
      })
    );

    router.push(`/checkout?buyNow=${product.defaultVariantId}`);
  };

  // Remaining count for load more button
  const remainingCount = Math.max(total - products.length, 0);

  return (
    <section className="relative">
      {/* Mobile Sticky Control Bar */}
      <div className="mb-6 flex flex-col gap-3 lg:hidden">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            aria-label="Tìm sản phẩm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên thiết bị, máy tập..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-10 text-xs font-semibold text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-emerald-500 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
              aria-label="Xóa từ khóa"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:border-emerald-500"
          >
            <SlidersHorizontal className="size-3.5 text-emerald-600" />
            <span>Bộ lọc</span>
            {activeFilterCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-emerald-600 text-[10px] font-black text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Sắp xếp:</span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as ProductListSort)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs focus:border-emerald-500 focus:outline-hidden"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout (Faceted Sidebar + Product Grid) */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        {/* DESKTOP FACETED SIDEBAR */}
        <div className="hidden lg:block w-64 shrink-0 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <CatalogSidebarFilters
            tabs={tabs}
            activeTabSlug={activeTabSlug}
            onSelectCategory={setActiveTabSlug}
            priceRanges={PRICE_RANGES}
            activePriceRange={activePriceRange}
            onSelectPriceRange={setActivePriceRange}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
            isTabsPending={isTabsPending}
          />
        </div>

        {/* RIGHT COLUMN: SEARCH, ACTIVE CHIPS, PRODUCT GRID */}
        <div className="flex-1 min-w-0">
          {/* Desktop Search & Sort Bar */}
          <div className="hidden lg:flex items-center justify-between gap-4 mb-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                data-testid="catalog-search-input"
                aria-label="Tìm sản phẩm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên thiết bị, máy tập..."
                className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 py-2 pl-10 pr-9 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-200"
                  aria-label="Xóa từ khóa"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Tìm thấy <strong className="text-slate-900 font-bold">{displayedProducts.length}</strong> / {total} sản phẩm
              </span>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Sắp xếp:</span>
                <select
                  data-testid="catalog-sort-select"
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value as ProductListSort)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs focus:border-emerald-500 focus:outline-hidden"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ACTIVE FILTER CHIPS */}
          <div className="mb-4">
            <CatalogActiveChips
              categoryLabel={activeCategoryLabel}
              onClearCategory={() => setActiveTabSlug(null)}
              priceLabel={activePriceLabel}
              onClearPrice={() => setActivePriceRange('all')}
              searchQuery={urlSearch || null}
              onClearSearch={() => setSearchQuery('')}
              onClearAll={handleResetFilters}
            />
          </div>

          {/* LOADING STATE SKELETON */}
          {isPending && (
            <div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              aria-label="Đang tải danh sách sản phẩm"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[24px] border border-slate-100 bg-white p-4 shadow-xs"
                >
                  <div className="aspect-[4/3] animate-pulse rounded-xl bg-slate-100" />
                  <div className="mt-4 space-y-2.5">
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR STATE */}
          {isError && (
            <div
              className="rounded-3xl border border-rose-200 bg-rose-50/70 p-8 text-center text-rose-800"
              role="alert"
            >
              <p className="font-bold">Không thể tải danh sách sản phẩm lúc này.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-rose-800"
              >
                <RotateCcw className="size-3.5" /> Thử lại
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!isPending && !isError && displayedProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 px-4 text-center">
              <div className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                <Search className="size-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                Không tìm thấy sản phẩm phù hợp
              </h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Rất tiếc không có thiết bị nào đáp ứng các bộ lọc hiện tại. Bạn vui lòng thử xóa bớt bộ lọc hoặc tìm kiếm từ khóa khác.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Xóa tất cả bộ lọc</span>
                </button>
              )}
            </div>
          )}

          {/* PRODUCT GRID */}
          {!isPending && !isError && displayedProducts.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuyNow={handleBuyNow}
                  priority={idx < 3}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {!isPending && !isError && hasMore && (
            <div className="mt-10 flex flex-col items-center gap-2">
              {isLoadingMore && (
                <div
                  className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  aria-hidden="true"
                >
                  {Array.from({ length: 3 }, (_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] animate-pulse rounded-[24px] bg-slate-200/70"
                    />
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-xs transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingMore
                  ? 'Đang tải…'
                  : isLoadMoreError
                    ? 'Tải thêm chưa được — thử lại'
                    : 'Xem thêm'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER BOTTOM-SHEET FILTER */}
      <CatalogMobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        tabs={tabs}
        activeTabSlug={activeTabSlug}
        onSelectCategory={setActiveTabSlug}
        priceRanges={PRICE_RANGES}
        activePriceRange={activePriceRange}
        onSelectPriceRange={setActivePriceRange}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        totalProductsCount={displayedProducts.length}
      />
    </section>
  );
}
