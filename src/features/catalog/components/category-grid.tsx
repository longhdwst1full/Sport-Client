import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { CategoryCardView } from '../model/category.mapper';

export function CategoryGrid({ items }: { items: CategoryCardView[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((category) => {
        const Icon = category.icon;
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group flex flex-col overflow-hidden rounded-[32px] border border-stone-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-400 hover:shadow-xl"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-stone-100">
                  <Icon className="size-10 text-stone-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-ink">
                  {category.itemCountLabel}
                </span>
                <Icon className="size-6 text-emerald-300" />
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h2 className="text-xl font-black text-ink group-hover:text-emerald-700">
                  {category.title}
                </h2>
                {category.description ? (
                  <p className="mt-2 text-xs leading-relaxed text-stone-500">
                    {category.description}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-bold text-emerald-700">
                <span>Xem toàn bộ sản phẩm</span>
                <ChevronRight className="size-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
