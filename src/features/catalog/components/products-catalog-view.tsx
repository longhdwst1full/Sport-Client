'use client';

import { useCallback, useState } from 'react';
import { useCatalogViewMode } from '../hooks/use-catalog-view-mode';
import { useCatalogFilters, type CatalogInitialPage } from '../hooks/use-catalog-filters';
import { CatalogSidebarFilters } from './catalog-sidebar-filters';
import { CatalogActiveChips } from './catalog-active-chips';
import dynamic from 'next/dynamic';
import { CatalogMobileControlBar, CatalogSearchSortBar } from './catalog/catalog-query-controls';
import { CatalogProductGrid } from './catalog/catalog-product-grid';

/** Drawer chỉ mở khi khách bấm "Bộ lọc" (mobile): tách chunk, không tính vào JS tải trang. Đóng thì vốn render null. */
const CatalogMobileFilterDrawer = dynamic(
  () => import('./catalog-mobile-filter-drawer').then((m) => m.CatalogMobileFilterDrawer),
  { ssr: false },
);

export function ProductsCatalogView({
  initial,
  initialCategoryName,
}: { initial?: CatalogInitialPage; initialCategoryName?: string } = {}) {
  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const closeMobileFilter = useCallback(() => setIsMobileFilterOpen(false), []);

  const { isTabsPending, activeFilterCount, list, filterProps, queryProps, chipsProps } =
    useCatalogFilters(initial, initialCategoryName);
  // Chế độ xem ở URL `?view=list`, không nằm trong bộ lọc/query key nên đổi chế độ không tải lại danh sách.
  const { viewMode, setViewMode } = useCatalogViewMode();

  return (
    <section className="relative">
      {/* Mobile Sticky Control Bar */}
      <CatalogMobileControlBar
        {...queryProps}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenFilters={() => setIsMobileFilterOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Two-Column Layout (Faceted Sidebar + Product Grid) */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        {/* DESKTOP FACETED SIDEBAR */}
        <div className="hidden lg:block w-64 shrink-0 surface-card p-5 shadow-xs">
          <CatalogSidebarFilters {...filterProps} isTabsPending={isTabsPending} />
        </div>

        {/* RIGHT COLUMN: SEARCH, ACTIVE CHIPS, PRODUCT GRID */}
        <div className="flex-1 min-w-0">
          {/* Desktop Search & Sort Bar */}
          <CatalogSearchSortBar
            {...queryProps}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            displayedCount={list.products.length} total={list.total}
          />

          {/* ACTIVE FILTER CHIPS */}
          <div className="mb-4">
            <CatalogActiveChips {...chipsProps} />
          </div>

          <CatalogProductGrid
            {...list}
            viewMode={viewMode}
            hasActiveFilters={filterProps.hasActiveFilters}
            onResetFilters={filterProps.onResetFilters}
          />
        </div>
      </div>

      {/* MOBILE DRAWER BOTTOM-SHEET FILTER */}
      {isMobileFilterOpen && (
        <CatalogMobileFilterDrawer
          isOpen
          onClose={closeMobileFilter}
          {...filterProps}
          totalProductsCount={list.products.length}
        />
      )}
    </section>
  );
}
