'use client';

import React from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import type { CategoryTabView } from '../hooks/use-category-tabs';
import type { PriceRangeOption } from './catalog-sidebar-filters';

export interface CatalogMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: CategoryTabView[];
  activeTabSlug: string | null;
  onSelectCategory: (slug: string | null) => void;
  priceRanges: PriceRangeOption[];
  activePriceRange: string;
  onSelectPriceRange: (id: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
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
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200">
      <div className="flex max-h-[85vh] w-full flex-col rounded-t-[32px] bg-white p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="flex items-center gap-2 text-sm font-black uppercase text-slate-900">
            <SlidersHorizontal className="size-4 text-emerald-600" />
            Bộ lọc tìm kiếm
          </span>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
            aria-label="Đóng bộ lọc"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Category */}
          <div>
            <h4 className="text-xs font-black uppercase text-slate-700 mb-2">Danh mục</h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSelectCategory(null)}
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
                    onClick={() => onSelectCategory(tab.slug)}
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
                    className={`rounded-xl border p-2.5 text-xs font-bold text-center transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
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
            <button
              type="button"
              onClick={onResetFilters}
              className="flex-1 rounded-2xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="size-3.5" />
              <span>Đặt lại</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-2 rounded-2xl bg-emerald-600 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-emerald-700 transition"
          >
            Xem {totalProductsCount} sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
