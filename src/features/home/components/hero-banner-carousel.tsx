'use client';

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { HeroSlider, type HeroSlideContent } from './hero-slider';
import { useAutoplayAllowed } from '@/shared/hooks';

/**
 * Phần client của hero: trạng thái slide, autoplay, vuốt và nút điều hướng. Dữ liệu slide và ảnh nền
 * dựng ở server (`HeroBannerSlider`); thẻ bên phải (`promo`) cũng render ở server.
 */
export function HeroBannerCarousel({
  slides,
  backgrounds,
  promo,
}: {
  slides: HeroSlideContent[];
  backgrounds: ReactNode[];
  promo: ReactNode;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Dừng tự chuyển slide khi cuộn khỏi màn hình, ẩn tab hoặc người dùng chọn giảm chuyển động.
  const autoplay = useAutoplayAllowed(sectionRef);
  const slideCount = slides.length;
  // Giữ chỉ số trong khoảng khi số slide đổi, không cần effect.
  const activeIndex = currentSlide % slideCount;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Auto-play interval chạy tự động định kỳ 5 giây
  useEffect(() => {
    if (!autoplay || slideCount < 2) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay, nextSlide, slideCount]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  return (
    <section
      ref={sectionRef}
      className="px-4 pt-3 pb-6 sm:px-6 lg:px-8"
      aria-label="Khu vực banner chính"
    >
      <div className="mx-auto max-w-7xl">
        {/* Responsive Grid: 8 cols slider + 4 cols promo side banners */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Main Hero Slider (8 cols) */}
          <HeroSlider
            slides={slides}
            backgrounds={backgrounds}
            activeIndex={activeIndex}
            onPrev={prevSlide}
            onNext={nextSlide}
            onSelect={setCurrentSlide}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />

          {/* Right Side: 2 Stacked Campaign Banners (4 cols) */}
          {promo}
        </div>
      </div>
    </section>
  );
}
