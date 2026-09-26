import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MoveUpRight, Sparkles, Trophy } from 'lucide-react';
import { BenefitsStrip } from '@/widgets/benefits-strip/benefits-strip';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { SectionHeading } from '@/foundation/components/section-heading';
import { ProductShowcase, toCategoryCardView, toCategoryRailView } from '@/features/catalog';
import { CATALOG_PAGE_SIZE } from '@/features/catalog/model/product.mapper';
import { listCatalogCategories, listCatalogProducts } from '@/generated/api/catalog/catalog';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';
import { listPublishedPosts } from '@/generated/api/content/content';
import { ContentStories } from '@/features/content';
import {
  POLICY_POST_TYPE,
  toContentPostView,
} from '@/features/content/model/content-post.mapper';
import { ProductReviews } from '@/features/reviews';
import { HeroBannerSlider } from '../components/hero-banner-slider';
import { CategoryVisualShowcase } from '../components/category-visual-showcase';
import { FlashSaleSection } from '@/features/promotions';

/** Số thẻ "theo bộ môn" và số lối tắt nhóm sản phẩm; chọn theo `productCount` thật. */
const SPORT_CARD_COUNT = 4;
const QUICK_LINK_COUNT = 8;

async function loadCategories(): Promise<CatalogCategoryDto[]> {
  try {
    const { items } = await listCatalogCategories();
    return items;
  } catch {
    // Danh mục là nội dung phụ trợ: API lỗi thì các khối dựa trên nó ẩn hẳn, không chặn trang chủ.
    return [];
  }
}

/** Bài viết đã đăng (trừ trang chính sách) cho slider; API lỗi thì slider dùng slide thương hiệu. */
async function loadHeroPosts() {
  try {
    const { items } = await listPublishedPosts();
    return items.filter((post) => post.postType !== POLICY_POST_TYPE).map(toContentPostView);
  } catch {
    return [];
  }
}

/**
 * Trang 1 của lưới "Tất cả" lấy ở server để HTML SSR có sản phẩm thay vì chỉ có skeleton;
 * cùng `limit` với hook client nên client dùng lại làm `initialData`. Khối đánh giá trang chủ
 * cũng lấy slug sản phẩm thật từ đây (API chưa có endpoint tổng hợp đánh giá).
 * API lỗi thì trả undefined: lưới tự tải lại ở client, khối đánh giá ẩn.
 */
async function loadShowcaseFirstPage() {
  try {
    const page = await listCatalogProducts({ page: 1, limit: CATALOG_PAGE_SIZE.SHOWCASE });
    return { page, fetchedAt: Date.now() };
  } catch {
    return undefined;
  }
}

export async function HomePage() {
  const [categories, heroPosts, showcase] = await Promise.all([
    loadCategories(),
    loadHeroPosts(),
    loadShowcaseFirstPage(),
  ]);
  const categoryRail = categories.map(toCategoryRailView);
  const featuredProductSlug = showcase?.page.items[0]?.slug;
  const byProductCount = (left: CatalogCategoryDto, right: CatalogCategoryDto) =>
    right.productCount - left.productCount;
  // Thẻ "theo bộ môn": danh mục gốc có sản phẩm, nhiều sản phẩm nhất. Chưa có ảnh danh mục trong
  // DB nên dùng icon trung tính thay cho ảnh stock (ảnh stock trông như ảnh sản phẩm thật).
  const sportCards = categories
    .filter((category) => !category.parentSlug && category.productCount > 0)
    .sort(byProductCount)
    .slice(0, SPORT_CARD_COUNT)
    .map(toCategoryCardView);
  // Lối tắt thay cho "Từ khóa tìm nhiều" viết cứng: API không có thống kê tìm kiếm, nên chỉ
  // liệt kê nhóm sản phẩm con có nhiều sản phẩm nhất và gọi đúng tên như vậy.
  const quickLinks = categories
    .filter((category) => category.parentSlug && category.productCount > 0)
    .sort(byProductCount)
    .slice(0, QUICK_LINK_COUNT);

  return (
    <StorefrontLayout>
      {/* 1. Hero: bài viết thật + flash sale đang chạy. Popup voucher đã gỡ vì chưa có API voucher. */}
      <HeroBannerSlider posts={heroPosts} />

      {/* 3. Core Service Commitments Strip */}
      <BenefitsStrip />

      {/* 4. Visual Sports Category Showcase with Real Product Images */}
      {categoryRail.length > 0 ? <CategoryVisualShowcase items={categoryRail} /> : null}

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
            href="/category"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
          >
            <span>Xem tất cả danh mục</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <ProductShowcase
          initialPage={showcase?.page}
          initialPageFetchedAt={showcase?.fetchedAt}
        />
      </section>

      {/* 7. Lối tắt nhóm sản phẩm (từ cây danh mục thật) */}
      {quickLinks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12" aria-label="Nhóm sản phẩm">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70">
            <span className="mr-2 font-bold text-slate-500 text-xs">Nhóm sản phẩm nhiều lựa chọn:</span>
            {quickLinks.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 8. Shop by Sport — danh mục gốc thật, thay cho 4 thẻ viết cứng kèm ảnh stock */}
      {sportCards.length > 0 && (
        <section id="shop-by-sport" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-slate-100">
          <SectionHeading eyebrow="Tìm nhanh theo bộ môn" title="Bạn muốn tập luyện bộ môn nào?" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sportCards.map(({ slug, title, description, itemCountLabel, icon: Icon }) => (
              <Link
                key={slug}
                href={`/category/${slug}`}
                className="group flex min-h-[220px] flex-col justify-end rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Icon className="mb-4 size-8 text-emerald-400" aria-hidden="true" />
                <h3 className="text-xl sm:text-2xl font-black">{title}</h3>
                {description && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-300">{description}</p>
                )}
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {itemCountLabel}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-400">
                  Khám phá ngay <MoveUpRight className="size-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 9–10. Đã gỡ "Training Space Guide" và "Gym Project Planner": gói thiết bị, diện tích và
          ngân sách viết cứng, chưa có API nào đứng sau. */}

      {/* 11. Product Reviews */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {featuredProductSlug ? <ProductReviews productSlug={featuredProductSlug} /> : null}
      </section>

      {/* 12. Đã gỡ dải "thương hiệu đồng hành" và bộ đếm số liệu (showroom, khách hàng, sản phẩm):
          cả hai là số liệu/đối tác viết cứng, không có nguồn dữ liệu nào xác nhận. */}

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
