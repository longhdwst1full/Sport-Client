'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  X,
  RotateCcw,
  Zap,
  SlidersHorizontal,
  Check,
  PackageCheck,
  Tag,
  Boxes,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import { useProductShowcase } from '../hooks/use-product-showcase';
import { useCategoryTabs } from '../hooks/use-category-tabs';
import { useDebounce } from '@/shared/hooks';
import { CATALOG_PAGE_SIZE } from '../model/product.mapper';
import { ProductListSort } from '@/generated/api/catalog/catalog.schemas';

// Khoảng giá gửi thẳng lên API (`minPrice`/`maxPrice`, VND) nên lọc trên toàn bộ catalog.
const PRICE_RANGES: Array<{ id: string; label: string; min?: string; max?: string }> = [
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
  const activePriceRange = PRICE_RANGES.some((range) => range.id === priceParam) ? priceParam! : 'all';
  const activeBrand = searchParams.get('brand') || 'all';
  const inStockOnly = searchParams.get('instock') === '1';
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
  const setActiveBrand = (brand: string) => updateQuery({ brand: brand === 'all' ? null : brand });
  const setInStockOnly = (val: boolean) => updateQuery({ instock: val ? '1' : null });
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

  // Extract available brands dynamically from the returned products
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand && p.brand !== 'Chính hãng') {
        brandsSet.add(p.brand);
      }
    });
    return Array.from(brandsSet).sort();
  }, [products]);

  // Apply Client-Side Facet Filters (Brand & In-Stock Only)
  const displayedProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeBrand !== 'all' && product.brand !== activeBrand) {
        return false;
      }
      if (inStockOnly && product.inStock === false) {
        return false;
      }
      return true;
    });
  }, [products, activeBrand, inStockOnly]);

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
    activeBrand !== 'all' ||
    inStockOnly ||
    activeSort !== ProductListSort.NEWEST ||
    urlSearch !== '';

  const activeFilterCount =
    (activeTabSlug !== null ? 1 : 0) +
    (activePriceRange !== 'all' ? 1 : 0) +
    (activeBrand !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (urlSearch !== '' ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    router.replace(pathname, { scroll: false });
  };

  const handleBuyNow = (e: React.MouseEvent, product: (typeof products)[number]) => {
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
        imageUrl: product.imageUrl,
        price: product.numericPrice,
        quantity: 1,
      })
    );

    router.push('/checkout');
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
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-10 text-xs font-semibold text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-emerald-500 focus:outline-none"
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
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs focus:border-emerald-500 focus:outline-none"
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
        <aside className="hidden lg:block w-64 shrink-0 space-y-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
              <SlidersHorizontal className="size-4 text-emerald-600" />
              Bộ lọc sản phẩm
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Facet 1: Danh mục */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
              <Boxes className="size-3.5 text-slate-400" />
              Danh mục
            </h4>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTabSlug(null)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
                  activeTabSlug === null
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>Tất cả sản phẩm</span>
                {activeTabSlug === null && <Check className="size-3.5 text-emerald-600" />}
              </button>
              {isTabsPending
                ? Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="h-7 w-full animate-pulse rounded-lg bg-slate-100" />
                  ))
                : tabs.map((tab) => {
                    if (!tab.slug) return null;
                    const isSelected = activeTabSlug === tab.slug;
                    return (
                      <button
                        key={tab.slug}
                        type="button"
                        onClick={() => setActiveTabSlug(tab.slug)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-800 font-extrabold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{tab.label}</span>
                        {isSelected && <Check className="size-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
            </div>
          </div>

          {/* Facet 2: Khoảng giá */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
              <Tag className="size-3.5 text-slate-400" />
              Khoảng giá
            </h4>
            <div className="space-y-1.5">
              {PRICE_RANGES.map((range) => {
                const isSelected = activePriceRange === range.id;
                return (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => setActivePriceRange(range.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{range.label}</span>
                    <div
                      className={`grid size-4 place-items-center rounded-full border ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Facet 3: Thương hiệu */}
          {availableBrands.length > 0 && (
            <div className="border-t border-slate-100 pt-5">
              <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
                <Tag className="size-3.5 text-slate-400" />
                Thương hiệu
              </h4>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setActiveBrand('all')}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                    activeBrand === 'all'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Tất cả thương hiệu</span>
                  {activeBrand === 'all' && <Check className="size-3.5 text-emerald-600" />}
                </button>
                {availableBrands.map((brand) => {
                  const isSelected = activeBrand === brand;
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setActiveBrand(brand)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{brand}</span>
                      {isSelected && <Check className="size-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Facet 4: Tình trạng hàng */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
              <PackageCheck className="size-3.5 text-slate-400" />
              Tình trạng
            </h4>
            <label className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="size-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span>Chỉ hiện sản phẩm còn hàng</span>
            </label>
          </div>
        </aside>

        {/* MAIN PRODUCT LISTING COLUMN */}
        <div className="flex-1 min-w-0">
          {/* Desktop Search & Controls Top Bar */}
          <div className="hidden lg:block space-y-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                aria-label="Tìm sản phẩm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên thiết bị, máy chạy bộ, giàn tạ, vợt bóng bàn..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-10 text-xs font-semibold text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 sm:text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  aria-label="Xóa từ khóa"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Meta status bar */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="font-semibold text-slate-600">
                Đang hiển thị{' '}
                <strong className="font-black text-slate-900">{displayedProducts.length}</strong> /{' '}
                {total} sản phẩm
              </span>

              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                  Sắp xếp:
                </span>
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value as ProductListSort)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs focus:border-emerald-500 focus:outline-none"
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
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Đang lọc:</span>

              {activeCategoryLabel && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
                  <span>{activeCategoryLabel}</span>
                  <button
                    type="button"
                    onClick={() => setActiveTabSlug(null)}
                    aria-label="Bỏ lọc danh mục"
                    className="hover:text-emerald-950"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {activePriceLabel && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
                  <span>{activePriceLabel}</span>
                  <button
                    type="button"
                    onClick={() => setActivePriceRange('all')}
                    aria-label="Bỏ lọc giá"
                    className="hover:text-emerald-950"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {activeBrand !== 'all' && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
                  <span>Hãng: {activeBrand}</span>
                  <button
                    type="button"
                    onClick={() => setActiveBrand('all')}
                    aria-label="Bỏ lọc hãng"
                    className="hover:text-emerald-950"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
                  <span>Còn hàng</span>
                  <button
                    type="button"
                    onClick={() => setInStockOnly(false)}
                    aria-label="Bỏ lọc còn hàng"
                    className="hover:text-emerald-950"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {urlSearch && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 shadow-2xs">
                  <span>Từ khóa: &quot;{urlSearch}&quot;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Xóa từ khóa"
                    className="hover:text-slate-900"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline ml-1"
              >
                <RotateCcw className="size-3" />
                <span>Xóa tất cả</span>
              </button>
            </div>
          )}

          {/* PRODUCT GRID */}
          <div className="mt-6">
            {isPending ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white"
                  >
                    <div className="aspect-[4/3] animate-pulse bg-slate-200" />
                    <div className="space-y-3 p-5">
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                      <div className="h-6 animate-pulse rounded bg-slate-200" />
                      <div className="h-10 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center" role="alert">
                <p className="font-bold text-red-800">Không thể tải sản phẩm lúc này.</p>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-800 px-5 py-2.5 text-sm font-bold text-white"
                >
                  <RotateCcw className="size-4" /> Thử lại
                </button>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
                <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Search className="size-8" />
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-900">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Thử điều chỉnh từ khóa tìm kiếm hoặc xóa bớt tiêu chí trong bộ lọc.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-600 active:scale-95"
                >
                  <RotateCcw className="size-3.5" /> Xem tất cả sản phẩm
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {displayedProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-xs transition duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl"
                  >
                    <div className="flex w-full flex-1 flex-col">
                      {/* Product Image Link */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
                        aria-label={`Xem chi tiết ${product.name}`}
                      >
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                        {/* Top Badge */}
                        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-1.5">
                          <span className="rounded-full border border-slate-100 bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-2xs backdrop-blur-xs">
                            {product.productType === 'BUNDLE' ? 'Combo trọn bộ' : product.badge}
                          </span>
                        </div>
                      </Link>

                      {/* Card Content */}
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em]">
                          <span className="text-emerald-700">{product.brand}</span>
                          <span className="truncate text-slate-400">{product.category}</span>
                        </div>

                        <h3 className="mt-2 min-h-[44px] text-sm font-bold leading-snug text-slate-900 line-clamp-2 transition group-hover:text-emerald-700">
                          <Link href={`/products/${product.slug}`} className="hover:underline">
                            {product.name}
                          </Link>
                        </h3>

                        {/* Price & Buy Now Action */}
                        <div className="mt-auto flex items-end justify-between gap-2 border-t border-slate-100 pt-3">
                          <div>
                            <span className="block text-[10px] font-semibold text-slate-400">
                              Giá niêm yết
                            </span>
                            <div className="flex items-baseline gap-1.5">
                              <strong className="text-base font-black text-emerald-700 sm:text-lg">
                                {product.displayPrice}
                              </strong>
                            </div>
                            {product.inStock === false && (
                              <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                Tạm hết hàng
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleBuyNow(e, product)}
                            disabled={!product.hasPrice || product.inStock === false}
                            className="relative z-10 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"
                            title={
                              product.inStock === false
                                ? 'Sản phẩm tạm hết hàng'
                                : !product.hasPrice
                                  ? 'Sản phẩm chưa có giá'
                                  : product.isSellable
                                    ? 'Mua ngay'
                                    : 'Mở chi tiết để chọn phiên bản'
                            }
                            aria-label={`Mua ngay ${product.name}`}
                          >
                            <Zap className="size-3.5 fill-white" />
                            <span>Mua ngay</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {!isPending && !isError && hasMore && (
              <div className="mt-10 flex flex-col items-center gap-2">
                {isLoadingMore && (
                  <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div
                        key={i}
                        className="aspect-[4/5] animate-pulse rounded-[24px] bg-slate-200/70"
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
                      : `Xem thêm (${remainingCount} sản phẩm)`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER BOTTOM-SHEET FILTER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/60 backdrop-blur-xs lg:hidden">
          <div className="flex max-h-[85vh] w-full flex-col rounded-t-[32px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="flex items-center gap-2 text-sm font-black uppercase text-slate-900">
                <SlidersHorizontal className="size-4 text-emerald-600" />
                Bộ lọc tìm kiếm
              </span>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {/* Category */}
              <div>
                <h4 className="text-xs font-black uppercase text-slate-700 mb-2">Danh mục</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTabSlug(null)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                      activeTabSlug === null
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    Tất cả
                  </button>
                  {tabs.map((tab) => {
                    if (!tab.slug) return null;
                    const isSelected = activeTabSlug === tab.slug;
                    return (
                      <button
                        key={tab.slug}
                        type="button"
                        onClick={() => setActiveTabSlug(tab.slug)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                          isSelected
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs font-black uppercase text-slate-700 mb-2">Khoảng giá</h4>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((range) => {
                    const isSelected = activePriceRange === range.id;
                    return (
                      <button
                        key={range.id}
                        type="button"
                        onClick={() => setActivePriceRange(range.id)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* In-Stock */}
              <div>
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="size-4 rounded text-emerald-600 border-slate-300"
                  />
                  <span>Chỉ hiện sản phẩm còn hàng</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700"
              >
                Xóa lọc
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
