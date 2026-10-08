import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Flame, Zap } from 'lucide-react';
import { Button, buttonVariants } from '@/foundation/components/buttons';
import { CarouselDots } from '@/foundation/components/indicators';
import { BannerPicture } from '@/features/content';

/** Vòng focus trắng trên nền tối của hero. */
const HERO_FOCUS = 'focus-visible:ring-white focus-visible:ring-offset-slate-900';
/** Nút tròn nổi trên ảnh (mũi tên, dừng/chạy): nền đen mờ, chữ trắng. */
const HERO_ROUND_BUTTON = `absolute z-20 rounded-full bg-black/40 text-white backdrop-blur ${HERO_FOCUS}`;

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
  /** Người dùng đã bấm dừng tự chuyển slide (tùy chọn) */
  autoplayPaused?: boolean;
  onToggleAutoplay?: () => void;
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
      className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-lg lg:col-span-8 group min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]"
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
                    className="object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={slide.imageUrl}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover object-center transition duration-500 group-hover:scale-105"
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
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
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
                        // Nút trắng trên ảnh tối: nút than (primary) gần như chìm vào lớp phủ đen của slide.
                        className={buttonVariants({
                          variant: 'inverse',
                          className: `h-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wide sm:px-6 sm:py-3 sm:text-sm ${HERO_FOCUS}`,
                        })}
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
                        className={buttonVariants({
                          variant: 'ghost',
                          className: `h-auto gap-1.5 border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur hover:bg-white/20 sm:py-3 sm:text-sm ${HERO_FOCUS}`,
                        })}
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
          {(
            [
              { label: 'Slide trước', onClick: onPrev, Icon: ChevronLeft, position: 'left-3 sm:left-4' },
              { label: 'Slide sau', onClick: onNext, Icon: ChevronRight, position: 'right-3 sm:right-4' },
            ] as const
          ).map(({ label, onClick, Icon, position }) => (
            <Button
              key={label}
              variant="ghost"
              size="icon"
              onClick={onClick}
              className={`${HERO_ROUND_BUTTON} ${position} top-1/2 hidden -translate-y-1/2 opacity-70 sm:grid hover:bg-white hover:text-slate-950 group-hover:opacity-100 focus-visible:opacity-100`}
              aria-label={label}
            >
              <Icon className="size-5" aria-hidden="true" />
            </Button>
          ))}

          {/* Slide Indicators Dots */}
          <CarouselDots
            count={slides.length}
            activeIndex={activeIndex}
            onSelect={onSelect}
            wrapperClassName="absolute bottom-4 left-6 z-20 flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 backdrop-blur-xs sm:left-10"
            baseClassName="h-1.5 rounded-full transition-all duration-300"
            activeClassName="w-6 bg-white"
            inactiveClassName="w-1.5 bg-white/40 hover:bg-white/80"
            keyFor={(index) => slides[index].id}
            ariaLabelFor={(index) => `Chuyển tới slide ${index + 1}`}
          />
        </>
      )}
    </div>
  );
}
