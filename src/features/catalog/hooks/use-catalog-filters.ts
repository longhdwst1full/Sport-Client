'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useProductShowcase } from './use-product-showcase';
import { useCategoryTabs } from './use-category-tabs';
import { useDebounce } from '@/shared/hooks';
import { CATALOG_PAGE_SIZE } from '../model/product.mapper';
import { ProductListSort } from '@/generated/api/catalog/catalog.schemas';
import { PRICE_RANGES, isSort } from '../model/catalog-filter.constants';

/**
 * Owns the catalog listing's URL-synced filter state (category/price/sort/search)
 * plus the resulting product query, so the view component only renders.
 */
export function useCatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  // Remaining count for load more button
  const remainingCount = Math.max(total - products.length, 0);

  return {
    tabs,
    isTabsPending,
    activeTabSlug,
    setActiveTabSlug,
    activePriceRange,
    setActivePriceRange,
    activeSort,
    setActiveSort,
    urlSearch,
    searchQuery,
    setSearchQuery,
    displayedProducts,
    total,
    hasMore,
    loadMore,
    isPending,
    isLoadingMore,
    isLoadMoreError,
    isError,
    refetch,
    activeCategoryLabel,
    activePriceLabel,
    hasActiveFilters,
    activeFilterCount,
    handleResetFilters,
    remainingCount,
  };
}
