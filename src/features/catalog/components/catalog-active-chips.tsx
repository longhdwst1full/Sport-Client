'use client';

import { RotateCcw } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Chip } from '@/foundation/components/tabs-chips';

const CHIP_TONE = {
  brand: { chip: 'bg-brand-50 text-brand-800 ring-1 ring-brand-600/20', remove: 'hover:bg-brand-200/60' },
  neutral: { chip: 'bg-slate-100 text-slate-800 ring-1 ring-slate-300/60', remove: 'hover:bg-slate-200' },
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

  const chips: ActiveChip[] = [
    ...(categoryLabel ? [{ key: 'category', tone: 'brand', label: `Danh mục: ${categoryLabel}`, onRemove: onClearCategory, removeAriaLabel: 'Bỏ lọc danh mục' } as const] : []),
    ...(priceLabel ? [{ key: 'price', tone: 'brand', label: `Giá: ${priceLabel}`, onRemove: onClearPrice, removeAriaLabel: 'Bỏ lọc giá' } as const] : []),
    ...(searchQuery ? [{ key: 'search', tone: 'neutral', label: `Từ khóa: "${searchQuery}"`, onRemove: onClearSearch, removeAriaLabel: 'Bỏ từ khóa tìm kiếm' } as const] : []),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
      <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        Đang lọc:
      </span>

      {chips.map((chip) => (
        <Chip
          key={chip.key}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${CHIP_TONE[chip.tone].chip}`}
          onRemove={chip.onRemove}
          removeAriaLabel={chip.removeAriaLabel}
          removeClassName={`rounded-full p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1 ${CHIP_TONE[chip.tone].remove}`}
        >
          <span>{chip.label}</span>
        </Chip>
      ))}

      {onClearAll && (
        <Button
          variant="ghost"
          onClick={onClearAll}
          className="ml-1 h-auto gap-1 rounded px-0 text-xs font-bold text-rose-700 hover:bg-transparent hover:text-rose-800 hover:underline sm:text-xs"
        >
          <RotateCcw aria-hidden className="size-3" />
          <span>Xóa tất cả</span>
        </Button>
      )}
    </div>
  );
}
