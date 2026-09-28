import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Flame, Zap } from 'lucide-react';
import { CarouselDots } from '@/foundation/components/indicators';

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  /** Null thì slide chỉ có nền gradient; không mượn ảnh stock. */
  imageUrl: string | null;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  activeIndex: number;
  hasCampaign: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export function HeroSlider({
  slides,
  activeIndex,
  hasCampaign,
  onPrev,
  onNext,
  onSelect,
  onTouchStart,
  onTouchEnd,
}: HeroSliderProps) {
  const slideCount = slides.length;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 shadow-lg lg:col-span-8 group min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides container */}
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            {/* Background Image */}
            {slide.imageUrl && (
              <div className="relative size-full">
                <Image
                  src={slide.imageUrl}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover object-center"
                />
                {/* Gradient Overlay for high text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent sm:from-slate-950/95 sm:via-slate-950/50" />
              </div>
            )}

            {/* Slide Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-12">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-sm backdrop-blur">
                  <Zap className="size-3.5 fill-slate-950" />
                  {slide.badge}
                </span>

                <h2 className="mt-3.5 line-clamp-3 text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                  {slide.title}
                </h2>

                {slide.subtitle && (
                  <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm sm:leading-6 line-clamp-2 sm:line-clamp-3">
                    {slide.subtitle}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={slide.ctaLink}
                    tabIndex={isActive ? undefined : -1}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-500 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                  {/* Không có chiến dịch nào đang chạy thì không dẫn khách tới khu vực trống. */}
                  {hasCampaign && slide.ctaLink !== '/flash-sale' && (
                    <Link
                      href="/flash-sale"
                      tabIndex={isActive ? undefined : -1}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20 sm:py-3 sm:text-sm"
                    >
                      <Flame className="size-4 text-rose-400" />
                      <span>Flash Sale</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {slideCount > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-3 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-emerald-600 sm:left-4 sm:size-10 opacity-70 group-hover:opacity-100"
            aria-label="Slide trước"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-emerald-600 sm:right-4 sm:size-10 opacity-70 group-hover:opacity-100"
            aria-label="Slide sau"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Slide Indicators Dots */}
          <CarouselDots
            count={slides.length}
            activeIndex={activeIndex}
            onSelect={onSelect}
            wrapperClassName="absolute bottom-4 left-6 z-20 flex items-center gap-2 sm:left-10"
            baseClassName="h-2 rounded-full transition-all duration-300"
            activeClassName="w-7 bg-emerald-400"
            inactiveClassName="w-2 bg-white/40 hover:bg-white/70"
            keyFor={(index) => slides[index].id}
            ariaLabelFor={(index) => `Chuyển tới slide ${index + 1}`}
          />
        </>
      )}
    </div>
  );
}
