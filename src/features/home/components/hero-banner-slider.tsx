import Image from 'next/image';
import { BANNER_DEFAULT_CTA_TEXT, BannerPicture, type BannerView, type ContentPostView } from '@/features/content';
import { HeroBannerCarousel } from './hero-banner-carousel';
import { HeroPromoCards } from './hero-promo-cards';
import type { HeroSlide } from './hero-slider';

/** Số bài viết tối đa lên slider; phần còn lại vẫn ở khối "Bài viết mới". */
const MAX_POST_SLIDES = 3;

/** Ảnh nền một slide (server render); slide không ảnh thì chỉ có nền gradient của khung. */
function HeroSlideBackground({ slide, index }: { slide: HeroSlide; index: number }) {
  if (!slide.imageUrl) return null;
  const hasText = Boolean(slide.badge || slide.title || slide.subtitle);
  return (
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
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/65 to-transparent sm:from-neutral-950/95 sm:via-neutral-950/50" />
      )}
    </div>
  );
}

/**
 * Slider trang chủ chỉ dựng từ dữ liệu thật: bài viết đã đăng có ảnh bìa (server truyền xuống,
 * cùng chu kỳ ISR của `/`). Flash sale không lên slider: khi có chiến dịch, `HomeTopSection` thay
 * hẳn hero bằng khối flash sale.
 * Bản trước đọc `MOCK_HERO_SLIDES` với mức giảm giá và quà tặng viết cứng. Không có gì để
 * hiển thị thì dùng một slide thương hiệu tĩnh, không kèm giá hay phần trăm.
 *
 * Banner CMS (HOME_HERO, `heroBanners`) và thẻ bên phải (HOME_PROMO, `promoBanners`) do server
 * truyền xuống; có banner thì banner đứng đầu slider, không có thì slider/thẻ giữ nguyên như cũ.
 *
 * Server component: dữ liệu slide, ảnh nền và thẻ bên phải render ở server; chỉ trạng thái slide,
 * autoplay, vuốt và nút điều hướng nằm trong client island `HeroBannerCarousel`.
 */
export function HeroBannerSlider({
  posts = [],
  heroBanners = [],
  promoBanners = [],
}: {
  posts?: ContentPostView[];
  heroBanners?: BannerView[];
  promoBanners?: BannerView[];
}) {
  const bannerSlides: HeroSlide[] = heroBanners.map((banner) => ({
    id: `banner-${banner.id}`,
    title: banner.title,
    subtitle: banner.subtitle,
    ctaText: banner.ctaText ?? BANNER_DEFAULT_CTA_TEXT,
    ctaLink: banner.targetUrl,
    imageUrl: banner.desktopImageUrl,
    mobileImageUrl: banner.mobileImageUrl,
  }));
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
  const homeGymHeroSlide: HeroSlide = {
    id: 'home-gym-solution',
    badge: 'GIẢI PHÁP HOME GYM CHUYÊN NGHIỆP',
    title: 'Biến Góc Nhỏ Thành Phòng Tập Chuẩn Huấn Luyện',
    subtitle:
      'Thiết bị thể lực & cardio chính hãng từ 500K • Tư vấn theo diện tích 5m² – 20m² • Giao toàn quốc, lắp đặt tận nơi hàng cồng kềnh.',
    ctaText: 'Tìm thiết bị phù hợp',
    ctaLink: '#products',
    imageUrl:
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1600&q=85',
  };

  // Banner CMS là dữ liệu server nên đứng đầu cũng không làm slide đầu của HTML SSR bị thay.
  const slides: HeroSlide[] = [...bannerSlides, homeGymHeroSlide, ...postSlides];

  return (
    <HeroBannerCarousel
      // Client chỉ cần phần chữ/nút; URL ảnh đã nằm trong `backgrounds`.
      slides={slides.map(({ imageUrl: _imageUrl, mobileImageUrl: _mobileImageUrl, ...content }) => content)}
      backgrounds={slides.map((slide, index) => (
        <HeroSlideBackground key={slide.id} slide={slide} index={index} />
      ))}
      promo={
        /* Right Side: 2 Stacked Campaign Banners (4 cols) */
        <HeroPromoCards banners={promoBanners} />
      }
    />
  );
}
