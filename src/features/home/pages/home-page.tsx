import Link from 'next/link';
import { MoveUpRight } from 'lucide-react';
import { BenefitsStrip } from '@/widgets/benefits-strip/benefits-strip';
import { SectionHeading } from '@/foundation/components/structure/section-heading';
import { ProductShowcase, toCategoryCardView, toCategoryRailView } from '@/features/catalog';
import { CATALOG_PAGE_SIZE } from '@/features/catalog';
import { listCatalogCategories, listCatalogProducts } from '@/generated/api/catalog/catalog';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';
import { listPublishedPosts } from '@/generated/api/content/content';
import { ContentStories } from '@/features/content';
import {
  loadActiveBanners,
  POLICY_POST_TYPE,
  toContentPostView,
} from '@/features/content';
import { BannerPlacement } from '@/generated/api/content/content.schemas';
import { ProductReviews } from '@/features/reviews';
import { HeroBannerSlider } from '../components/hero-banner-slider';
import { QuickGoalNavigation } from '../components/quick-goal-navigation';
import { BudgetNavigation } from '../components/budget-navigation';
import { TrustSocialProof } from '../components/trust-social-proof';
import { SmartFitAdvisorLazy } from '../components/smart-fit-advisor/smart-fit-advisor-lazy';
import { CategoryVisualShowcase } from '../components/category-visual-showcase';
import { FlashSaleSection } from '@/features/promotions';
import { STORE_CONFIG } from '@/shared/constants';

/** Số thẻ "theo bộ môn" và số lối tắt nhóm sản phẩm; chọn theo `productCount` thật. */
const SPORT_CARD_COUNT = 4;
const QUICK_LINK_COUNT = 8;

/** Khoảng đệm dọc chung cho mọi khối trang chủ (không cộng thêm margin) để nhịp trang đều. */
const SECTION_CLASS = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10';
/** Nhãn nhỏ trên tiêu đề khối, cùng kiểu `SectionHeading`. */
const EYEBROW_CLASS = 'text-xs font-black uppercase tracking-[.2em] text-slate-900';

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
  const [categories, heroPosts, showcase, heroBanners, promoBanners] = await Promise.all([
    loadCategories(),
    loadHeroPosts(),
    loadShowcaseFirstPage(),
    loadActiveBanners(BannerPlacement.HOME_HERO),
    loadActiveBanners(BannerPlacement.HOME_PROMO),
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
    <main>
        {/* H1 duy nhất của trang chủ: hero là slider nhiều slide (mỗi slide một h2, nội dung đổi theo CMS)
            nên không có tiêu đề cố định để làm h1. Ẩn trực quan, giữ cho trình đọc màn hình và SEO. */}
        <h1 className="sr-only">
          {STORE_CONFIG.name} — {STORE_CONFIG.tagline}
        </h1>

        {/* Thứ tự tham chiếu elipsport/thegioididong: hero → rail danh mục → flash sale → bán chạy
            → khối danh mục → tin cậy/showroom → tin tức. */}
        {/* 1. Hero: banner CMS (nếu có) + bài viết thật + flash sale đang chạy. */}
        <HeroBannerSlider posts={heroPosts} heroBanners={heroBanners} promoBanners={promoBanners} />

        {/* 2. Rail icon danh mục (dữ liệu thật từ API). */}
        {categoryRail.length > 0 ? <CategoryVisualShowcase items={categoryRail} /> : null}

        {/* 3. Flash sale — tự ẩn khi không có chiến dịch đang mở. */}
        <FlashSaleSection />

        {/* 4. Sản phẩm nổi bật & bán chạy. */}
        {/* Một lối "xem tất cả" cho khối này: banner cuối lưới (sang /products); bỏ link danh mục ở đầu khối
            vì rail danh mục ngay phía trên đã có. */}
        <section id="products" className={SECTION_CLASS}>
          <div className="mb-6">
            <p className={EYEBROW_CLASS}>Thiết bị bán chạy</p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Sản Phẩm Nổi Bật & Bán Chạy
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
              Khám phá trang thiết bị thể lực, cardio, bóng bàn, bóng rổ và võ thuật chính hãng được đông đảo khách hàng và huấn luyện viên tin chọn
            </p>
          </div>

          <ProductShowcase
            initialPage={showcase?.page}
            initialPageFetchedAt={showcase?.fetchedAt}
          />
        </section>

        {/* 5. Khối danh mục: theo mục tiêu tập, theo bộ môn (danh mục gốc), theo ngân sách/nhóm con.
            QuickGoal và Budget giữ riêng: dữ liệu và mục đích khác nhau, gộp không đơn giản. */}
        <QuickGoalNavigation />

        {sportCards.length > 0 && (
          <section id="shop-by-sport" className={SECTION_CLASS}>
            <SectionHeading eyebrow="Tìm nhanh theo bộ môn" title="Bạn muốn tập luyện bộ môn nào?" />
            {/* Thẻ sáng (không còn 4 khối tối liền nhau trước trust/smart-fit); mobile 2 cột gọn. */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {sportCards.map(({ slug, title, itemCountLabel, icon: Icon }) => (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  className="group flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 sm:min-h-[160px] sm:p-6"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-800 sm:size-12">
                      <Icon className="size-5 sm:size-6" aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 sm:text-xs">
                      {itemCountLabel}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black leading-snug sm:text-xl">{title}</h3>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 group-hover:text-slate-900">
                      Khám phá ngay <MoveUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <BudgetNavigation quickLinks={quickLinks} />

        {/* 6. Cam kết dịch vụ + bằng chứng tin cậy & hệ thống showroom. */}
        <BenefitsStrip />

        <TrustSocialProof />

        {/* Đánh giá sản phẩm — `ProductReviews` trả null khi chưa có đánh giá; `empty:hidden` để
            section rỗng không còn chiếm 128–160px padding trước footer. */}
        <section className={`${SECTION_CLASS} empty:hidden`}>
          {featuredProductSlug ? <ProductReviews productSlug={featuredProductSlug} /> : null}
        </section>

        {/* Đã gỡ dải "thương hiệu đồng hành" và bộ đếm số liệu (showroom, khách hàng, sản phẩm):
            cả hai là số liệu/đối tác viết cứng, không có nguồn dữ liệu nào xác nhận. */}

        {/* 7. Smart Fit Advisor — wizard client nặng, lazy-load dưới màn hình đầu (placeholder SSR giữ chiều cao). */}
        <SmartFitAdvisorLazy />

        {/* 8. Tin tức — chỉ hiển thị khi có bài viết thật. */}
        {heroPosts.length > 0 && (
          <section id="stories" className={SECTION_CLASS}>
            <SectionHeading eyebrow="Kiến thức luyện tập" title="Bài viết mới" />
            <ContentStories initialPosts={heroPosts} />
          </section>
        )}
    </main>
  );
}
