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
      <section className="px-4 pb-6 pt-3 sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[600px] max-w-[1480px] overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-[#032617] text-white shadow-2xl sm:rounded-[36px] border border-slate-800/80 lg:min-h-[680px]">
          {/* Subtle Ambient Radial Gradients */}
          <div className="pointer-events-none absolute -left-40 -top-40 size-[550px] rounded-full bg-emerald-500/15 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 right-10 size-[600px] rounded-full bg-teal-400/10 blur-[140px]" />

          <div className="relative z-10 grid min-h-[600px] items-center gap-8 px-6 py-10 sm:px-10 lg:min-h-[680px] lg:grid-cols-[1.1fr_0.9fr] lg:px-14 xl:px-16">
            {/* Left Column: Hero Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                  <BadgeCheck className="size-4 text-emerald-400" />
                  DCTD INNOVATION LAB · CHÍNH HÃNG 100%
                </span>
                <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur sm:inline-flex">
                  ⭐ 4.9/5 (1,200+ đánh giá)
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-[52px] xl:text-[60px] leading-[1.12]">
                Xây không gian tập <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  chuẩn vận động viên
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base sm:leading-7">
                Trang bị thiết bị thể thao thế hệ mới: Thiết kế công thái học, chịu tải công nghiệp,
                bảo hành chính hãng 24/7 và giao hỏa tốc từ showroom gần nhất.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="#products"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/25 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-emerald-500/40"
                >
                  <span>Khám phá thiết bị</span>
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#shop-by-sport"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:border-emerald-400/40 hover:bg-white/10"
                >
                  <Play className="size-3.5 fill-current text-emerald-400" /> Chọn theo môn tập
                </Link>
              </div>

              {/* Metrics & Trust Highlights */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:gap-6">
                <div>
                  <strong className="block text-2xl font-black text-white sm:text-3xl">500+</strong>
                  <span className="text-xs font-semibold text-slate-400">Thiết bị tiêu chuẩn</span>
                </div>
                <div>
                  <strong className="block text-2xl font-black text-emerald-400 sm:text-3xl">2 Giờ</strong>
                  <span className="text-xs font-semibold text-slate-400">Giao & ráp tận nơi</span>
                </div>
                <div>
                  <strong className="block text-2xl font-black text-white sm:text-3xl">5 Năm</strong>
                  <span className="text-xs font-semibold text-slate-400">Bảo hành khung thép</span>
                </div>
              </div>
            </div>

            {/* Right Column: Real-time Interactive 3D Experience */}
            <div className="relative flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-[540px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/60 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
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
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[.22em] text-emerald-400">DCTD Training Lab</p>
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

      {/* Floating Action Buttons */}
      <FloatingActions />
    </StorefrontLayout>
  );
}
