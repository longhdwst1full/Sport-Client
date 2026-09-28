'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useFlashSale } from '@/features/promotions';
import type { ContentPostView } from '@/features/content';
import { HeroSlider, type HeroSlide } from './hero-slider';
import { HeroPromoCards } from './hero-promo-cards';

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
    const homeGymHeroSlide: HeroSlide = {
      id: 'home-gym-solution',
      badge: 'GIẢI PHÁP HOME GYM CHUYÊN NGHIỆP',
      title: 'Biến Góc Nhỏ Thành Phòng Tập Chuẩn Huấn Luyện',
      subtitle:
        'Thiết bị thể lực & cardio chính hãng từ 500K • Tư vấn theo diện tích 5m² – 20m² • Miễn phí vận chuyển & hỗ trợ lắp đặt tận nơi.',
      ctaText: 'Tìm thiết bị phù hợp',
      ctaLink: '#products',
      imageUrl:
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1600&q=85',
    };

    const all = [homeGymHeroSlide, ...campaignSlides, ...postSlides];
    return all;
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
          <HeroSlider
            slides={slides}
            activeIndex={activeIndex}
            hasCampaign={hasCampaign}
            onPrev={prevSlide}
            onNext={nextSlide}
            onSelect={setCurrentSlide}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />

          {/* Right Side: 2 Stacked Campaign Banners (4 cols) */}
          <HeroPromoCards />
        </div>
      </div>
    </section>
  );
}
