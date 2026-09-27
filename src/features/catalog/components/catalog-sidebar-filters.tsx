'use client';

import React from 'react';
import { RotateCcw, PackageCheck, Tag, Boxes, Check } from 'lucide-react';
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
  brandOptions: string[];
  activeBrand: string;
  onSelectBrand: (brand: string) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
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
  brandOptions,
  activeBrand,
  onSelectBrand,
  inStockOnly,
  onToggleInStock,
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
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 transition"
          >
            <RotateCcw className="size-3" />
            <span>Đặt lại</span>
          </button>
        )}
      </div>

      {/* Category Facet */}
      <div>
        <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
          <Boxes className="size-3.5 text-emerald-600" />
          <span>Danh mục sản phẩm</span>
        </h3>
        {isTabsPending ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-7 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
                activeTabSlug === null
                  ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>Tất cả danh mục</span>
            </button>
            {tabs.map((tab) => {
              if (!tab.slug) return null;
              const isSelected = activeTabSlug === tab.slug;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => onSelectCategory(tab.slug)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition text-left ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  {typeof tab.productCount === 'number' && tab.productCount > 0 && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-500'
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
          <Tag className="size-3.5 text-emerald-600" />
          <span>Khoảng giá</span>
        </h3>
        <div className="space-y-1.5">
          {priceRanges.map((range) => {
            const isSelected = activePriceRange === range.id;
            return (
              <label
                key={range.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-emerald-50/80 text-emerald-900 font-bold ring-1 ring-emerald-600/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.id}
                    checked={isSelected}
                    onChange={() => onSelectPriceRange(range.id)}
                    className="size-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>{range.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Brand Facet */}
      {brandOptions.length > 0 && (
        <div className="border-t border-slate-100 pt-5">
          <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
            <span>Thương hiệu</span>
          </h3>
          <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
            <button
              type="button"
              onClick={() => onSelectBrand('all')}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-semibold transition text-left ${
                activeBrand === 'all'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Tất cả thương hiệu</span>
              {activeBrand === 'all' && <Check className="size-3 text-emerald-600" />}
            </button>
            {brandOptions.map((brand) => {
              const isSelected = activeBrand === brand;
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => onSelectBrand(brand)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-semibold transition text-left ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{brand}</span>
                  {isSelected && <Check className="size-3 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* In Stock Only Toggle */}
      <div className="border-t border-slate-100 pt-5">
        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs font-bold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/30 transition">
          <div className="flex items-center gap-2">
            <PackageCheck className="size-4 text-emerald-600" />
            <span>Chỉ hiện sản phẩm còn hàng</span>
          </div>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="size-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
        </label>
      </div>
    </aside>
  );
}
