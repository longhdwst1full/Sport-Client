'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useProductShowcase } from './use-product-showcase';
import { useCategoryTabs } from './use-category-tabs';
import { useDebounce } from '@/shared/hooks';
import { CATALOG_PAGE_SIZE } from '../model/product.mapper';
import { ProductListSort } from '@/generated/api/catalog/catalog.schemas';
import type { ProductListResponseDto } from '@/generated/api/catalog/catalog.schemas';
import { formatVnd } from '@/shared/format/money';
import { formatPriceRangeLabel } from '../model/catalog-price-range';
import {
  PRICE_RANGES,
  parseCatalogUrlState,
  type CatalogListFilters,
} from '../model/catalog-filter.constants';
import type { CatalogSidebarFiltersProps } from '../components/catalog-sidebar-filters';
import type { CatalogActiveChipsProps } from '../components/catalog-active-chips';
import type { CatalogQueryState } from '../components/catalog/catalog-query-controls';

/**
 * Owns the catalog listing's URL-synced filter state (category/price/sort/search)
 * plus the resulting product query, so the view component only renders.
 */
export interface CatalogInitialPage {
  page: ProductListResponseDto;
  fetchedAt: number;
  filters: CatalogListFilters;
}

/**
 * `initialCategoryName`: tên danh mục đang lọc do server tra sẵn, để HTML đầu (trước khi danh sách
 * danh mục tải ở client) hiện tên thay vì slug.
 */
export function useCatalogFilters(initial?: CatalogInitialPage, initialCategoryName?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Tab lấy từ danh mục thật (slug từ API)
  const { tabs, nameBySlug, isPending: isTabsPending } = useCategoryTabs();

  // URL State Sync
  const { activeTabSlug, activePriceRange, priceMin, priceMax, activeSort, urlSearch, activeBrand, inStockOnly, filters } = parseCatalogUrlState(
    (key) => searchParams.get(key),
  );

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
  // Khoảng giá tự do thay thế `?price=<id>` (xoá id cũ để hai nguồn không mâu thuẫn).
  const setPriceRange = (min: number | null, max: number | null) =>
    updateQuery({
      price: null,
      minPrice: min === null ? null : String(min),
      maxPrice: max === null ? null : String(max),
    });
  const setActiveBrand = (slug: string | null) => updateQuery({ brand: slug });
  const setInStockOnly = (value: boolean) => updateQuery({ instock: value ? '1' : null });
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

  // Lọc danh mục chạy server-side (gồm cả nhánh con). Search cũng server-side.
  // Thương hiệu và "còn hàng" lọc ở server (`brand[]`, `inStock`) trên toàn bộ catalog — không lọc
  // client trên một trang đã tải (bỏ sót trang sau, đếm lệch tổng). Facet thương hiệu do API đếm.
  const list = useProductShowcase(filters.category, filters.search, {
    pageSize: CATALOG_PAGE_SIZE.SCOPED,
    keepPreviousResults: true,
    sort: filters.sort,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    brand: filters.brand,
    inStock: filters.inStock,
    includeFacets: true,
    initialPage: initial?.page,
    initialPageFetchedAt: initial?.fetchedAt,
    initialPageFilters: initial?.filters,
  });

  const activeCategoryLabel = useMemo(() => {
    if (!activeTabSlug) return null;
    return (
      nameBySlug.get(activeTabSlug)
      ?? tabs.find((t) => t.slug === activeTabSlug)?.label
      ?? (initial?.filters.category === activeTabSlug ? initialCategoryName : undefined)
      ?? activeTabSlug
    );
  }, [nameBySlug, tabs, activeTabSlug, initial?.filters.category, initialCategoryName]);

  const activePriceLabel = useMemo(() => {
    if (priceMin === null && priceMax === null) return null;
    return (
      PRICE_RANGES.find((p) => p.id === activePriceRange)?.label
      ?? formatPriceRangeLabel(priceMin, priceMax, formatVnd)
    );
  }, [activePriceRange, priceMin, priceMax]);

  const activeBrandLabel = useMemo(() => {
    if (!activeBrand) return null;
    return list.brandFacets.find((facet) => facet.slug === activeBrand)?.name ?? activeBrand;
  }, [activeBrand, list.brandFacets]);

  const hasPriceFilter = priceMin !== null || priceMax !== null;

  const hasActiveFilters =
    activeBrand !== null ||
    inStockOnly ||
    activeTabSlug !== null ||
    hasPriceFilter ||
    activeSort !== ProductListSort.NEWEST ||
    urlSearch !== '';

  const activeFilterCount =
    (activeTabSlug !== null ? 1 : 0) +
    (hasPriceFilter ? 1 : 0) +
    (activeBrand !== null ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (urlSearch !== '' ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    // `?view=list` là tuỳ chọn hiển thị, không phải bộ lọc: xoá bộ lọc không được đổi chế độ xem của khách.
    const keepView = searchParams.get('view') === 'list' ? '?view=list' : '';
    router.replace(`${pathname}${keepView}`, { scroll: false });
  };

  // Trả theo nhóm props của từng component để view chỉ spread, không liệt kê lại từng trường.
  return {
    isTabsPending,
    activeFilterCount,
    list,
    /** Sidebar desktop và drawer mobile dùng chung một bộ props lọc. */
    filterProps: {
      tabs,
      activeTabSlug,
      onSelectCategory: setActiveTabSlug,
      priceMin,
      priceMax,
      onChangePriceRange: setPriceRange,
      brands: list.brandFacets,
      activeBrand,
      onSelectBrand: setActiveBrand,
      inStockOnly,
      onToggleInStock: setInStockOnly,
      hasActiveFilters,
      onResetFilters: handleResetFilters,
    } satisfies CatalogSidebarFiltersProps,
    queryProps: {
      searchQuery,
      onSearchQueryChange: setSearchQuery,
      activeSort,
      onSortChange: setActiveSort,
    } satisfies CatalogQueryState,
    chipsProps: {
      categoryLabel: activeCategoryLabel,
      onClearCategory: () => setActiveTabSlug(null),
      priceLabel: activePriceLabel,
      onClearPrice: () => setPriceRange(null, null),
      brandLabel: activeBrandLabel,
      onClearBrand: () => setActiveBrand(null),
      inStockOnly,
      onClearInStock: () => setInStockOnly(false),
      searchQuery: urlSearch || null,
      onClearSearch: () => setSearchQuery(''),
      onClearAll: handleResetFilters,
    } satisfies CatalogActiveChipsProps,
  };
}
