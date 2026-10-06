'use client';

import { useState } from 'react';
import { useCardBuyNow } from '../hooks/use-card-buy-now';
import { useCatalogFilters, type CatalogInitialPage } from '../hooks/use-catalog-filters';
import { PRICE_RANGES } from '../model/catalog-filter.constants';
import { CatalogSidebarFilters } from './catalog-sidebar-filters';
import { CatalogActiveChips } from './catalog-active-chips';
import { CatalogMobileFilterDrawer } from './catalog-mobile-filter-drawer';
import { CatalogMobileControlBar } from './catalog/catalog-mobile-control-bar';
import { CatalogSearchSortBar } from './catalog/catalog-search-sort-bar';
import { CatalogProductGrid } from './catalog/catalog-product-grid';

export function ProductsCatalogView({ initial }: { initial?: CatalogInitialPage } = {}) {
  const handleBuyNow = useCardBuyNow();

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const {
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
    isShowingPreviousResults,
    refetch,
    activeCategoryLabel,
    activePriceLabel,
    hasActiveFilters,
    activeFilterCount,
    handleResetFilters,
  } = useCatalogFilters(initial);

  // Sidebar desktop và drawer mobile dùng chung một bộ props lọc.
  const filterProps = {
    tabs,
    activeTabSlug,
    onSelectCategory: setActiveTabSlug,
    priceRanges: PRICE_RANGES,
    activePriceRange,
    onSelectPriceRange: setActivePriceRange,
    hasActiveFilters,
    onResetFilters: handleResetFilters,
  };

  return (
    <section className="relative">
      {/* Mobile Sticky Control Bar */}
      <CatalogMobileControlBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onOpenFilters={() => setIsMobileFilterOpen(true)}
        activeFilterCount={activeFilterCount}
        activeSort={activeSort}
        onSortChange={setActiveSort}
      />

      {/* Main Two-Column Layout (Faceted Sidebar + Product Grid) */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        {/* DESKTOP FACETED SIDEBAR */}
        <div className="hidden lg:block w-64 shrink-0 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <CatalogSidebarFilters {...filterProps} isTabsPending={isTabsPending} />
        </div>

        {/* RIGHT COLUMN: SEARCH, ACTIVE CHIPS, PRODUCT GRID */}
        <div className="flex-1 min-w-0">
          {/* Desktop Search & Sort Bar */}
          <CatalogSearchSortBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            displayedCount={displayedProducts.length}
            total={total}
            activeSort={activeSort}
            onSortChange={setActiveSort}
          />

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

          <CatalogProductGrid
            isPending={isPending}
            isError={isError}
            isShowingPreviousResults={isShowingPreviousResults}
            refetch={() => void refetch()}
            displayedProducts={displayedProducts}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
            onBuyNow={handleBuyNow}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            isLoadMoreError={isLoadMoreError}
            onLoadMore={loadMore}
          />
        </div>
      </div>

      {/* MOBILE DRAWER BOTTOM-SHEET FILTER */}
      <CatalogMobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        {...filterProps}
        totalProductsCount={displayedProducts.length}
      />
    </section>
  );
}
