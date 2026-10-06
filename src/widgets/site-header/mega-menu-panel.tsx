import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import type { MegaMenuEntry } from '@/features/catalog';

interface MegaMenuPanelProps {
  category: MegaMenuEntry;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function MegaMenuPanel({ category, onMouseEnter, onMouseLeave }: MegaMenuPanelProps) {
  return (
    <div
      className="absolute left-0 top-full z-50 w-[640px] pt-2 animate-in fade-in slide-in-from-top-1"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-black/5">
        <div className="grid grid-cols-[1.3fr_0.7fr] gap-6">
          <div>
            <span className="inline-block rounded-md bg-brand-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-brand-700">
              {category.label}
            </span>
            <div className="mt-3 divide-y divide-slate-100">
              {category.children.map((child) => (
                <Link
                  key={child.label}
                  href={child.href}
                  className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-brand-700"
                >
                  <span>{child.label}</span>
                  <ChevronRight aria-hidden className="size-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </Link>
              ))}
            </div>
            <Link
              href={category.href}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-700 hover:text-brand-800 hover:underline"
            >
              Xem tất cả {category.label} →
            </Link>
          </div>

          {/* Ảnh minh hoạ danh mục */}
          <div className="relative min-h-[210px] overflow-hidden rounded-xl bg-slate-100 shadow-inner group/img">
            {category.imageUrl && (
              <Image
                src={category.imageUrl}
                alt=""
                fill
                sizes="240px"
                className="object-cover transition duration-500 hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
              <span className="text-xs font-bold text-white leading-snug">
                {category.productCount} sản phẩm chính hãng
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
