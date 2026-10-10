'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, Bike, Dumbbell, Footprints, HeartPulse, Swords, Trophy } from 'lucide-react';
import type { CategoryRailView } from '@/features/catalog';

function getCategoryIconStyle(name: string) {
  const n = name.toLowerCase();
  if (n.includes('gym') || n.includes('tạ')) return { Icon: Dumbbell, color: 'text-red-600 bg-red-50 border-red-200 group-hover:bg-red-600 group-hover:text-white' };
  if (n.includes('chạy') || n.includes('đi bộ')) return { Icon: Footprints, color: 'text-amber-600 bg-amber-50 border-amber-200 group-hover:bg-amber-600 group-hover:text-white' };
  if (n.includes('bóng bàn') || n.includes('bóng rổ') || n.includes('bóng chuyền') || n.includes('cầu lông') || n.includes('tennis') || n.includes('pickleball')) return { Icon: Trophy, color: 'text-amber-600 bg-amber-50 border-amber-200 group-hover:bg-amber-600 group-hover:text-white' };
  if (n.includes('võ') || n.includes('boxing') || n.includes('đấm')) return { Icon: Swords, color: 'text-red-600 bg-red-50 border-red-200 group-hover:bg-red-600 group-hover:text-white' };
  if (n.includes('xe đạp')) return { Icon: Bike, color: 'text-neutral-600 bg-neutral-50 border-neutral-200 group-hover:bg-neutral-600 group-hover:text-white' };
  if (n.includes('yoga')) return { Icon: HeartPulse, color: 'text-neutral-600 bg-neutral-50 border-neutral-200 group-hover:bg-neutral-600 group-hover:text-white' };
  if (n.includes('thể dục') || n.includes('bơi')) return { Icon: Activity, color: 'text-success-600 bg-success-50 border-success-200 group-hover:bg-success-600 group-hover:text-white' };
  return { Icon: Dumbbell, color: 'text-red-600 bg-red-50 border-red-200 group-hover:bg-red-600 group-hover:text-white' };
}

export function CategoryRailItem({ category }: { category: CategoryRailView }) {
  const { Icon, color } = getCategoryIconStyle(category.name);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="shrink-0 snap-start"
    >
      <Link
        href={category.href}
        className="group relative flex flex-col items-center justify-between p-4 sm:p-5 w-[160px] sm:w-[190px] md:w-[200px] rounded-3xl border border-neutral-200/90 bg-white shadow-sm transition-all duration-300 hover:border-red-500/80 hover:shadow-2xl hover:shadow-red-600/20 text-center focus-ring animate-shine overflow-hidden"
      >
        {/* Ultra-Rounded Glowing Circular Image Avatar */}
        <div className="relative mt-2 size-24 sm:size-28 rounded-full bg-gradient-to-br from-neutral-50 via-white to-neutral-100 p-2 border-2 border-neutral-200/80 group-hover:border-red-600 group-hover:ring-4 group-hover:ring-red-500/25 shadow-inner transition-all duration-300 overflow-hidden">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              sizes="112px"
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-115"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-neutral-50 text-neutral-800 transition-transform duration-300 group-hover:scale-115">
              <Icon className="size-10 stroke-[1.75]" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Category Name & Count with Vibrant Red Pill Tag */}
        <div className="mt-4 w-full">
          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 transition-colors group-hover:text-red-600 line-clamp-1 leading-snug">
            {category.name}
          </h3>
          <div className={`mt-2 inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold shadow-2xs transition-all duration-300 ${color}`}>
            {category.count}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
