'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Chip } from '@/foundation/components/tabs-chips';

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
        <Chip
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-600/20"
          onRemove={onClearCategory}
          removeAriaLabel="Bỏ lọc danh mục"
          removeClassName="rounded-full p-0.5 hover:bg-emerald-200/60"
        >
          <span>Danh mục: {categoryLabel}</span>
        </Chip>
      )}

      {priceLabel && (
        <Chip
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-600/20"
          onRemove={onClearPrice}
          removeAriaLabel="Bỏ lọc giá"
          removeClassName="rounded-full p-0.5 hover:bg-emerald-200/60"
        >
          <span>Giá: {priceLabel}</span>
        </Chip>
      )}

      {searchQuery && (
        <Chip
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 ring-1 ring-slate-300/60"
          onRemove={onClearSearch}
          removeAriaLabel="Bỏ từ khóa tìm kiếm"
          removeClassName="rounded-full p-0.5 hover:bg-slate-200"
        >
          <span>Từ khóa: "{searchQuery}"</span>
        </Chip>
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
