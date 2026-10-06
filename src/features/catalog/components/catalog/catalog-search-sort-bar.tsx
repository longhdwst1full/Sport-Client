import type { ProductListSort } from '@/generated/api/catalog/catalog.schemas';
import { CatalogSearchField, CatalogSortSelect } from './catalog-query-controls';

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
      <CatalogSearchField
        value={searchQuery}
        onChange={onSearchQueryChange}
        testId="catalog-search-input"
        className="max-w-md flex-1"
        iconClassName="left-3.5"
        inputClassName="h-9 bg-slate-50/70 pl-10 pr-9 focus-visible:bg-white"
        clearClassName="right-1.5 size-7 hover:bg-slate-200"
      />

      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-600" aria-live="polite">
          Tìm thấy <strong className="text-slate-900 font-bold">{displayedCount}</strong> / {total} sản phẩm
        </span>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-1.5">
          <CatalogSortSelect
            id="catalog-sort-desktop"
            testId="catalog-sort-select"
            value={activeSort}
            onChange={onSortChange}
            labelClassName="text-xs font-semibold text-slate-600"
            className="shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
}
