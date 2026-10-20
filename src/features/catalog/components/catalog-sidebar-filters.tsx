'use client';

import { useState, useMemo } from 'react';
import { RotateCcw, Tag, Boxes, Award, PackageCheck, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Skeleton } from '@/foundation/components/feedback';
import { ToggleChip } from '@/foundation/components/tabs-chips';
import type { CatalogBrandFacetDto } from '@/generated/api/catalog/catalog.schemas';
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
  /** Thương hiệu kèm số sản phẩm theo bộ lọc hiện tại (facet của API); rỗng thì ẩn nhóm. */
  brands: CatalogBrandFacetDto[];
  activeBrand: string | null;
  onSelectBrand: (slug: string | null) => void;
  inStockOnly: boolean;
  onToggleInStock: (value: boolean) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  isTabsPending?: boolean;
}

export function CatalogSidebarFilters({ hasActiveFilters, onResetFilters, ...groups }: CatalogSidebarFiltersProps) {
  return (
    <aside className="space-y-6">
      {/* Header filter title & Reset */}
      <div className="flex items-center justify-between border-b border-neutral-200/90 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Bộ lọc tìm kiếm
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onResetFilters}
            className="h-auto gap-1 rounded px-0 text-2xs font-bold text-neutral-700 underline-offset-2 hover:bg-transparent hover:text-neutral-950 hover:underline sm:text-2xs"
          >
            <RotateCcw aria-hidden className="size-3" />
            <span>Đặt lại</span>
          </Button>
        )}
      </div>

      <CatalogFilterGroups variant="sidebar" {...groups} />
    </aside>
  );
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1';
const SIDEBAR_HEADING =
  'mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-800';
const SHEET_HEADING = 'text-xs font-bold uppercase text-neutral-700 mb-2';

/**
 * Nhóm "Danh mục" + "Khoảng giá" dùng chung cho sidebar desktop và drawer mobile; `variant` chỉ đổi
 * cách trình bày (sidebar: danh sách + radio, sheet: pill + lưới nút), logic chọn giống hệt nhau.
 */
export function CatalogFilterGroups({
  variant,
  tabs,
  activeTabSlug,
  onSelectCategory,
  priceRanges,
  activePriceRange,
  onSelectPriceRange,
  brands,
  activeBrand,
  onSelectBrand,
  inStockOnly,
  onToggleInStock,
  isTabsPending = false,
}: Omit<CatalogSidebarFiltersProps, 'hasActiveFilters' | 'onResetFilters'> & { variant: 'sidebar' | 'sheet' }) {
  const isSidebar = variant === 'sidebar';

  const [brandSearch, setBrandSearch] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);

  const INITIAL_BRAND_COUNT = 8;
  const normalizedSearch = brandSearch.trim().toLowerCase();

  const filteredBrands = useMemo(() => {
    if (!normalizedSearch) return brands;
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(normalizedSearch) ||
        b.slug.toLowerCase().includes(normalizedSearch),
    );
  }, [brands, normalizedSearch]);

  const displayedBrands = useMemo(() => {
    if (normalizedSearch || showAllBrands) {
      return filteredBrands;
    }
    const initialSlice = filteredBrands.slice(0, INITIAL_BRAND_COUNT);
    if (activeBrand && !initialSlice.some((b) => b.slug === activeBrand)) {
      const activeItem = filteredBrands.find((b) => b.slug === activeBrand);
      if (activeItem) {
        return [...initialSlice, activeItem];
      }
    }
    return initialSlice;
  }, [filteredBrands, normalizedSearch, showAllBrands, activeBrand]);

  // `tabs[0]` là "Tất cả" (slug null) từ `useCategoryTabs`.
  const categoryButtons = tabs.map((tab) => {
    const isSelected = activeTabSlug === tab.slug;
    return (
      <button
        key={tab.slug ?? 'all'}
        type="button"
        onClick={() => onSelectCategory(tab.slug)}
        aria-pressed={isSelected}
        className={
          isSidebar
            ? `flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-left text-xs font-bold transition ${FOCUS_RING} ${
                isSelected
                  ? 'bg-selected text-on-selected font-bold border-l-4 border-l-action'
                  : 'text-neutral-700 hover:bg-control-hover hover:text-on-control'
              }`
            : `rounded-full px-4 py-2 text-xs font-semibold transition ${FOCUS_RING} ${
                isSelected ? 'border border-selected-border bg-selected text-on-selected' : 'border border-control-border bg-control text-on-control hover:border-control-border-strong hover:bg-control-hover'
              }`
        }
      >
        {isSidebar ? (
          <>
            <span className="truncate">{tab.slug ? tab.label : 'Tất cả danh mục'}</span>
            {typeof tab.productCount === 'number' && tab.productCount > 0 && (
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-3xs font-semibold ${
                  isSelected ? 'bg-neutral-900 text-white shadow-2xs' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {tab.productCount}
              </span>
            )}
          </>
        ) : (
          tab.label
        )}
      </button>
    );
  });

  const priceOptions = priceRanges.map((range) => {
    const isSelected = activePriceRange === range.id;
    return isSidebar ? (
      <label
        key={range.id}
        className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
          isSelected
            ? 'bg-selected text-on-selected font-bold ring-1 ring-selected-border'
            : 'text-neutral-700 hover:bg-control-hover hover:text-on-control'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <input
            type="radio"
            name="priceRange"
            value={range.id}
            checked={isSelected}
            onChange={() => onSelectPriceRange(range.id)}
            className={`size-4 cursor-pointer border-neutral-300 accent-[var(--color-action)] ${FOCUS_RING}`}
          />
          <span>{range.label}</span>
        </div>
      </label>
    ) : (
      <ToggleChip
        key={range.id}
        selected={isSelected}
        onClick={() => onSelectPriceRange(range.id)}
        className="h-auto justify-center rounded-xl p-2.5 text-center"
      >
        {range.label}
      </ToggleChip>
    );
  });

  return (
    <>
      {/* Category Facet */}
      <div>
        {isSidebar ? (
          <h3 className={SIDEBAR_HEADING}>
            <Boxes aria-hidden className="size-3.5 text-neutral-900" />
            <span>Danh mục sản phẩm</span>
          </h3>
        ) : (
          <h4 className={SHEET_HEADING}>Danh mục</h4>
        )}
        {isTabsPending ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-8 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className={isSidebar ? 'space-y-1' : 'flex flex-wrap gap-2'}>{categoryButtons}</div>
        )}
      </div>

      {/* Price Range Facet */}
      <div className={isSidebar ? 'border-t border-neutral-100 pt-5' : undefined}>
        {isSidebar ? (
          <h3 className={SIDEBAR_HEADING}>
            <Tag aria-hidden className="size-3.5 text-neutral-900" />
            <span>Khoảng giá</span>
          </h3>
        ) : (
          <h4 className={SHEET_HEADING}>Khoảng giá</h4>
        )}
        {isSidebar ? (
          <div className="space-y-1.5" role="radiogroup" aria-label="Khoảng giá">
            {priceOptions}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">{priceOptions}</div>
        )}
      </div>

      {/* Brand Facet — số sản phẩm do API đếm theo bộ lọc hiện tại */}
      {brands.length > 0 && (
        <div className={isSidebar ? 'border-t border-neutral-100 pt-5' : undefined}>
          <div className="flex items-center justify-between mb-2">
            {isSidebar ? (
              <h3 className={`${SIDEBAR_HEADING} mb-0`}>
                <Award aria-hidden className="size-3.5 text-neutral-900" />
                <span>Thương hiệu</span>
              </h3>
            ) : (
              <h4 className={`${SHEET_HEADING} mb-0`}>Thương hiệu</h4>
            )}
            {brands.length > INITIAL_BRAND_COUNT && (
              <span className="text-3xs font-semibold text-neutral-600">
                {brands.length} thương hiệu
              </span>
            )}
          </div>

          {/* Ô tìm kiếm nhanh thương hiệu */}
          {brands.length > 5 && (
            <div className="relative mb-2.5">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-neutral-600"
              />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Tìm thương hiệu..."
                aria-label="Tìm thương hiệu"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-1.5 pl-8 pr-7 text-xs text-neutral-900 placeholder:text-neutral-600 transition focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
              {brandSearch && (
                <button
                  type="button"
                  onClick={() => setBrandSearch('')}
                  aria-label="Xóa từ khóa tìm thương hiệu"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-600 hover:text-neutral-700 focus-visible:outline-neutral-900"
                >
                  <X className="size-3" aria-hidden />
                </button>
              )}
            </div>
          )}

          {displayedBrands.length === 0 ? (
            <p className="py-2 text-center text-xs text-neutral-600">
              Không tìm thấy thương hiệu phù hợp
            </p>
          ) : (
            <div
              className={isSidebar ? 'space-y-1' : 'flex flex-wrap gap-2'}
              role="group"
              aria-label="Thương hiệu"
            >
              {displayedBrands.map((brand) => {
                const isSelected = activeBrand === brand.slug;
                return (
                  <button
                    key={brand.slug}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onSelectBrand(isSelected ? null : brand.slug)}
                    className={
                      isSidebar
                        ? `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition ${FOCUS_RING} ${
                            isSelected
                              ? 'bg-selected font-bold text-on-selected ring-1 ring-selected-border'
                              : 'text-neutral-700 hover:bg-control-hover hover:text-on-control'
                          }`
                        : `rounded-full px-3.5 py-2 text-xs font-semibold transition ${FOCUS_RING} ${
                            isSelected
                              ? 'border border-selected-border bg-selected text-on-selected'
                              : 'border border-control-border bg-control text-on-control hover:border-control-border-strong hover:bg-control-hover'
                          }`
                    }
                  >
                    <span className="truncate">{brand.name}</span>
                    {isSidebar && (
                      <span className={`ml-2 text-3xs font-semibold ${isSelected ? 'text-neutral-900' : 'text-neutral-600'}`}>
                        {brand.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Nút Xem thêm / Thu gọn khi danh sách nhiều hơn INITIAL_BRAND_COUNT và không đang gõ search */}
          {filteredBrands.length > INITIAL_BRAND_COUNT && !normalizedSearch && (
            <div className={isSidebar ? 'pt-1.5' : 'pt-2'}>
              <Button
                variant={isSidebar ? 'ghost' : 'secondary'}
                size="sm"
                fullWidth={isSidebar}
                aria-expanded={showAllBrands}
                onClick={() => setShowAllBrands((prev) => !prev)}
                rightIcon={showAllBrands ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
                className={isSidebar ? 'h-8 gap-1 rounded-lg text-xs' : 'h-8 gap-1 rounded-full px-3.5 text-xs'}
              >
                <span>
                  {showAllBrands
                    ? 'Thu gọn'
                    : `Xem thêm (${filteredBrands.length - INITIAL_BRAND_COUNT})`}
                </span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Availability */}
      <div className={isSidebar ? 'border-t border-neutral-100 pt-5' : undefined}>
        <label className={`flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-neutral-800 ${isSidebar ? 'px-3' : ''}`}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => onToggleInStock(event.target.checked)}
            className={`size-4 cursor-pointer rounded border-neutral-300 accent-neutral-900 ${FOCUS_RING}`}
          />
          <PackageCheck aria-hidden className="size-3.5 text-neutral-900" />
          Chỉ hiện sản phẩm còn hàng
        </label>
      </div>
    </>
  );
}
