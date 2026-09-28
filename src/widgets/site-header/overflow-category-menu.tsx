import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { MegaMenuEntry } from '@/features/catalog';

interface OverflowCategoryMenuProps {
  categories: MegaMenuEntry[];
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function OverflowCategoryMenu({ categories, isOpen, onMouseEnter, onMouseLeave }: OverflowCategoryMenuProps) {
  if (categories.length <= 2) return null;

  return (
    <div
      className={`relative ${
        categories.length === 3
          ? 'xl:hidden'
          : categories.length === 4
            ? '2xl:hidden'
            : ''
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        type="button"
        className={`inline-flex items-center gap-1 xl:gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 xl:px-3 xl:py-2 xl:text-sm ${
          isOpen
            ? 'bg-emerald-50 text-emerald-700 font-bold ring-1 ring-emerald-600/15'
            : 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700'
        }`}
      >
        <span>Danh mục khác</span>
        <ChevronDown
          className={`size-3.5 xl:size-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-600' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 w-72 pt-2 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-2xl ring-1 ring-black/5 space-y-1">
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
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition ${itemClass}`}
                >
                  <span>{cat.label}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 font-medium">
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
