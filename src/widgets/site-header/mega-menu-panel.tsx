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
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-xl ring-1 ring-black/5">
        <div className="grid grid-cols-[1.3fr_0.7fr] gap-6">
          <div>
            <span className="inline-block rounded-md bg-neutral-50 px-2.5 py-1 text-2xs font-black uppercase tracking-wider text-neutral-900">
              {category.label}
            </span>
            <div className="mt-3 divide-y divide-neutral-100">
              {category.children.map((child) => (
                <Link
                  key={child.label}
                  href={child.href}
                  className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900"
                >
                  <span>{child.label}</span>
                  <ChevronRight aria-hidden className="size-3.5 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-900" />
                </Link>
              ))}
            </div>
            <Link
              href={category.href}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-neutral-900 hover:text-neutral-950 hover:underline"
            >
              Xem tất cả {category.label} →
            </Link>
          </div>

          {/* Ảnh minh hoạ danh mục */}
          <div className="relative min-h-[210px] overflow-hidden rounded-xl bg-neutral-100 shadow-inner group/img">
            {category.imageUrl && (
              <Image
                src={category.imageUrl}
                alt=""
                fill
                sizes="240px"
                className="object-cover transition duration-500 hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent flex items-end p-4">
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
