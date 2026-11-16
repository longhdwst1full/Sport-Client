'use client';

import { LayoutGrid, Rows3 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { CatalogViewMode } from '../../hooks/use-catalog-view-mode';

const OPTIONS = [
  { mode: 'grid', label: 'Dạng lưới', Icon: LayoutGrid },
  { mode: 'list', label: 'Dạng danh sách', Icon: Rows3 },
] as const;

/** Hai nút bật/tắt (aria-pressed) chọn lưới hoặc danh sách; mỗi nút 44px để đủ vùng chạm. */
export function CatalogViewSwitcher({
  value,
  onChange,
  className,
}: {
  value: CatalogViewMode;
  onChange: (mode: CatalogViewMode) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label="Chế độ hiển thị" className={twMerge('flex items-center gap-1', className)}>
      {OPTIONS.map(({ mode, label, Icon }) => {
        const pressed = value === mode;
        return (
          <button
            key={mode}
            type="button"
            aria-pressed={pressed}
            aria-label={label}
            title={label}
            onClick={() => onChange(mode)}
            className={twMerge(
              'grid size-11 place-items-center rounded-xl border transition-colors focus-ring',
              pressed
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50',
            )}
          >
            <Icon aria-hidden className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
