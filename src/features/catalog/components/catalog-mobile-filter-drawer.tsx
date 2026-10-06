'use client';

import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Drawer } from '@/foundation/components/overlay';
import { Button } from '@/foundation/components/buttons';
import type { CatalogSidebarFiltersProps } from './catalog-sidebar-filters';

export interface CatalogMobileFilterDrawerProps extends Omit<CatalogSidebarFiltersProps, 'isTabsPending'> {
  isOpen: boolean;
  onClose: () => void;
  totalProductsCount: number;
}

export function CatalogMobileFilterDrawer({
  isOpen,
  onClose,
  tabs,
  activeTabSlug,
  onSelectCategory,
  priceRanges,
  activePriceRange,
  onSelectPriceRange,
  hasActiveFilters,
  onResetFilters,
  totalProductsCount,
}: CatalogMobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <Drawer
      onClose={onClose}
      ariaLabel="Bộ lọc tìm kiếm"
      backdropClassName="fixed inset-0 z-50 flex items-end bg-slate-950/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
      className="flex max-h-[85vh] w-full flex-col rounded-t-[32px] bg-white p-6 shadow-2xl animate-in slide-in-from-bottom duration-200"
    >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="flex items-center gap-2 text-sm font-black uppercase text-slate-900">
            <SlidersHorizontal aria-hidden className="size-4 text-brand-600" />
            Bộ lọc tìm kiếm
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-9 rounded-full text-slate-500"
            aria-label="Đóng bộ lọc"
          >
            <X aria-hidden className="size-5" />
          </Button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Category */}
          <div>
            <h4 className="text-xs font-black uppercase text-slate-700 mb-2">Danh mục</h4>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const isSelected = activeTabSlug === tab.slug;
                return (
                  <button
                    key={tab.slug ?? 'all'}
                    type="button"
                    onClick={() => onSelectCategory(tab.slug)}
                    aria-pressed={isSelected}
                    className={`rounded-full px-3.5 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1 ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'border border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-xs font-black uppercase text-slate-700 mb-2">Khoảng giá</h4>
            <div className="grid grid-cols-2 gap-2">
              {priceRanges.map((range) => {
                const isSelected = activePriceRange === range.id;
                return (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => onSelectPriceRange(range.id)}
                    aria-pressed={isSelected}
                    className={`rounded-xl border p-2.5 text-center text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="lg"
              onClick={onResetFilters}
              className="flex-1 gap-1.5 rounded-2xl border-slate-200 px-0 text-xs font-bold text-slate-700 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700"
            >
              <RotateCcw aria-hidden className="size-3.5" />
              <span>Đặt lại</span>
            </Button>
          )}
          <Button
            size="lg"
            onClick={onClose}
            className="flex-[2] rounded-2xl px-0 text-xs font-black uppercase tracking-wider shadow-md"
          >
            Xem {totalProductsCount} sản phẩm
          </Button>
        </div>
    </Drawer>
  );
}
