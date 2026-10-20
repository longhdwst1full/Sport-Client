import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BenefitsStrip } from '@/widgets/benefits-strip/benefits-strip';
import { SectionHeading } from '@/foundation/components/structure/section-heading';
import { ProductShowcaseLazy, toCategoryCardView, toCategoryRailView } from '@/features/catalog';
import { CATALOG_PAGE_SIZE } from '@/features/catalog';
import { listCatalogProducts } from '@/generated/api/catalog/catalog';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';
import { listPublishedPosts } from '@/generated/api/content/content';
import { ContentStoriesLazy } from '@/features/content';
import { POLICY_POST_TYPE, toContentPostView, type BannerView } from '@/features/content';
import { ProductReviewsLazy } from '@/features/reviews';
import { HeroBannerSlider } from '../components/hero-banner-slider';
import { QuickGoalNavigation } from '../components/quick-goal-navigation';
import { BudgetNavigation } from '../components/budget-navigation';
import { TrustSocialProof } from '../components/trust-social-proof';
import { SmartFitAdvisorLazy } from '../components/smart-fit-advisor/smart-fit-advisor-lazy';
import { CategoryVisualShowcase } from '../components/category-visual-showcase';
import type { FlashSaleInitialData } from '@/features/promotions';
import { HomeTopSection } from '../components/home-top-section';
import { STORE_CONFIG } from '@/shared/constants';
import { Reveal } from '@/foundation/components/motion';

/** Số thẻ "theo bộ môn" và số lối tắt nhóm sản phẩm; chọn theo `productCount` thật. */
const SPORT_CARD_COUNT = 4;
/** Số danh mục lớn trên rail trang chủ. */
const CATEGORY_RAIL_COUNT = 8;
const QUICK_LINK_COUNT = 8;

/** Nhãn nhỏ trên tiêu đề khối, cùng kiểu `SectionHeading`. */
const EYEBROW_CLASS = 'eyebrow text-neutral-900';

/** Hiện dần khối dưới màn hình đầu khi cuộn tới (một lần); hero không reveal để giữ LCP. */
const SECTION_REVEAL = { durationMs: 650, rootMargin: '-60px' } as const;
/** Tiêu đề khối: trượt lên + vạch nhấn trước nhãn eyebrow được vẽ ra. */
const HEADING_REVEAL = { ...SECTION_REVEAL, accent: true } as const;

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

/**
 * Danh mục và banner do route truyền vào (cache dùng chung với layout, xem
 * `app/(storefront)/_data/public-data.ts`). Danh mục rỗng khi API lỗi: các khối dựa trên nó ẩn hẳn.
 */
export async function HomePage({
  categories,
  heroBanners,
  promoBanners,
  flashSales,
}: {
  categories: CatalogCategoryDto[];
  heroBanners: BannerView[];
  promoBanners: BannerView[];
  /** Chiến dịch flash sale đang chạy (server lấy sẵn); có thì flash sale thay hero ở đầu trang. */
  flashSales?: FlashSaleInitialData;
}) {
  const [heroPosts, showcase] = await Promise.all([loadHeroPosts(), loadShowcaseFirstPage()]);
  // Rail chỉ lấy danh mục gốc có sản phẩm (tối đa 8) thay vì toàn bộ ~60 danh mục kể cả lá.
  const categoryRail = categories
    .filter((category) => !category.parentSlug && category.productCount > 0)
    .sort((left, right) => right.productCount - left.productCount)
    .slice(0, CATEGORY_RAIL_COUNT)
    .map(toCategoryRailView);
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
    <main>
        {/* H1 duy nhất của trang chủ: hero là slider nhiều slide (mỗi slide một h2, nội dung đổi theo CMS)
            nên không có tiêu đề cố định để làm h1. Ẩn trực quan, giữ cho trình đọc màn hình và SEO. */}
        <h1 className="sr-only">
          {STORE_CONFIG.name} — {STORE_CONFIG.tagline}
        </h1>

        {/* Thứ tự: flash sale (nếu đang chạy) hoặc hero → rail danh mục → bán chạy → khối danh mục
            → tin cậy/showroom → tin tức. */}
        {/* 1. Có flash sale đang chạy thì khối flash sale đứng đầu, hero (banner CMS + bài viết) ngay dưới; không thì chỉ hero. */}
        <HomeTopSection
          initialFlashSales={flashSales}
          banner={<HeroBannerSlider posts={heroPosts} heroBanners={heroBanners} promoBanners={promoBanners} />}
        />

        {/* 2. Rail icon danh mục (dữ liệu thật từ API). */}
        {categoryRail.length > 0 ? <CategoryVisualShowcase items={categoryRail} /> : null}

        {/* 3. Sản phẩm nổi bật & bán chạy. */}
        {/* Một lối "xem tất cả" cho khối này: banner cuối lưới (sang /products); bỏ link danh mục ở đầu khối
            vì rail danh mục ngay phía trên đã có. */}
        <section id="products" className="page-section">
          <Reveal {...HEADING_REVEAL} className="mb-6">
            <p className={EYEBROW_CLASS}>Thiết bị bán chạy</p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
              Sản Phẩm Nổi Bật & Bán Chạy
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-2xl">
              Khám phá trang thiết bị thể lực, cardio, bóng bàn, bóng rổ và võ thuật chính hãng được đông đảo khách hàng và huấn luyện viên tin chọn
            </p>
          </Reveal>

          <ProductShowcaseLazy
            initialPage={showcase?.page}
            initialPageFetchedAt={showcase?.fetchedAt}
          />
        </section>

        {/* 4. Khối danh mục: theo mục tiêu tập, theo bộ môn (danh mục gốc), theo ngân sách/nhóm con.
            QuickGoal và Budget giữ riêng: dữ liệu và mục đích khác nhau, gộp không đơn giản. */}
        <QuickGoalNavigation />

        {sportCards.length > 0 && (
          <section id="shop-by-sport" className="page-section">
            <Reveal {...HEADING_REVEAL}>
              <SectionHeading eyebrow="Tìm nhanh theo bộ môn" title="Bạn muốn tập luyện bộ môn nào?" />
            </Reveal>
            {/* Thẻ sáng: ô icon đỏ nhận diện, icon lớn mờ làm nền góc, "Xem ngay" trượt khi hover; mobile 2 cột. */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {sportCards.map(({ slug, title, itemCountLabel, icon: Icon }) => (
                <Reveal key={slug} {...SECTION_REVEAL} variant="zoom-in" stagger className="flex">
                  <Link
                    href={`/category/${slug}`}
                    className="group relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card focus-ring sm:min-h-[180px] sm:p-6"
                  >
                    <Icon
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-5 -right-5 size-24 text-neutral-100 transition-all duration-500 group-hover:-rotate-12 group-hover:scale-110 group-hover:text-brand-50 sm:size-32"
                    />
                    <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-600 transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />

                    <div className="relative grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white sm:size-14">
                      <Icon className="size-5 sm:size-7" aria-hidden="true" />
                    </div>

                    <div className="relative mt-4 flex flex-1 flex-col sm:mt-6">
                      <h3 className="text-sm font-bold leading-snug text-neutral-950 sm:text-lg">{title}</h3>
                      <p className="mt-1 text-xs font-medium text-neutral-500 sm:text-sm">{itemCountLabel}</p>
                      <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-brand-700 sm:text-sm">
                        Xem ngay
                        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:size-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <BudgetNavigation quickLinks={quickLinks} />

        {/* 5. Cam kết dịch vụ + bằng chứng tin cậy & hệ thống showroom. */}
        <BenefitsStrip />

        <TrustSocialProof />

        {/* Đánh giá sản phẩm — `ProductReviews` trả null khi chưa có đánh giá; `empty:hidden` để
            section rỗng không còn chiếm 128–160px padding trước footer. */}
        <section className="page-section empty:hidden">
          {featuredProductSlug ? <ProductReviewsLazy productSlug={featuredProductSlug} /> : null}
        </section>

        {/* Đã gỡ dải "thương hiệu đồng hành" và bộ đếm số liệu (showroom, khách hàng, sản phẩm):
            cả hai là số liệu/đối tác viết cứng, không có nguồn dữ liệu nào xác nhận. */}

        {/* 6. Smart Fit Advisor — wizard client nặng, lazy-load dưới màn hình đầu (placeholder SSR giữ chiều cao). */}
        <SmartFitAdvisorLazy />

        {/* 7. Tin tức — chỉ hiển thị khi có bài viết thật. */}
        {heroPosts.length > 0 && (
          <section id="stories" className="page-section">
            <Reveal {...HEADING_REVEAL}>
              <SectionHeading eyebrow="Kiến thức luyện tập" title="Bài viết mới" />
            </Reveal>
            <ContentStoriesLazy initialPosts={heroPosts} />
          </section>
        )}
    </main>
  );
}
