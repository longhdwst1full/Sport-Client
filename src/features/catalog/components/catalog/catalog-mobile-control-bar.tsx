import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import type { ProductListSort } from '@/generated/api/catalog/catalog.schemas';
import { CatalogSearchField, CatalogSortSelect } from './catalog-query-controls';

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
      <CatalogSearchField
        value={searchQuery}
        onChange={onSearchQueryChange}
        iconClassName="left-4"
        inputClassName="rounded-2xl pl-11 pr-10 shadow-xs"
        clearClassName="right-1"
      />

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={onOpenFilters}
          className="h-10 border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:border-brand-500 hover:text-slate-700"
          aria-label={activeFilterCount > 0 ? `Bộ lọc, đang áp dụng ${activeFilterCount}` : 'Bộ lọc'}
        >
          <SlidersHorizontal aria-hidden className="size-3.5 text-brand-600" />
          <span>Bộ lọc</span>
          {activeFilterCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[10px] font-black text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>

        <div className="flex items-center gap-2">
          <CatalogSortSelect
            id="catalog-sort-mobile"
            value={activeSort}
            onChange={onSortChange}
            labelClassName="text-[11px] font-bold text-slate-600"
            className="h-10 shadow-xs"
          />
        </div>
      </div>
    </div>
  );
}
