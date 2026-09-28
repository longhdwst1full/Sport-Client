import { Search, X } from 'lucide-react';
import type { ProductListSort } from '@/generated/api/catalog/catalog.schemas';
import { SORT_OPTIONS } from '../../model/catalog-filter.constants';

interface CatalogSearchSortBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  displayedCount: number;
  total: number;
  activeSort: ProductListSort;
  onSortChange: (sort: ProductListSort) => void;
}

export function CatalogSearchSortBar({
  searchQuery,
  onSearchQueryChange,
  displayedCount,
  total,
  activeSort,
  onSortChange,
}: CatalogSearchSortBarProps) {
  return (
    <div className="hidden lg:flex items-center justify-between gap-4 mb-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          data-testid="catalog-search-input"
          aria-label="Tìm sản phẩm"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Tìm theo tên thiết bị, máy tập..."
          className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 py-2 pl-10 pr-9 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange('')}
            className="absolute right-2.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-200"
            aria-label="Xóa từ khóa"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 font-medium">
          Tìm thấy <strong className="text-slate-900 font-bold">{displayedCount}</strong> / {total} sản phẩm
        </span>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500">Sắp xếp:</span>
          <select
            data-testid="catalog-sort-select"
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value as ProductListSort)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs focus:border-emerald-500 focus:outline-hidden"
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
