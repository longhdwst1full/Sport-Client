import { Search, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/foundation/components/buttons';
import { Field, Select, TextInput } from '@/foundation/components/field-system';
import type { ProductListSort } from '@/generated/api/catalog/catalog.schemas';
import { SORT_OPTIONS } from '../../model/catalog-filter.constants';

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
