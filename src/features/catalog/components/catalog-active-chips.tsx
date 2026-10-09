'use client';

import { RotateCcw } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Chip } from '@/foundation/components/tabs-chips';

const CHIP_TONE = {
  brand: { chip: 'bg-neutral-50 text-neutral-950 ring-1 ring-neutral-900/20', remove: 'hover:bg-neutral-200/60' },
  neutral: { chip: 'bg-neutral-100 text-neutral-800 ring-1 ring-neutral-300/60', remove: 'hover:bg-neutral-200' },
} as const;

type ActiveChip = {
  key: string;
  tone: keyof typeof CHIP_TONE;
  label: string;
  onRemove?: () => void;
  removeAriaLabel: string;
};

export interface CatalogActiveChipsProps {
  categoryLabel?: string | null;
  onClearCategory?: () => void;
  priceLabel?: string | null;
  onClearPrice?: () => void;
  brandLabel?: string | null;
  onClearBrand?: () => void;
  inStockOnly?: boolean;
  onClearInStock?: () => void;
  searchQuery?: string | null;
  onClearSearch?: () => void;
  onClearAll?: () => void;
}

export function CatalogActiveChips({
  categoryLabel,
  onClearCategory,
  priceLabel,
  onClearPrice,
  brandLabel,
  onClearBrand,
  inStockOnly = false,
  onClearInStock,
  searchQuery,
  onClearSearch,
  onClearAll,
}: CatalogActiveChipsProps) {
  const hasAnyFilter = Boolean(
    categoryLabel || priceLabel || brandLabel || inStockOnly || searchQuery,
  );

  if (!hasAnyFilter) return null;

  const chips: ActiveChip[] = [
    ...(categoryLabel ? [{ key: 'category', tone: 'brand', label: `Danh mục: ${categoryLabel}`, onRemove: onClearCategory, removeAriaLabel: 'Bỏ lọc danh mục' } as const] : []),
    ...(priceLabel ? [{ key: 'price', tone: 'brand', label: `Giá: ${priceLabel}`, onRemove: onClearPrice, removeAriaLabel: 'Bỏ lọc giá' } as const] : []),
    ...(brandLabel ? [{ key: 'brand', tone: 'brand', label: `Thương hiệu: ${brandLabel}`, onRemove: onClearBrand, removeAriaLabel: 'Bỏ lọc thương hiệu' } as const] : []),
    ...(inStockOnly ? [{ key: 'stock', tone: 'brand', label: 'Còn hàng', onRemove: onClearInStock, removeAriaLabel: 'Bỏ lọc còn hàng' } as const] : []),
    ...(searchQuery ? [{ key: 'search', tone: 'neutral', label: `Từ khóa: "${searchQuery}"`, onRemove: onClearSearch, removeAriaLabel: 'Bỏ từ khóa tìm kiếm' } as const] : []),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
      <span className="mr-1 text-2xs font-bold uppercase tracking-wider text-neutral-500">
        Đang lọc:
      </span>

      {chips.map((chip) => (
        <Chip
          key={chip.key}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${CHIP_TONE[chip.tone].chip}`}
          onRemove={chip.onRemove}
          removeAriaLabel={chip.removeAriaLabel}
          removeClassName={`rounded-full p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1 ${CHIP_TONE[chip.tone].remove}`}
        >
          <span>{chip.label}</span>
        </Chip>
      ))}

      {onClearAll && (
        <Button
          variant="ghost"
          onClick={onClearAll}
          className="ml-1 h-auto gap-1 rounded px-0 text-xs font-bold text-neutral-700 underline-offset-2 hover:bg-transparent hover:text-neutral-950 hover:underline hover:underline sm:text-xs"
        >
          <RotateCcw aria-hidden className="size-3" />
          <span>Xóa tất cả</span>
        </Button>
      )}
    </div>
  );
}
