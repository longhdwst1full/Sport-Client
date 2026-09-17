'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  ArrowRight,
  Dumbbell,
  Footprints,
  Trophy,
  Activity,
  HeartPulse,
  Swords,
  Bike,
} from 'lucide-react';

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
import type { CategoryRailView } from '@/features/catalog';

export function CategoryVisualShowcase({ items }: { items: CategoryRailView[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate approximate active index for indicator dots
    const itemWidth = 190; // Average card width + gap
    const index = Math.round(scrollLeft / itemWidth);
    setActiveIndex(Math.min(index, items.length - 1));
  }, [items.length]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollability();
    el.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability]);

  // Smooth scroll handler
  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = Math.max(el.clientWidth * 0.75, 240);
    const targetScroll =
      direction === 'left'
        ? el.scrollLeft - scrollAmount
        : el.scrollLeft + scrollAmount;

    // Wrap around if reached ends
    if (direction === 'right' && el.scrollLeft + el.clientWidth >= el.scrollWidth - 15) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction === 'left' && el.scrollLeft <= 10) {
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    } else {
      el.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  // Auto-play sliding motion when not hovered
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      // Auto glide by one card width
      const cardStep = 210;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 15) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: cardStep, behavior: 'smooth' });
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scrollToItem = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardStep = 210;
    el.scrollTo({ left: index * cardStep, behavior: 'smooth' });
  };

  return (
    <section
      id="categories"
      className="py-12 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 border-y border-slate-200/80"
      aria-label="Danh mục ngành hàng thể thao"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-800 mb-2">
              <Layers className="size-3.5" />
              <span>DANH MỤC THIẾT BỊ BẢO AN SPORT</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Sản Phẩm Theo Danh Mục Ngành Hàng
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Khám phá trang thiết bị thể thao chính hãng theo từng bộ môn chuyên biệt
            </p>
          </div>

          {/* Navigation Controls: Circular Slide Buttons & View All */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              href="/catalog"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 hover:text-emerald-800 transition mr-2"
            >
              <span>Xem tất cả danh mục</span>
              <ArrowRight className="size-3.5" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white shadow-sm text-slate-700 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Trượt sang danh mục trước"
                title="Trước"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white shadow-sm text-slate-700 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Trượt sang danh mục tiếp theo"
                title="Tiếp theo"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Motion Slider Track with Rounded Border Styling */}
        <div className="relative group/slider">
          {/* Subtle Fade Edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-slate-50/80 to-transparent sm:w-12" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-slate-50/80 to-transparent sm:w-12" />

          {/* Horizontal Sliding Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-label="Thanh trượt danh mục ngành hàng"
          >
            {items.map((cat, index) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group relative flex flex-col items-center justify-between p-4 sm:p-5 w-[160px] sm:w-[190px] md:w-[200px] shrink-0 snap-start rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10 text-center"
              >
                {/* Ultra-Rounded Circular Image Avatar (Border Tròn Đi) */}
                <div className="relative mt-2 size-24 sm:size-28 rounded-full bg-gradient-to-b from-slate-50 to-emerald-50/40 p-2.5 border-2 border-slate-200/80 group-hover:border-emerald-500 group-hover:ring-4 group-hover:ring-emerald-500/15 shadow-inner transition-all duration-300 overflow-hidden">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="112px"
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-emerald-50/60 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                      {(() => {
                        const Icon = getCategoryIcon(cat.name);
                        return <Icon className="size-10 stroke-[1.75]" />;
                      })()}
                    </div>
                  )}
                </div>

                {/* Category Name & Count with Rounded Tag */}
                <div className="mt-4 w-full">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 transition-colors group-hover:text-emerald-700 line-clamp-1 leading-snug">
                    {cat.name}
                  </h3>
                  <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 transition-colors">
                    {cat.count}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Slider Pagination Dots Indicator */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {items.map((cat, idx) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => scrollToItem(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? 'w-6 bg-emerald-600'
                    : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Đi tới danh mục ${cat.name}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-5 py-2 text-xs font-black uppercase tracking-wider text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
          >
            <span>Xem tất cả danh mục</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
