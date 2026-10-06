import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/foundation/components/navigation';
import {
  ProductShowcase,
  loadCatalogFirstPage,
  toBreadcrumbJsonLd,
  toCategorySeoDescription,
} from '@/features/catalog';
import { CategoryTopBanners, loadActiveBanners } from '@/features/content';
import { listCatalogCategories } from '@/generated/api/catalog/catalog';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';
import { BannerPlacement } from '@/generated/api/content/content.schemas';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { serializeJsonLd } from '@/lib/seo/json-ld';

// ISR 2 phút: cây danh mục và số sản phẩm đổi trong ngày, không cần gọi API mỗi lượt xem.
export const revalidate = 120;

// Không build trước slug nào; trả mảng rỗng để Next render lần đầu theo yêu cầu rồi cache theo
// `revalidate` (ISR). Thiếu hàm này route `[slug]` bị coi là dynamic và bỏ qua `revalidate`.
export function generateStaticParams() {
  return [];
}

// Metadata, danh mục và danh mục cha từng gọi `listCatalogCategories` ba lần mỗi request;
// `cache` gộp lại thành một lượt trong cùng request.
const loadCategories = cache(() => listCatalogCategories());

async function loadCategory(slug: string): Promise<CatalogCategoryDto | undefined> {
  try {
    const list = await loadCategories();
    return list.items.find((item) => item.slug === slug);
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await loadCategory(slug);
  if (!category) return { title: 'Danh mục' };

  return buildPageMetadata({
    title: category.name,
    description: toCategorySeoDescription(category.name, category.description),
    path: `/category/${category.slug}`,
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // GAP: `CatalogCategoryDto` công khai chưa có `id` nên chưa lọc được banner riêng của danh mục;
  // tạm chỉ hiện banner CATEGORY_TOP áp cho mọi danh mục (API trả khi không gửi `categoryId`).
  // Banner không phụ thuộc danh mục nên gọi song song với cây danh mục; hàm không bao giờ reject.
  const topBannersPromise = loadActiveBanners(BannerPlacement.CATEGORY_TOP);
  // Slug không có trong cây danh mục là đường dẫn sai; dựng tiêu đề từ slug sẽ tạo ra
  // một trang danh mục không tồn tại và vẫn trả HTTP 200 cho công cụ tìm kiếm.
  const category = await loadCategory(slug);
  if (!category) notFound();

  const [parent, topBanners, firstPage] = await Promise.all([
    category.parentSlug ? loadCategory(category.parentSlug) : Promise.resolve(undefined),
    topBannersPromise,
    // Trang 1 có trong HTML (ISR) để công cụ tìm kiếm thấy thẻ sản phẩm và link chi tiết.
    loadCatalogFirstPage({ category: slug }),
  ]);

  // Breadcrumb hiển thị và JSON-LD dùng chung danh sách để không lệch nhau.
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    ...(parent ? [{ label: parent.name, href: `/category/${parent.slug}` }] : []),
    { label: category.name, href: `/category/${category.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(toBreadcrumbJsonLd(breadcrumbItems)) }}
      />
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6"
            items={breadcrumbItems}
          />

          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 p-8 text-white shadow-xl sm:p-12">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-3xl font-black text-white sm:text-5xl">{category.name}</h1>
              {category.description && (
                <p className="mt-3 text-sm leading-relaxed text-stone-300 sm:text-base">
                  {category.description}
                </p>
              )}
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-brand-300">
                {category.productCount} sản phẩm
              </p>
            </div>

            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-brand-500/10 blur-[100px]" />
          </div>

          <CategoryTopBanners banners={topBanners} />

          <div className="mt-12">
            <div className="mb-6 border-b border-stone-200/80 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Sản phẩm thuộc {category.name}
              </span>
            </div>

            <ProductShowcase
              categorySlug={slug}
              initialPage={firstPage?.page}
              initialPageFetchedAt={firstPage?.fetchedAt}
            />
          </div>
        </main>
      </div>
    </>
  );
}
