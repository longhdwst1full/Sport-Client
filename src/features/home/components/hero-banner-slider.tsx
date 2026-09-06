'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  Flame,
  Truck,
  RotateCw,
} from 'lucide-react';
import { MOCK_HERO_SLIDES as HERO_SLIDES, HeroSlideItem as SlideItem } from '@/shared/data/mocks';

export function HeroBannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto-play interval
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

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
      className="px-4 pt-3 pb-6 sm:px-6 lg:px-8"
      aria-label="Khu vực banner chính"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl">
        {/* Responsive Grid: 8 cols slider + 4 cols promo side banners */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Main Hero Slider (8 cols) */}
          <div
            className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-950 shadow-lg lg:col-span-8 group min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slides container */}
            {HERO_SLIDES.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  aria-hidden={!isActive}
                >
                  {/* Background Image */}
                  <div className="relative size-full">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover object-center"
                    />
                    {/* Gradient Overlay for high text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent sm:from-slate-950/95 sm:via-slate-950/50" />
                  </div>

                  {/* Slide Content */}
                  <div className="absolute inset-0 flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-12">
                    <div className="max-w-xl">
                      {/* Campaign Badge */}
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-sm backdrop-blur">
                        <Zap className="size-3.5 fill-slate-950" />
                        {slide.badge}
                      </span>

                      {/* Main Heading */}
                      <h2 className="mt-3.5 text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                        {slide.title} <br />
                        <span className="text-emerald-400">{slide.highlight}</span>
                      </h2>

                      {/* Description */}
                      <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm sm:leading-6 line-clamp-2 sm:line-clamp-none">
                        {slide.subtitle}
                      </p>

                      {/* CTA Buttons */}
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                          href={slide.ctaLink}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-500 sm:px-6 sm:py-3 sm:text-sm"
                        >
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="size-4" />
                        </Link>
                        <Link
                          href="/#flash-sale"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20 sm:py-3 sm:text-sm"
                        >
                          <Flame className="size-4 text-rose-400" />
                          <span>Flash Sale</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-3 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-emerald-600 sm:left-4 sm:size-10 opacity-70 group-hover:opacity-100"
              aria-label="Slide trước"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-emerald-600 sm:right-4 sm:size-10 opacity-70 group-hover:opacity-100"
              aria-label="Slide sau"
            >
              <ChevronRight className="size-5" />
            </button>

            {/* Slide Indicators Dots */}
            <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2 sm:left-10">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? 'w-7 bg-emerald-400'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Chuyển tới slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Side: 2 Stacked Campaign Banners (4 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:col-span-4">
            {/* Promo Card 1: Bảo Hành 5 Năm */}
            <Link
              href="/profile"
              className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-900 to-slate-950 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl min-h-[180px] sm:min-h-[210px] lg:min-h-[230px]"
            >
              {/* Background Cover */}
              <div className="relative size-full">
                <Image
                  src="/images/banners/banner-bao-hanh.jpg"
                  alt="Chính sách bảo hành 5 năm Bảo An Sport"
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent" />
              </div>

              {/* Text Info */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-400">
                  <ShieldCheck className="size-3.5" />
                  BẢO AN SPORT CHÍNH HÃNG
                </span>
                <h3 className="mt-1 text-base font-black leading-snug sm:text-lg group-hover:text-emerald-300 transition">
                  Bảo Hành Khung 5 Năm
                </h3>
                <p className="mt-0.5 text-xs text-slate-300 line-clamp-2">
                  Bảo trì trọn đời · Kỹ thuật viên hỗ trợ tận nhà trong 2 giờ
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:underline">
                  <span>Tra cứu chính sách</span>
                  <ArrowRight className="size-3 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Promo Card 2: Tạ Tay & Phụ Kiện */}
            <Link
              href="/catalog?category=dung-cu-tap-gym"
              className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-900 to-slate-950 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl min-h-[180px] sm:min-h-[210px] lg:min-h-[230px]"
            >
              {/* Background Cover */}
              <div className="relative size-full">
                <Image
                  src="/images/banners/banner-ta-tay.jpg"
                  alt="Tạ tay & phụ kiện gym chính hãng"
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent" />
              </div>

              {/* Text Info */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-amber-400">
                  <Flame className="size-3.5 fill-amber-400 text-amber-400" />
                  FLASH SALE PHỤ KIỆN
                </span>
                <h3 className="mt-1 text-base font-black leading-snug sm:text-lg group-hover:text-amber-300 transition">
                  Tạ Tay & Phụ Kiện Thể Thao
                </h3>
                <p className="mt-0.5 text-xs text-slate-300 line-clamp-2">
                  Ưu đãi tới 35% · Đa dạng mức tạ 2kg – 40kg chính hãng
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:underline">
                  <span>Mua ngay từ 150.000đ</span>
                  <ArrowRight className="size-3 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
