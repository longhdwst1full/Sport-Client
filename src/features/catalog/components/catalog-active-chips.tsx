'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';

export interface CatalogActiveChipsProps {
  categoryLabel?: string | null;
  onClearCategory?: () => void;
  priceLabel?: string | null;
  onClearPrice?: () => void;
  searchQuery?: string | null;
  onClearSearch?: () => void;
  onClearAll?: () => void;
}

export function CatalogActiveChips({
  categoryLabel,
  onClearCategory,
  priceLabel,
  onClearPrice,
  searchQuery,
  onClearSearch,
  onClearAll,
}: CatalogActiveChipsProps) {
  const hasAnyFilter = Boolean(
    categoryLabel || priceLabel || searchQuery,
  );

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
        Đang lọc:
      </span>

      {categoryLabel && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-600/20">
          <span>Danh mục: {categoryLabel}</span>
          {onClearCategory && (
            <button
              type="button"
              onClick={onClearCategory}
              className="rounded-full p-0.5 hover:bg-emerald-200/60"
              aria-label="Bỏ lọc danh mục"
            >
              <X className="size-3" />
            </button>
          )}
        </span>
      )}

      {priceLabel && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-600/20">
          <span>Giá: {priceLabel}</span>
          {onClearPrice && (
            <button
              type="button"
              onClick={onClearPrice}
              className="rounded-full p-0.5 hover:bg-emerald-200/60"
              aria-label="Bỏ lọc giá"
            >
              <X className="size-3" />
            </button>
          )}
        </span>
      )}

      {searchQuery && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 ring-1 ring-slate-300/60">
          <span>Từ khóa: "{searchQuery}"</span>
          {onClearSearch && (
            <button
              type="button"
              onClick={onClearSearch}
              className="rounded-full p-0.5 hover:bg-slate-200"
              aria-label="Bỏ từ khóa tìm kiếm"
            >
              <X className="size-3" />
            </button>
          )}
        </span>
      )}

      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline transition ml-1"
        >
          <RotateCcw className="size-3" />
          <span>Xóa tất cả</span>
        </button>
      )}
    </div>
  );
}
