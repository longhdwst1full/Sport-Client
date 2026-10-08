'use client';

import { useState } from 'react';
import { useCatalogFilters, type CatalogInitialPage } from '../hooks/use-catalog-filters';
import { CatalogSidebarFilters } from './catalog-sidebar-filters';
import { CatalogActiveChips } from './catalog-active-chips';
import { CatalogMobileFilterDrawer } from './catalog-mobile-filter-drawer';
import { CatalogMobileControlBar, CatalogSearchSortBar } from './catalog/catalog-query-controls';
import { CatalogProductGrid } from './catalog/catalog-product-grid';

export function ProductsCatalogView({ initial }: { initial?: CatalogInitialPage } = {}) {
  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { isTabsPending, activeFilterCount, list, filterProps, queryProps, chipsProps } =
    useCatalogFilters(initial);

  return (
    <section className="relative">
      {/* Mobile Sticky Control Bar */}
      <CatalogMobileControlBar
        {...queryProps}
        onOpenFilters={() => setIsMobileFilterOpen(true)}
        activeFilterCount={activeFilterCount}
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
          <CatalogSearchSortBar {...queryProps} displayedCount={list.products.length} total={list.total} />

          {/* ACTIVE FILTER CHIPS */}
          <div className="mb-4">
            <CatalogActiveChips {...chipsProps} />
          </div>

          <CatalogProductGrid
            {...list}
            hasActiveFilters={filterProps.hasActiveFilters}
            onResetFilters={filterProps.onResetFilters}
          />
        </div>
      </div>

      {/* MOBILE DRAWER BOTTOM-SHEET FILTER */}
      <CatalogMobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        {...filterProps}
        totalProductsCount={list.products.length}
      />
    </section>
  );
}
