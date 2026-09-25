'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShieldCheck, Zap, ArrowRight, Flame } from 'lucide-react';
import { useFlashSale } from '@/features/promotions';
import type { ContentPostView } from '@/features/content/model/content-post.mapper';
import { STORE_CONFIG } from '@/shared/constants';

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  /** Null thì slide chỉ có nền gradient; không mượn ảnh stock. */
  imageUrl: string | null;
}

/** Số bài viết tối đa lên slider; phần còn lại vẫn ở khối "Bài viết mới". */
const MAX_POST_SLIDES = 3;

/**
 * Slider trang chủ chỉ dựng từ dữ liệu thật: bài viết đã đăng có ảnh bìa (server truyền xuống,
 * cùng chu kỳ ISR của `/`) và chiến dịch flash sale đang chạy (client, theo giờ server).
 * Bản trước đọc `MOCK_HERO_SLIDES` với mức giảm giá và quà tặng viết cứng. Không có gì để
 * hiển thị thì dùng một slide thương hiệu tĩnh, không kèm giá hay phần trăm.
 */
export function HeroBannerSlider({ posts = [] }: { posts?: ContentPostView[] }) {
  const { campaigns } = useFlashSale();
  const slides = useMemo<HeroSlide[]>(() => {
    // Bài viết đứng trước để slide đầu tiên của HTML SSR không bị thay sau khi flash sale tải xong.
    const postSlides = posts
      .filter((post) => post.coverUrl)
      .slice(0, MAX_POST_SLIDES)
      .map((post) => ({
        id: `post-${post.id}`,
        badge: post.categoryLabel,
        title: post.title,
        subtitle: post.excerpt,
        ctaText: 'Đọc bài viết',
        ctaLink: `/news/${post.slug}`,
        imageUrl: post.coverUrl,
      }));
    const campaignSlides = campaigns
      .filter((campaign) => campaign.deals.length > 0)
      .map((campaign) => ({
        id: `flash-${campaign.code}`,
        badge: 'Flash Sale đang diễn ra',
        title: campaign.name,
        subtitle: campaign.description ?? `${campaign.deals.length} sản phẩm trong chương trình.`,
        ctaText: 'Xem Flash Sale',
        ctaLink: '/flash-sale',
        imageUrl: campaign.deals.find((deal) => deal.imageUrl)?.imageUrl ?? null,
      }));
    const all = [...postSlides, ...campaignSlides];
    if (all.length > 0) return all;
    return [
      {
        id: 'brand',
        badge: STORE_CONFIG.name,
        title: STORE_CONFIG.tagline,
        subtitle: STORE_CONFIG.slogan,
        ctaText: 'Xem sản phẩm',
        ctaLink: '/products',
        imageUrl: null,
      },
    ];
  }, [posts, campaigns]);
  const hasCampaign = campaigns.some((campaign) => campaign.deals.length > 0);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const slideCount = slides.length;
  // Số slide đổi khi flash sale tải xong; giữ chỉ số trong khoảng mà không cần effect.
  const activeIndex = currentSlide % slideCount;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Auto-play interval
  useEffect(() => {
    if (isPaused || slideCount < 2) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, slideCount]);

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
            className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 shadow-lg lg:col-span-8 group min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
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
                  {slides.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeIndex
                          ? 'w-7 bg-emerald-400'
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Chuyển tới slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Side: 2 Stacked Campaign Banners (4 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:col-span-4">
            {/* Promo Card 1: Chính sách bảo hành (trang CMS thật) */}
            <Link
              href="/chinh-sach/chinh-sach-bao-hanh"
              className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-900 to-slate-950 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl min-h-[180px] sm:min-h-[210px] lg:min-h-[230px]"
            >
              {/* Background Cover */}
              <div className="relative size-full">
                <Image
                  src="/images/banners/banner-bao-hanh.jpg"
                  alt="Chính sách bảo hành Bảo An Sport"
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
                  Chính Sách Bảo Hành
                </h3>
                <p className="mt-0.5 text-xs text-slate-300 line-clamp-2">
                  Điều kiện, thời hạn và cách gửi yêu cầu bảo hành
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:underline">
                  <span>Tra cứu chính sách</span>
                  <ArrowRight className="size-3 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Promo Card 2: Tạ Tay & Phụ Kiện */}
            <Link
              href="/category/dung-cu-tap-gym"
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
                  {/* Thẻ này dẫn sang danh mục, không phải chương trình flash sale; gọi đúng tên
                      để không hứa một chương trình có thể đang không chạy. */}
                  PHỤ KIỆN TẬP GYM
                </span>
                <h3 className="mt-1 text-base font-black leading-snug sm:text-lg group-hover:text-amber-300 transition">
                  Tạ Tay & Phụ Kiện Thể Thao
                </h3>
                <p className="mt-0.5 text-xs text-slate-300 line-clamp-2">
                  Tạ tay, tạ đơn, ghế tập và phụ kiện cho phòng tập tại nhà
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:underline">
                  <span>Xem danh mục</span>
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
