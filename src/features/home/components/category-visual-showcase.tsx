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
  const autoplay = useAutoplayAllowed(sectionRef);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Repeat items for seamless circular infinite scrolling
  const infiniteItems = items.length > 0 ? [...items, ...items, ...items] : [];

  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || items.length === 0) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const cardStep = 210;
    const rawIndex = Math.round(scrollLeft / cardStep);
    const normalizedIndex = rawIndex % items.length;
    setActiveIndex(normalizedIndex);

    // Seamless loop wrap: reset scroll position silently if reaching outer bounds
    const singleSetWidth = (scrollWidth / 3);
    if (scrollLeft >= singleSetWidth * 2) {
      el.scrollTo({ left: scrollLeft - singleSetWidth, behavior: 'instant' as ScrollBehavior });
    } else if (scrollLeft <= 10) {
      el.scrollTo({ left: scrollLeft + singleSetWidth, behavior: 'instant' as ScrollBehavior });
    }
  }, [items.length]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Start in the middle set for infinite circular scroll in both directions
    const cardStep = 210;
    if (el.scrollLeft === 0 && items.length > 0) {
      el.scrollLeft = items.length * cardStep;
    }

    checkScrollability();
    el.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability, items.length]);

  // Infinite circular scroll handler
  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = Math.max(el.clientWidth * 0.75, 220);
    const targetScroll =
      direction === 'left'
        ? el.scrollLeft - scrollAmount
        : el.scrollLeft + scrollAmount;

    el.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  // Continuous auto-play circular motion
  useEffect(() => {
    if (isPaused || !autoplay) return;

    const interval = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const cardStep = 210;
      el.scrollBy({ left: cardStep, behavior: 'smooth' });
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused, autoplay]);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="py-10 sm:py-14 bg-gradient-to-b from-neutral-100/90 via-white to-neutral-100/70 border-y border-neutral-200/90"
      aria-label="Danh mục ngành hàng thể thao"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
    >
      <div className="page-container">
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-neutral-700 shadow-2xs">
              <span className="size-1.5 rounded-full bg-neutral-900" />
              Tìm nhanh theo bộ môn
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
              Bạn Muốn Tập Luyện Bộ Môn Nào?
            </h2>
            <p className="mt-1 text-xs text-neutral-500 font-medium sm:text-sm">
              Khám phá trang thiết bị thể thao chính hãng theo từng bộ môn chuyên biệt
            </p>
          </div>

          {/* Navigation Controls: View All */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              href="/category"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-800 hover:text-neutral-950 hover:underline transition rounded focus-ring"
            >
              {VIEW_ALL_CONTENT}
            </Link>
          </div>
        </div>

        {/* Circular Motion Slider Track */}
        <div className="relative group/slider">
          {/* Floating Left & Right Slider Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full border border-neutral-200 bg-white/95 text-neutral-900 shadow-md backdrop-blur-sm transition-all duration-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white active:scale-95 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            aria-label="Danh mục trước"
            title="Cuộn xoay tròn sang trái"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full border border-neutral-200 bg-white/95 text-neutral-900 shadow-md backdrop-blur-sm transition-all duration-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white active:scale-95 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            aria-label="Danh mục tiếp theo"
            title="Cuộn xoay tròn sang phải"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </Button>

          {/* Gradient Edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-neutral-100/90 to-transparent sm:w-12" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-neutral-100/90 to-transparent sm:w-12" />

          {/* Horizontal Infinite Track Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-label="Thanh trượt danh mục ngành hàng xoay tròn"
          >
            {infiniteItems.map((cat, idx) => (
              <CategoryRailItem key={`${cat.id}-${idx}`} category={cat} />
            ))}
          </div>

          {/* Sleek Minimalist Indicator Pill */}
          <div className="mt-5 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-1.5 shadow-xs">
              <div className="relative h-1.5 w-28 sm:w-40 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-neutral-900 transition-all duration-300 ease-out shadow-xs"
                  style={{
                    width: `${Math.max(20, Math.round(100 / Math.max(items.length, 1)))}%`,
                    transform: `translateX(${items.length > 1 ? (activeIndex / (items.length - 1)) * (items.length > 5 ? 300 : 150) : 0}%)`,
                  }}
                />
              </div>
              <span className="text-xs font-bold tracking-wider text-neutral-700 select-none">
                {String(activeIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(items.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
