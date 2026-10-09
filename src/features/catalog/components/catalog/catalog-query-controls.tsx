import { Search, SlidersHorizontal, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/foundation/components/buttons';
import { Field, Select, TextInput } from '@/foundation/components/field-system';
import type { ProductListSort } from '@/generated/api/catalog/catalog.schemas';
import { SORT_OPTIONS } from '../../model/catalog-filter.constants';

/** Trạng thái tìm/sắp xếp `useCatalogFilters` trả về, dùng chung cho thanh desktop và mobile. */
export interface CatalogQueryState {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  activeSort: ProductListSort;
  onSortChange: (sort: ProductListSort) => void;
}

/**
 * Ô tìm + nút xoá từ khoá và ô sắp xếp dùng chung cho thanh desktop (`CatalogSearchSortBar`) và thanh
 * mobile (`CatalogMobileControlBar`); mỗi nơi chỉ truyền khác biệt về kích thước.
 */
export function CatalogSearchField({
  value,
  onChange,
  className,
  inputClassName,
  iconClassName,
  clearClassName,
  testId,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  clearClassName?: string;
  testId?: string;
}) {
  return (
    <div className={twMerge('relative', className)}>
      <Search aria-hidden className={twMerge('absolute top-1/2 size-4 -translate-y-1/2 text-slate-400', iconClassName)} />
      <TextInput
        size="md"
        type="text"
        data-testid={testId}
        aria-label="Tìm sản phẩm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm theo tên thiết bị, máy tập..."
        className={twMerge('border-slate-200 font-semibold sm:text-xs', inputClassName)}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange('')}
          className={twMerge('absolute top-1/2 -translate-y-1/2 rounded-full text-slate-500', clearClassName)}
          aria-label="Xóa từ khóa"
        >
          <X aria-hidden className="size-3" />
        </Button>
      )}
    </div>
  );
}

export function CatalogSortSelect({
  id,
  value,
  onChange,
  labelClassName,
  className,
  testId,
}: {
  id: string;
  value: ProductListSort;
  onChange: (sort: ProductListSort) => void;
  labelClassName: string;
  className?: string;
  testId?: string;
}) {
  return (
    <Field label="Sắp xếp:" labelClassName={labelClassName}>
      <Select
        size="md"
        id={id}
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value as ProductListSort)}
        className={twMerge('h-9 border-slate-200 pl-3 text-xs font-bold text-slate-700 sm:text-xs', className)}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Field>
  );
}

export function CatalogSearchSortBar({
  displayedCount,
  total,
  activeSort,
  onSortChange,
}: Omit<CatalogQueryState, 'searchQuery' | 'onSearchQueryChange'> & { displayedCount: number; total: number }) {
  return (
    <div className="hidden lg:flex items-center justify-between gap-4 mb-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
      <span className="text-xs font-medium text-slate-600" aria-live="polite">
        Hiển thị <strong className="text-slate-900 font-bold">{displayedCount}</strong> / {total} sản phẩm
      </span>

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
  );
}

export function CatalogMobileControlBar({
  onOpenFilters,
  activeFilterCount,
  activeSort,
  onSortChange,
}: Omit<CatalogQueryState, 'searchQuery' | 'onSearchQueryChange'> & { onOpenFilters: () => void; activeFilterCount: number }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-2 lg:hidden">
      <Button
        variant="outline"
        onClick={onOpenFilters}
        className="h-10 border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:border-slate-900 hover:text-slate-700"
        aria-label={activeFilterCount > 0 ? `Bộ lọc, đang áp dụng ${activeFilterCount}` : 'Bộ lọc'}
      >
        <SlidersHorizontal aria-hidden className="size-3.5 text-slate-900" />
        <span>Bộ lọc</span>
        {activeFilterCount > 0 && (
          <span className="grid size-5 place-items-center rounded-full bg-slate-900 text-[10px] font-black text-white">
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
  );
}
