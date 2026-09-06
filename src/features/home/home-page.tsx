import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Dumbbell,
  Footprints,
  Goal,
  HeartPulse,
  MoveUpRight,
  Play,
  Trophy,
} from 'lucide-react';
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

import { STORE_CONFIG } from '@/constants';

const SPORT_CATEGORIES = [
  {
    title: 'Gym & Fitness',
    description: 'Tạ, ghế tập và phụ kiện',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
    icon: Dumbbell,
  },
  {
    title: 'Chạy bộ',
    description: 'Trang bị cho từng cung đường',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=85',
    icon: Footprints,
  },
  {
    title: 'Bóng đá',
    description: 'Bóng, giày và đồ tập',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=85',
    icon: Goal,
  },
  {
    title: 'Yoga & Phục hồi',
    description: 'Tập đúng, hồi phục tốt',
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=85',
    icon: HeartPulse,
  },
] as const;

export function HomePage() {
  return (
    <StorefrontLayout>
      {/* Event Promotion Announcement Modal */}
      <EventAnnouncementModal />

      {/* Modern E-commerce Hero Banner Slider & Promo Cards */}
      <HeroBannerSlider />

      {/* Core Service Commitments Strip */}
      <BenefitsStrip />

      {/* Visual Sports Category Showcase with Real Product Images */}
      <CategoryVisualShowcase />

      {/* Live Flash Sale Section */}
      <FlashSaleSection />

      {/* Brand Partners Carousel */}
      <BrandPartners />

      {/* Popular Search Tags */}
      <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-10" aria-label="Tìm kiếm phổ biến">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="mr-2 font-bold text-slate-500">Được tìm nhiều:</span>
          {['Máy chạy bộ gia đình', 'Tạ điều chỉnh', 'Combo home gym', 'Thảm yoga', 'Đồ tập'].map(
            (keyword) => (
              <Link
                key={keyword}
                href="#products"
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700"
              >
                {keyword}
              </Link>
            ),
          )}
        </div>
      </section>

      {/* Shop by Sport */}
      <section id="shop-by-sport" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <SectionHeading eyebrow="Tìm nhanh hơn" title="Bạn muốn tập gì hôm nay?" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPORT_CATEGORIES.map(({ title, description, image, icon: Icon }, index) => (
            <Link
              key={title}
              href="#products"
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
                  <h3 className="text-2xl font-black">{title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-400">Khám phá <MoveUpRight className="size-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Training Space Guide */}
      <TrainingSpaceGuide />

      {/* Gym Project Turnkey Solutions Planner */}
      <GymProjectPlanner />

      {/* Stats Counter */}
      <StatsCounter />

      {/* Featured Products */}
      <section id="products" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <SectionHeading
          eyebrow="Tuyển chọn cho bạn"
          title="Sản phẩm nổi bật"
          action={
            <Link href="#stories" className="hidden items-center gap-2 font-bold text-emerald-700 hover:text-emerald-800 md:flex">
              Xem hướng dẫn chọn hàng <ArrowRight className="size-4" />
            </Link>
          }
        />
        <ProductShowcase />
      </section>

      {/* Training Lab CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
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

      {/* Product Reviews */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <ProductReviews />
      </section>

      {/* Content Stories */}
      <section id="stories" className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <SectionHeading eyebrow="Kiến thức luyện tập" title="Bài viết mới" />
        <ContentStories />
      </section>
    </StorefrontLayout>
  );
}
