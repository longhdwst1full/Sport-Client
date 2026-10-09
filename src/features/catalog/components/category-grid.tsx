import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { CategoryCardView } from '../model/category.mapper';
import { Skeleton, SkeletonText } from '@/foundation/components/feedback';

export function CategoryGrid({ items }: { items: CategoryCardView[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((category) => {
        const Icon = category.icon;
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group card-interactive focus-ring flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-neutral-100">
                  <Icon className="size-10 text-neutral-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-900">
                  {category.itemCountLabel}
                </span>
                <Icon className="size-6 text-neutral-300" />
              </div>
            </div>

            {/* Cả thẻ là link: chỉ tên + số sản phẩm; mô tả SEO dài nằm ở trang chi tiết danh mục. */}
            <div className="flex items-center justify-between gap-3 p-4">
              <h2 className="text-base font-semibold text-neutral-950">{category.title}</h2>
              <ChevronRight className="size-4 shrink-0 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-neutral-950" aria-hidden />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/** Khớp đúng hộp của `CategoryGrid` để không gây layout shift (RULE-SKEL-03). */
export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="card-interactive flex flex-col"
        >
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <Skeleton className="h-6 w-2/3" />
              <SkeletonText lines={2} className="mt-3" />
            </div>
            <Skeleton className="mt-6 h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
