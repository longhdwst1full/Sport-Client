import Image from 'next/image';
import Link from 'next/link';
import { Activity, Bike, Dumbbell, Footprints, HeartPulse, Swords, Trophy } from 'lucide-react';
import type { CategoryRailView } from '@/features/catalog';

function getCategoryIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('gym') || n.includes('tạ')) return Dumbbell;
  if (n.includes('chạy') || n.includes('đi bộ')) return Footprints;
  if (n.includes('bóng bàn') || n.includes('bóng rổ') || n.includes('bóng chuyền') || n.includes('cầu lông') || n.includes('tennis') || n.includes('pickleball')) return Trophy;
  if (n.includes('võ') || n.includes('boxing') || n.includes('đấm')) return Swords;
  if (n.includes('xe đạp')) return Bike;
  if (n.includes('yoga')) return HeartPulse;
  if (n.includes('thể dục') || n.includes('bơi')) return Activity;
  return Dumbbell;
}

export function CategoryRailItem({ category }: { category: CategoryRailView }) {
  return (
    <Link
      href={category.href}
      className="group relative flex flex-col items-center justify-between p-4 sm:p-5 w-[160px] sm:w-[190px] md:w-[200px] shrink-0 snap-start surface-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-neutral-400 hover:shadow-xl hover:shadow-neutral-900/10 text-center focus-ring"
    >
      {/* Ultra-Rounded Circular Image Avatar (Border Tròn Đi) */}
      <div className="relative mt-2 size-24 sm:size-28 rounded-full bg-gradient-to-b from-neutral-50 to-neutral-50/40 p-2.5 border-2 border-neutral-200/80 group-hover:border-neutral-900 group-hover:ring-4 group-hover:ring-neutral-900/15 shadow-inner transition-all duration-300 overflow-hidden">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="112px"
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-neutral-50/60 text-neutral-900 transition-transform duration-300 group-hover:scale-110">
            {(() => {
              const Icon = getCategoryIcon(category.name);
              return <Icon className="size-10 stroke-[1.75]" aria-hidden="true" />;
            })()}
          </div>
        )}
      </div>

      {/* Category Name & Count with Rounded Tag */}
      <div className="mt-4 w-full">
        <h3 className="text-xs sm:text-sm font-bold text-neutral-800 transition-colors group-hover:text-neutral-900 line-clamp-1 leading-snug">
          {category.name}
        </h3>
        <div className="mt-2 inline-flex items-center rounded-full bg-neutral-100 group-hover:bg-neutral-50 group-hover:text-neutral-900 px-2.5 py-0.5 text-xs font-semibold text-neutral-500 transition-colors">
          {category.count}
        </div>
      </div>
    </Link>
  );
}
