'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { useAutoplayAllowed, usePauseOnInteraction } from '@/shared/hooks';

/** Thời gian giữa hai lần tự trượt. */
const AUTOPLAY_INTERVAL_MS = 4000;

const ARROW_CLASS =
  'absolute top-1/2 z-10 size-10 -translate-y-1/2 rounded-full border border-neutral-200 bg-white/95 text-neutral-900 shadow-md backdrop-blur-sm transition-colors hover:border-brand-600 hover:bg-brand-600 hover:text-white focus-visible:ring-2 focus-visible:ring-brand-600';

/** Bước trượt = bề rộng một thẻ + khoảng cách, đọc từ DOM để khớp mọi breakpoint. */
function slideStep(track: HTMLDivElement): number {
  const first = track.firstElementChild as HTMLElement | null;
  const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
  return first ? first.offsetWidth + gap : track.clientWidth;
}

/**
 * Dải thẻ flash sale trượt ngang: tự trượt một thẻ mỗi `AUTOPLAY_INTERVAL_MS`, tới cuối thì quay về đầu.
 * Dừng khi rê chuột/focus bên trong, khi khối ra khỏi màn hình, tab ẩn hoặc người dùng bật giảm chuyển động
 * (`useAutoplayAllowed`). Đủ thẻ trong một khung (không tràn) thì ẩn nút và không tự trượt.
 */
export function FlashSaleDealSlider({ children }: { children: ReactNode[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const autoplayAllowed = useAutoplayAllowed(regionRef);
  const { paused, handlers } = usePauseOnInteraction();
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setOverflowing(track.scrollWidth > track.clientWidth + 1);
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(track);
    return () => observer?.disconnect();
  }, [children.length]);

  const slide = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const maxLeft = track.scrollWidth - track.clientWidth;
    const atEnd = track.scrollLeft >= maxLeft - 2;
    const atStart = track.scrollLeft <= 2;
    // Vòng lặp: cuối dải trượt tiếp thì về đầu, đầu dải lùi thì sang cuối.
    if (direction === 1 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
    else if (direction === -1 && atStart) track.scrollTo({ left: maxLeft, behavior: 'smooth' });
    else track.scrollBy({ left: direction * slideStep(track), behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (paused || !autoplayAllowed || !overflowing) return;
    const timer = setInterval(() => slide(1), AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, autoplayAllowed, overflowing, slide]);

  return (
    <div
      ref={regionRef}
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Các suất flash sale"
      {...handlers}
    >
      {overflowing && (
        <Button variant="ghost" size="icon" onClick={() => slide(-1)} className={`${ARROW_CLASS} left-1`} aria-label="Suất trước">
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Button>
      )}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="w-[calc((100%-0.75rem)/2)] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]"
          >
            {child}
          </div>
        ))}
      </div>
      {overflowing && (
        <Button variant="ghost" size="icon" onClick={() => slide(1)} className={`${ARROW_CLASS} right-1`} aria-label="Suất tiếp theo">
          <ChevronRight className="size-5" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
