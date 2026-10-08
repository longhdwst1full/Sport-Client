'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { CategoryRailItem } from './category-rail-item';
import type { CategoryRailView } from '@/features/catalog';
import { useAutoplayAllowed } from '@/shared/hooks';

const VIEW_ALL_CONTENT = (
  <>
    <span>Xem tất cả danh mục</span>
    <ArrowRight className="size-3.5" aria-hidden="true" />
  </>
);

export function CategoryVisualShowcase({ items }: { items: CategoryRailView[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Dừng tự trượt khi cuộn khỏi màn hình, ẩn tab hoặc người dùng chọn giảm chuyển động.
  const autoplay = useAutoplayAllowed(sectionRef);
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
    if (isPaused || !autoplay) return;

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
  }, [isPaused, autoplay]);

  const scrollToItem = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardStep = 210;
    el.scrollTo({ left: index * cardStep, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="py-8 sm:py-12 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 border-y border-slate-200/80"
      aria-label="Danh mục ngành hàng thể thao"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      // Bàn phím đang ở trong khối thì cũng dừng tự trượt (WCAG 2.2.2), không kéo focus khỏi tầm nhìn.
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-slate-900">Danh mục thiết bị</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Sản Phẩm Theo Danh Mục Ngành Hàng
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Khám phá trang thiết bị thể thao chính hãng theo từng bộ môn chuyên biệt
            </p>
          </div>

          {/* Navigation Controls: View All */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              href="/category"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-slate-950 hover:underline transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              {VIEW_ALL_CONTENT}
            </Link>
          </div>
        </div>

        {/* Motion Slider Track with Rounded Border Styling */}
        <div className="relative group/slider">
          {/* Floating Left & Right Slider Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full border border-slate-200 bg-white/95 text-slate-800 shadow-md backdrop-blur-sm transition-all duration-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-0 focus-visible:ring-2 focus-visible:ring-slate-900"
            aria-label="Danh mục trước"
            title="Cuộn sang trái"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full border border-slate-200 bg-white/95 text-slate-800 shadow-md backdrop-blur-sm transition-all duration-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-0 focus-visible:ring-2 focus-visible:ring-slate-900"
            aria-label="Danh mục tiếp theo"
            title="Cuộn sang phải"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </Button>

          {/* Subtle Fade Edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-slate-50/80 to-transparent sm:w-12" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-slate-50/80 to-transparent sm:w-12" />

          {/* Horizontal Sliding Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-label="Thanh trượt danh mục ngành hàng"
          >
            {items.map((cat) => (
              <CategoryRailItem key={cat.id} category={cat} />
            ))}
          </div>

          {/* Sleek Minimalist Indicator Pill */}
          <div className="mt-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200/90 bg-white px-4 py-1.5 shadow-2xs">
              <div className="relative h-1.5 w-28 sm:w-40 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.max(20, Math.round(100 / Math.max(items.length, 1)))}%`,
                    transform: `translateX(${items.length > 1 ? (activeIndex / (items.length - 1)) * (items.length > 5 ? 300 : 150) : 0}%)`,
                  }}
                />
              </div>
              <span className="text-xs font-bold tracking-wider text-slate-600 select-none">
                {String(activeIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(items.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
