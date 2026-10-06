import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Flame, Pause, Play, Zap } from 'lucide-react';
import { CarouselDots } from '@/foundation/components/indicators';
import { BannerPicture } from '@/features/content';

export interface HeroSlide {
  id: string;
  /** Banner CMS không có nhãn; bỏ trống thì không render pill. */
  badge?: string;
  /** Banner CMS có thể chỉ là ảnh (chữ in sẵn trong ảnh): không tiêu đề/mô tả thì không phủ gradient. */
  title: string | null;
  subtitle: string | null;
  ctaText: string;
  /** Null thì slide không có nút dẫn đi đâu. */
  ctaLink: string | null;
  /** Null thì slide chỉ có nền gradient; không mượn ảnh stock. */
  imageUrl: string | null;
  /** Ảnh riêng cho màn hình nhỏ (banner CMS); bỏ trống thì dùng `imageUrl`. */
  mobileImageUrl?: string | null;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  activeIndex: number;
  hasCampaign: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  /** Người dùng đã bấm dừng tự chuyển slide. */
  autoplayPaused: boolean;
  onToggleAutoplay: () => void;
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
  autoplayPaused,
  onToggleAutoplay,
  onTouchStart,
  onTouchEnd,
}: HeroSliderProps) {
  const slideCount = slides.length;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 shadow-lg lg:col-span-8 group min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides container */}
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        const hasText = Boolean(slide.badge || slide.title || slide.subtitle);
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
                {slide.mobileImageUrl ? (
                  <BannerPicture
                    banner={{
                      desktopImageUrl: slide.imageUrl,
                      mobileImageUrl: slide.mobileImageUrl,
                    }}
                    alt=""
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover object-center"
                  />
                ) : (
                  <Image
                    src={slide.imageUrl}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover object-center"
                  />
                )}
                {/* Gradient Overlay for high text readability */}
                {hasText && (
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent sm:from-slate-950/95 sm:via-slate-950/50" />
                )}
              </div>
            )}

            {/* Banner chỉ có ảnh: cả slide là liên kết, không vẽ khối chữ/nút rỗng. */}
            {!hasText && slide.ctaLink && (
              <Link
                href={slide.ctaLink}
                tabIndex={isActive ? undefined : -1}
                aria-label={slide.ctaText}
                className="absolute inset-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white"
              />
            )}

            {/* Slide Content */}
            {hasText && (
              <div className="absolute inset-0 flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-12">
                <div className="max-w-xl">
                  {slide.badge && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
                      <Zap className="size-3.5 fill-white" aria-hidden="true" />
                      {slide.badge}
                    </span>
                  )}

                  {slide.title && (
                    <h2 className="mt-3.5 line-clamp-3 text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                      {slide.title}
                    </h2>
                  )}

                  {slide.subtitle && (
                    <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm sm:leading-6 line-clamp-2 sm:line-clamp-3">
                      {slide.subtitle}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {slide.ctaLink && (
                      <Link
                        href={slide.ctaLink}
                        tabIndex={isActive ? undefined : -1}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white shadow-md shadow-brand-600/30 transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:px-6 sm:py-3 sm:text-sm"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    )}
                    {/* Không có chiến dịch nào đang chạy thì không dẫn khách tới khu vực trống. */}
                    {hasCampaign && slide.ctaLink !== '/flash-sale' && (
                      <Link
                        href="/flash-sale"
                        tabIndex={isActive ? undefined : -1}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:py-3 sm:text-sm"
                      >
                        <Flame className="size-4 text-amber-400" aria-hidden="true" />
                        <span>Flash Sale</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {slideCount > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-brand-600 sm:left-4 opacity-70 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            aria-label="Slide trước"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-brand-600 sm:right-4 opacity-70 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            aria-label="Slide sau"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>

          {/* Slide Indicators Dots */}
          <CarouselDots
            count={slides.length}
            activeIndex={activeIndex}
            onSelect={onSelect}
            wrapperClassName="absolute bottom-4 left-6 z-20 flex items-center gap-2 sm:left-10"
            baseClassName="h-2 rounded-full transition-all duration-300"
            activeClassName="w-7 bg-brand-400"
            inactiveClassName="w-2 bg-white/40 hover:bg-white/70"
            keyFor={(index) => slides[index].id}
            ariaLabelFor={(index) => `Chuyển tới slide ${index + 1}`}
          />
          <button
            type="button"
            onClick={onToggleAutoplay}
            aria-label={autoplayPaused ? 'Tiếp tục tự chuyển slide' : 'Tạm dừng tự chuyển slide'}
            className="absolute bottom-3 right-3 z-20 grid size-11 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60 sm:right-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            {autoplayPaused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
          </button>
        </>
      )}
    </div>
  );
}
