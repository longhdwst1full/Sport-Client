import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { ProductListSort } from '@/generated/api/catalog/catalog.schemas';
import { SORT_OPTIONS } from '../../model/catalog-filter.constants';

interface CatalogMobileControlBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  activeSort: ProductListSort;
  onSortChange: (sort: ProductListSort) => void;
}

export function CatalogMobileControlBar({
  searchQuery,
  onSearchQueryChange,
  onOpenFilters,
  activeFilterCount,
  activeSort,
  onSortChange,
}: CatalogMobileControlBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 lg:hidden">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          aria-label="Tìm sản phẩm"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Tìm theo tên thiết bị, máy tập..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-10 text-xs font-semibold text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-emerald-500 focus:outline-hidden"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange('')}
            className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
            aria-label="Xóa từ khóa"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:border-emerald-500"
        >
          <SlidersHorizontal className="size-3.5 text-emerald-600" />
          <span>Bộ lọc</span>
          {activeFilterCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-emerald-600 text-[10px] font-black text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400">Sắp xếp:</span>
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value as ProductListSort)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs focus:border-emerald-500 focus:outline-hidden"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
