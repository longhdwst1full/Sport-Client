'use client';

import { Fragment, useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { useAutoplayAllowed } from '@/shared/hooks';
import { Reveal } from '@/foundation/components/motion';

/**
 * Phần tương tác của rail danh mục: section (dừng autoplay khi hover/focus), nút cuộn, vòng cuộn vô hạn
 * và thanh chỉ báo. Tiêu đề (`header`) và thẻ danh mục (`items`) render ở server
 * (`CategoryVisualShowcase`) nên không vào JS client; client chỉ lặp thẻ ba lần để cuộn vòng (payload
 * RSC chỉ chứa một bộ thẻ).
 */
export function CategoryRailCarousel({ header, items }: { header: ReactNode; items: ReactNode[] }) {
  const itemCount = items.length;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const autoplay = useAutoplayAllowed(sectionRef);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || itemCount === 0) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const cardStep = 210;
    const rawIndex = Math.round(scrollLeft / cardStep);
    const normalizedIndex = rawIndex % itemCount;
    setActiveIndex(normalizedIndex);

    // Seamless loop wrap: reset scroll position silently if reaching outer bounds
    const singleSetWidth = (scrollWidth / 3);
    if (scrollLeft >= singleSetWidth * 2) {
      el.scrollTo({ left: scrollLeft - singleSetWidth, behavior: 'instant' as ScrollBehavior });
    } else if (scrollLeft <= 10) {
      el.scrollTo({ left: scrollLeft + singleSetWidth, behavior: 'instant' as ScrollBehavior });
    }
  }, [itemCount]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Start in the middle set for infinite circular scroll in both directions
    const cardStep = 210;
    if (el.scrollLeft === 0 && itemCount > 0) {
      el.scrollLeft = itemCount * cardStep;
    }

    checkScrollability();
    el.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability, itemCount]);

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
        {header}

        {/* Circular Motion Slider Track */}
        <Reveal variant="blur-in" durationMs={700} delayMs={120} rootMargin="-60px" className="relative group/slider">
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
            {/* Repeat items for seamless circular infinite scrolling */}
            {[0, 1, 2].flatMap((round) =>
              items.map((item, index) => <Fragment key={`${round}-${index}`}>{item}</Fragment>),
            )}
          </div>

          {/* Sleek Minimalist Indicator Pill */}
          <div className="mt-5 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-1.5 shadow-xs">
              <div className="relative h-1.5 w-28 sm:w-40 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-neutral-900 transition-all duration-300 ease-out shadow-xs"
                  style={{
                    width: `${Math.max(20, Math.round(100 / Math.max(itemCount, 1)))}%`,
                    transform: `translateX(${itemCount > 1 ? (activeIndex / (itemCount - 1)) * (itemCount > 5 ? 300 : 150) : 0}%)`,
                  }}
                />
              </div>
              <span className="text-xs font-bold tracking-wider text-neutral-700 select-none">
                {String(activeIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(itemCount).padStart(2, '0')}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
