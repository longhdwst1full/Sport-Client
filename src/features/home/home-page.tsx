import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Goal,
  MoveUpRight,
  Play,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { MOCK_HOME_SPORT_CATEGORIES, MOCK_POPULAR_SEARCH_KEYWORDS } from '@/shared/data/mocks';
import { BenefitsStrip } from '@/widgets/benefits-strip/benefits-strip';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { SectionHeading } from '@/foundation/components/section-heading';
import { ProductShowcase } from '@/features/catalog/components/product-showcase';
import { ContentStories } from '@/features/content/components/content-stories';
import { ProductReviews } from '@/features/reviews/components/product-reviews';
import { EventAnnouncementModal } from './components/event-announcement-modal';
import { HeroBannerSlider } from './components/hero-banner-slider';
import { CategoryVisualShowcase } from './components/category-visual-showcase';
import { TrainingSpaceGuide } from './components/training-space-guide';
import { BrandPartners } from './components/brand-partners';
import { StatsCounter } from './components/stats-counter';
import { FlashSaleSection } from './components/flash-sale-section';
import { GymProjectPlanner } from './components/gym-project-planner';



export function HomePage() {
  return (
    <StorefrontLayout>
      {/* 1. Event Promotion Announcement Modal */}
      <EventAnnouncementModal />

      {/* 2. Modern E-commerce Hero Banner Slider & Promo Cards */}
      <HeroBannerSlider />

      {/* 3. Core Service Commitments Strip */}
      <BenefitsStrip />

      {/* 4. Visual Sports Category Showcase with Real Product Images */}
      <CategoryVisualShowcase />

      {/* 5. Live Flash Sale Section */}
      <FlashSaleSection />

      {/* 6. [CORE REQUIREMENT] Product Selling Lists - NGAY DƯỚI FLASH SALE */}
      <section id="products" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-800 mb-2">
              <Sparkles className="size-3.5" />
              <span>TUYỂN CHỌN THIẾT BỊ BÁN CHẠY NHẤT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Sản Phẩm Nổi Bật & Bán Chạy
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
              Khám phá trang thiết bị thể lực, cardio, bóng bàn, bóng rổ và võ thuật chính hãng được đông đảo khách hàng và huấn luyện viên tin chọn
            </p>
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
          >
            <span>Xem tất cả danh mục (120+)</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <ProductShowcase />
      </section>

      {/* 7. Popular Search Tags */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12" aria-label="Tìm kiếm phổ biến">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70">
          <span className="mr-2 font-bold text-slate-500 text-xs">Từ khóa tìm nhiều:</span>
          {MOCK_POPULAR_SEARCH_KEYWORDS.map((keyword) => (
            <Link
              key={keyword}
              href={`/catalog?search=${encodeURIComponent(keyword)}`}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700"
            >
              {keyword}
            </Link>
          ))}
        </div>
      </section>

      {/* 8. Shop by Sport */}
      <section id="shop-by-sport" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-slate-100">
        <SectionHeading eyebrow="Tìm nhanh theo bộ môn" title="Bạn muốn tập luyện bộ môn nào?" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_HOME_SPORT_CATEGORIES.map(({ title, description, image, icon: Icon }, index) => (
            <Link
              key={title}
              href="/catalog"
              className={`group relative overflow-hidden rounded-[28px] bg-slate-900 ${index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={image}
                  alt={`Khám phá sản phẩm ${title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <Icon className="mb-4 size-8 text-emerald-400" />
                  <h3 className="text-xl sm:text-2xl font-black">{title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-400">
                    Khám phá ngay <MoveUpRight className="size-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. Training Space Guide */}
      <TrainingSpaceGuide />

      {/* 10. Gym Project Turnkey Solutions Planner */}
      <GymProjectPlanner />

      {/* 11. Product Reviews */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <ProductReviews />
      </section>

      {/* 12. Brand Partners & Stats Counter */}
      <BrandPartners />
      <StatsCounter />

      {/* 13. Training Lab CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white border border-slate-800 shadow-xl lg:grid-cols-[1.1fr_.9fr]">
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Trophy className="size-7" />
            </div>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[.22em] text-emerald-400">Bảo An Training Lab</p>
            <h2 className="mt-2 max-w-xl text-3xl font-black leading-tight sm:text-4xl text-white">Không chỉ bán thiết bị. Chúng tôi giúp bạn chọn đúng.</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">Diện tích, mục tiêu, tần suất tập và ngân sách đều ảnh hưởng đến lựa chọn. Bắt đầu từ hướng dẫn thực tế trước khi đặt mua.</p>
            <Link href="#stories" className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400">Xem kiến thức luyện tập <ArrowRight className="size-4" /></Link>
          </div>
          <div className="relative min-h-[360px] lg:min-h-[480px]">
            <Image
              src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=1200&q=85"
              alt="Huấn luyện viên tư vấn bài tập với thiết bị"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover opacity-85"
            />
          </div>
        </div>
      </section>

      {/* 14. Content Stories */}
      <section id="stories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <SectionHeading eyebrow="Kiến thức luyện tập" title="Bài viết mới" />
        <ContentStories />
      </section>
    </StorefrontLayout>
  );
}
