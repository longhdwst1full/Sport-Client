import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useId, type FocusEvent, type KeyboardEvent } from 'react';
import type { MegaMenuEntry } from '@/features/catalog';
import { Button } from '@/foundation/components/buttons';

interface OverflowCategoryMenuProps {
  categories: MegaMenuEntry[];
  isOpen: boolean;
  onOpen: () => void;
  /** Đóng trễ (hover rời đi) — tránh nháy khi rê chuột qua khe giữa nút và panel. */
  onMouseLeave: () => void;
  /** Đóng ngay (click lại, Escape, focus rời cụm). */
  onClose: () => void;
  triggerClassName: string;
  triggerIdleClassName: string;
  triggerActiveClassName: string;
}

export function OverflowCategoryMenu({
  categories,
  isOpen,
  onOpen,
  onMouseLeave,
  onClose,
  triggerClassName,
  triggerIdleClassName,
  triggerActiveClassName,
}: OverflowCategoryMenuProps) {
  const panelId = useId();
  if (categories.length <= 2) return null;

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onClose();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape' || !isOpen) return;
    onClose();
    event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus();
  };

  return (
    <div
      className={`relative ${
        categories.length === 3
          ? 'xl:hidden'
          : categories.length === 4
            ? '2xl:hidden'
            : ''
      }`}
      onMouseEnter={onOpen}
      onMouseLeave={onMouseLeave}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <Button
        onClick={isOpen ? onClose : onOpen}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={`${triggerClassName} ${isOpen ? triggerActiveClassName : triggerIdleClassName}`}
      >
        <span>Danh mục khác</span>
        <ChevronDown
          aria-hidden
          className={`size-3.5 text-white/80 transition-transform duration-200 xl:size-4 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Button>

      {isOpen && (
        <div
          id={panelId}
          className="absolute left-0 top-full z-50 w-72 pt-2 animate-in fade-in slide-in-from-top-1"
        >
          <div className="space-y-1 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5">
            {categories.slice(2).map((cat, idx) => {
              const itemClass =
                idx === 0
                  ? 'xl:hidden'
                  : idx === 1
                    ? '2xl:hidden'
                    : '';
              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 ${itemClass}`}
                >
                  <span>{cat.label}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    {cat.productCount}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
