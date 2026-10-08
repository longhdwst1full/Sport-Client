'use client';

import { RotateCcw, Tag, Boxes } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Skeleton } from '@/foundation/components/feedback';
import type { CategoryTabView } from '../hooks/use-category-tabs';

export interface PriceRangeOption {
  id: string;
  label: string;
  min?: string;
  max?: string;
}

export interface CatalogSidebarFiltersProps {
  tabs: CategoryTabView[];
  activeTabSlug: string | null;
  onSelectCategory: (slug: string | null) => void;
  priceRanges: PriceRangeOption[];
  activePriceRange: string;
  onSelectPriceRange: (id: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  isTabsPending?: boolean;
}

export function CatalogSidebarFilters({
  tabs,
  activeTabSlug,
  onSelectCategory,
  priceRanges,
  activePriceRange,
  onSelectPriceRange,
  hasActiveFilters,
  onResetFilters,
  isTabsPending = false,
}: CatalogSidebarFiltersProps) {
  return (
    <aside className="space-y-6">
      {/* Header filter title & Reset */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-3">
        <span className="text-xs font-black uppercase tracking-wider text-slate-900">
          Bộ lọc tìm kiếm
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onResetFilters}
            className="h-auto gap-1 rounded px-0 text-[11px] font-bold text-rose-700 hover:bg-transparent hover:text-rose-800 sm:text-[11px]"
          >
            <RotateCcw aria-hidden className="size-3" />
            <span>Đặt lại</span>
          </Button>
        )}
      </div>

      {/* Category Facet */}
      <div>
        <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
          <Boxes aria-hidden className="size-3.5 text-slate-900" />
          <span>Danh mục sản phẩm</span>
        </h3>
        {isTabsPending ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-8 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {/* `tabs[0]` là "Tất cả" (slug null) từ `useCategoryTabs`. */}
            {tabs.map((tab) => {
              const isSelected = activeTabSlug === tab.slug;
              return (
                <button
                  key={tab.slug ?? 'all'}
                  type="button"
                  onClick={() => onSelectCategory(tab.slug)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1 ${
                    isSelected
                      ? 'bg-slate-50 text-slate-950 ring-1 ring-slate-900/30'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{tab.slug ? tab.label : 'Tất cả danh mục'}</span>
                  {typeof tab.productCount === 'number' && tab.productCount > 0 && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.productCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range Facet */}
      <div className="border-t border-slate-100 pt-5">
        <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
          <Tag aria-hidden className="size-3.5 text-slate-900" />
          <span>Khoảng giá</span>
        </h3>
        <div className="space-y-1.5" role="radiogroup" aria-label="Khoảng giá">
          {priceRanges.map((range) => {
            const isSelected = activePriceRange === range.id;
            return (
              <label
                key={range.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-slate-50/80 text-slate-950 font-bold ring-1 ring-slate-900/20'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.id}
                    checked={isSelected}
                    onChange={() => onSelectPriceRange(range.id)}
                    className="size-4 cursor-pointer border-slate-300 accent-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1"
                  />
                  <span>{range.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
