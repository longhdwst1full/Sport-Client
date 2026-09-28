'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartActions } from '@/features/cart';
import { useCatalogFilters } from '../hooks/use-catalog-filters';
import type { ProductShowcaseItem } from '../model/product.mapper';
import { PRICE_RANGES } from '../model/catalog-filter.constants';
import { CatalogSidebarFilters } from './catalog-sidebar-filters';
import { CatalogActiveChips } from './catalog-active-chips';
import { CatalogMobileFilterDrawer } from './catalog-mobile-filter-drawer';
import { CatalogMobileControlBar } from './catalog/catalog-mobile-control-bar';
import { CatalogSearchSortBar } from './catalog/catalog-search-sort-bar';
import { CatalogProductGrid } from './catalog/catalog-product-grid';

export function ProductsCatalogView() {
  const router = useRouter();
  const { addItem } = useCartActions();

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
    refetch,
    activeCategoryLabel,
    activePriceLabel,
    hasActiveFilters,
    activeFilterCount,
    handleResetFilters,
  } = useCatalogFilters();

  const handleBuyNow = (product: ProductShowcaseItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.isSellable || !product.defaultVariantId || !product.defaultVariantSku) {
      router.push(`/products/${product.slug}`);
      return;
    }

    addItem({
        productId: product.id,
        variantId: product.defaultVariantId,
        sku: product.defaultVariantSku,
        productType: product.productType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
        price: product.numericPrice,
        quantity: 1,
      });

    router.push(`/checkout?buyNow=${product.defaultVariantId}`);
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
