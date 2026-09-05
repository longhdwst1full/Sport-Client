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
import { FloatingActions } from '@/widgets/floating-actions/floating-actions';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { SectionHeading } from '@/foundation/components/section-heading';
import { ProductShowcase } from '@/features/catalog/components/product-showcase';
import { ContentStories } from '@/features/content/components/content-stories';
import { ProductReviews } from '@/features/reviews/components/product-reviews';
import { Hero3DScene } from '@/components/3d/hero-3d-scene';
import { TrainingSpaceGuide } from './components/training-space-guide';
import { BrandPartners } from './components/brand-partners';
import { StatsCounter } from './components/stats-counter';

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
      {/* Elevated Hero Section with Interactive 3D Studio */}
      <section className="px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[640px] max-w-[1480px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0c130f] via-[#141e18] to-[#0a0f0c] text-white shadow-2xl sm:rounded-[44px] lg:min-h-[720px]">
          {/* Subtle Ambient Radial Gradients */}
          <div className="pointer-events-none absolute -left-40 -top-40 size-[500px] rounded-full bg-emerald-500/15 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 right-20 size-[600px] rounded-full bg-emerald-400/10 blur-[140px]" />

          <div className="relative z-10 grid min-h-[640px] items-center gap-8 px-6 py-12 sm:px-10 lg:min-h-[720px] lg:grid-cols-[1.1fr_0.9fr] lg:px-16 xl:px-20">
            {/* Left Column: Hero Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                  <BadgeCheck className="size-4 text-emerald-400" />
                  DCTD INNOVATION LAB · CHÍNH HÃNG 100%
                </span>
                <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 backdrop-blur sm:inline-flex">
                  ⭐ 4.9/5 (1,200+ đánh giá)
                </span>
              </div>

              <h1 className="text-balance text-4xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-[72px]">
                Xây không gian tập <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  chuẩn vận động viên.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg sm:leading-8">
                Trang bị thiết bị thể thao thế hệ mới: Thiết kế công thái học, chịu tải công nghiệp,
                bảo hành chính hãng 24/7 và giao hỏa tốc từ showroom gần nhất.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="#products"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-emerald-400 px-8 py-4 text-base font-black text-ink shadow-lg shadow-emerald-400/25 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-emerald-400/40"
                >
                  <span>Khám phá thiết bị</span>
                  <ArrowRight className="size-5 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#shop-by-sport"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 font-bold text-white backdrop-blur-md transition hover:border-emerald-400/40 hover:bg-white/10"
                >
                  <Play className="size-4 fill-current text-emerald-400" /> Chọn theo môn tập
                </Link>
              </div>

              {/* Metrics & Trust Highlights */}
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/15 pt-7 sm:gap-6">
                <div>
                  <strong className="block text-2xl font-black text-white sm:text-3xl">500+</strong>
                  <span className="text-xs font-medium text-white/60 sm:text-sm">Thiết bị tiêu chuẩn</span>
                </div>
                <div>
                  <strong className="block text-2xl font-black text-emerald-400 sm:text-3xl">2 Giờ</strong>
                  <span className="text-xs font-medium text-white/60 sm:text-sm">Giao & ráp tận nơi</span>
                </div>
                <div>
                  <strong className="block text-2xl font-black text-white sm:text-3xl">5 Năm</strong>
                  <span className="text-xs font-medium text-white/60 sm:text-sm">Bảo hành khung thép</span>
                </div>
              </div>
            </div>

            {/* Right Column: Real-time Interactive 3D Experience */}
            <div className="relative flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-[560px] overflow-hidden rounded-[32px] border border-white/15 bg-black/40 p-2 shadow-2xl backdrop-blur-xl">
                <Hero3DScene />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Strip */}
      <BenefitsStrip />

      {/* Brand Partners Carousel */}
      <BrandPartners />

      {/* Popular Search Tags */}
      <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-10" aria-label="Tìm kiếm phổ biến">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="mr-2 font-bold text-stone-500">Được tìm nhiều:</span>
          {['Máy chạy bộ gia đình', 'Tạ điều chỉnh', 'Combo home gym', 'Thảm yoga', 'Đồ tập'].map(
            (keyword) => (
              <Link
                key={keyword}
                href="#products"
                className="rounded-full border border-ink/10 bg-white px-4 py-2 font-semibold transition hover:border-brand-600 hover:text-brand-600"
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
              className={`group relative overflow-hidden rounded-[28px] bg-ink ${index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={image}
                  alt={`Khám phá sản phẩm ${title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-55"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <Icon className="mb-4 size-8 text-emerald-300" />
                  <h3 className="text-2xl font-black">{title}</h3>
                  <p className="mt-1 text-sm text-white/65">{description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Khám phá <MoveUpRight className="size-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Training Space Guide */}
      <TrainingSpaceGuide />

      {/* Stats Counter */}
      <StatsCounter />

      {/* Featured Products */}
      <section id="products" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <SectionHeading
          eyebrow="Tuyển chọn cho bạn"
          title="Sản phẩm nổi bật"
          action={
            <Link href="#stories" className="hidden items-center gap-2 font-bold md:flex">
              Xem hướng dẫn chọn hàng <ArrowRight className="size-4" />
            </Link>
          }
        />
        <ProductShowcase />
      </section>

      {/* Training Lab CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="grid overflow-hidden rounded-[36px] bg-[#d9ff45] lg:grid-cols-[1fr_.9fr]">
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <Trophy className="size-11" />
            <p className="mt-8 text-sm font-black uppercase tracking-[.22em]">DCTD Training Lab</p>
            <h2 className="mt-3 max-w-xl text-4xl font-black leading-tight sm:text-5xl">Không chỉ bán thiết bị. Chúng tôi giúp bạn chọn đúng.</h2>
            <p className="mt-5 max-w-xl leading-7 text-ink/70">Diện tích, mục tiêu, tần suất tập và ngân sách đều ảnh hưởng đến lựa chọn. Bắt đầu từ hướng dẫn thực tế trước khi đặt mua.</p>
            <Link href="#stories" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-bold text-white">Xem kiến thức luyện tập <ArrowRight className="size-4" /></Link>
          </div>
          <div className="relative min-h-[360px] lg:min-h-[520px]">
            <Image
              src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=1200&q=85"
              alt="Huấn luyện viên tư vấn bài tập với thiết bị"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
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

      {/* Floating Action Buttons */}
      <FloatingActions />
    </StorefrontLayout>
  );
}
