import { cache } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Images } from 'lucide-react';
import type { Metadata } from 'next';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ProductPurchasePanel, ProductRelatedSection } from '@/features/catalog';
import { siteUrl, STORE_CONFIG } from '@/shared/constants';
import {
  hasOfferPrice,
  toProductGalleryView,
  toProductPurchaseView,
} from '@/features/catalog/model/product.mapper';
import { ProductReviewSection } from '@/features/reviews';
import { getCatalogProduct, listCatalogCategories } from '@/generated/api/catalog/catalog';
import { ApiError } from '@/lib/api/fetcher';
import { Breadcrumb } from '@/foundation/components/navigation';

// ISR 2 phút: trang public đọc nhiều, giá ở đây chỉ để tham khảo vì bước báo giá checkout
// luôn tính lại. `revalidate = 0` trước đây bắt mọi lượt xem gọi API tới hai lần.
export const revalidate = 120;

// `generateMetadata` và page chạy trong cùng một request; `cache` gộp hai lượt gọi làm một.
const loadProduct = cache((slug: string) => getCatalogProduct(slug));

/**
 * `ProductDetailDto` chỉ có tên danh mục chính, trong khi lọc sản phẩm liên quan cần slug.
 * Tra theo tên trong cây danh mục; không khớp hoặc API lỗi thì trả undefined (liên quan chung).
 */
const loadCategorySlugByName = cache(async (name: string | undefined) => {
  if (!name) return undefined;
  try {
    const { items } = await listCatalogCategories();
    return items.find((item) => item.name === name)?.slug;
  } catch {
    return undefined;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // CONTRACT: metadata đọc thẳng từ API. API lỗi thì trả metadata tối thiểu,
  // không dựng tên/mô tả/ảnh của một sản phẩm không tồn tại.
  let product: Awaited<ReturnType<typeof getCatalogProduct>> | undefined;
  try {
    product = await loadProduct(slug);
  } catch {
    return { title: 'Sản phẩm — Bảo An Sport' };
  }

  // Không gắn "Trả Góp 0%" vào tiêu đề: contract không có gói trả góp theo sản phẩm.
  const title = `${product.name} — Bảo An Sport`;
  const description = product.shortDescription;
  // Sản phẩm chưa có ảnh thì bỏ hẳn thẻ ảnh thay vì chèn ảnh của sản phẩm khác.
  const images = product.imageUrl
    ? [{ url: product.imageUrl, width: 1200, height: 630, alt: product.name }]
    : undefined;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website', ...(images ? { images } : {}) },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(product.imageUrl ? { images: [product.imageUrl] } : {}),
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: Awaited<ReturnType<typeof getCatalogProduct>>;
  try {
    product = await loadProduct(slug);
  } catch (error) {
    // Không còn fallback sang dữ liệu mẫu: hiển thị sản phẩm không tồn tại còn
    // tệ hơn báo lỗi, vì khách có thể đặt mua thứ cửa hàng không bán.
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  // CONTRACT: `ProductDetailDto` chưa có trường thông số kỹ thuật. Bản trước
  // hiển thị một bảng cố định cho MỌI sản phẩm — gồm cả tải trọng, kích thước và
  // chứng nhận CE/EN957 — tức là công bố thông số và chứng nhận không có thật.
  // Chỉ hiển thị những gì API thực sự trả về.
  const TECH_SPECS: Array<{ label: string; value: string }> = [
    ...(product.brand ? [{ label: 'Thương hiệu', value: product.brand }] : []),
    ...(product.primaryCategory ? [{ label: 'Phân loại', value: product.primaryCategory }] : []),
    // Thông số từ từ điển thuộc tính của API (nhãn/đơn vị đã ghép sẵn), theo thứ tự Admin sắp.
    ...product.specifications.map((spec) => ({
      label: spec.name,
      value: spec.values.map(({ label }) => label).join(' / '),
    })),
    { label: 'Mã sản phẩm', value: product.productNo },
    ...(product.variants.length > 1
      ? [{ label: 'Số phiên bản', value: `${product.variants.length} phiên bản` }]
      : []),
  ];

  // Dữ liệu có cấu trúc gửi cho công cụ tìm kiếm phải đúng sự thật. Bản trước khai cứng
  // `aggregateRating` 4.9 với 128 đánh giá, luôn báo còn hàng và bịa giá 1.890.000 khi sản
  // phẩm chưa có bảng giá — không trường nào trong số đó có nguồn dữ liệu.
  const purchaseView = toProductPurchaseView(product);
  const gallery = toProductGalleryView(product);
  const [mainImage, ...extraImages] = gallery;
  const relatedCategorySlug = await loadCategorySlugByName(product.primaryCategory);
  // Mô tả lưu dạng văn bản thuần; React tự escape. Chưa có sanitizer trong repo nên không
  // dùng dangerouslySetInnerHTML. Bỏ phần mô tả dài nếu trùng nguyên văn mô tả ngắn.
  const shortDescription = product.shortDescription?.trim();
  const longDescription = product.description?.trim();
  const showLongDescription = Boolean(longDescription && longDescription !== shortDescription);
  // Có biến thể mở bán mới khai `offers`; `minPrice` có thể thuộc biến thể đã ngừng bán.
  const hasPrice =
    hasOfferPrice(product.minPrice) && purchaseView.variants.some(({ sellable }) => sellable);
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.shortDescription,
    sku: product.productNo || product.slug,
    brand: {
      '@type': 'Brand',
      name: product.brand || STORE_CONFIG.name,
    },
    // Chưa có giá thì không khai `offers`: khai giá 0 hoặc giá bịa đều sai lệch kết quả
    // tìm kiếm. Điểm đánh giá và tồn kho hiện chưa có trong contract nên không khai.
    ...(hasPrice
      ? {
          offers: {
            '@type': 'Offer',
            url: siteUrl(`/products/${product.slug}`),
            priceCurrency: product.currency,
            price: product.minPrice,
            itemCondition: 'https://schema.org/NewCondition',
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: siteUrl(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sản phẩm',
        item: siteUrl('/products'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: siteUrl(`/products/${product.slug}`),
      },
    ],
  };

  return (
    <StorefrontLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="bg-[var(--dc-canvas)] pb-24">
        <Breadcrumb
          className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Sản phẩm', href: '/products' },
            { label: product.name },
          ]}
        />
        {/* Main Product Title Header */}
        <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            {product.brand && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700">
                {product.brand}
              </span>
            )}
            {product.primaryCategory && (
              <span>
                Danh mục: <strong className="text-slate-700">{product.primaryCategory}</strong>
              </span>
            )}
            <span>
              Mã SP: <strong className="text-slate-700">{product.productNo}</strong>
            </span>
          </div>
        </div>

        {/* Main Product Stage */}
        <main className="mx-auto mt-4 grid max-w-7xl gap-8 px-4 py-3 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:px-8">
          {/* Left Column: Visual Showcase & Technical Detail */}
          <div className="space-y-8">
            {/* Product media is image-first. Heavy 3D rendering is intentionally excluded here. */}
            <div className="overflow-hidden rounded-[28px] border border-[var(--dc-border)] bg-white shadow-[0_18px_50px_rgba(0,49,41,0.08)]">
              <div className="flex items-center justify-between border-b border-[var(--dc-border)] px-5 py-3.5">
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--dc-primary-700)]">
                  <Images className="size-4" aria-hidden="true" />
                  Hình ảnh sản phẩm
                </span>
                {gallery.length > 1 && (
                  <span className="text-xs font-semibold text-[var(--dc-text-secondary)]">
                    {gallery.length} ảnh
                  </span>
                )}
              </div>
              <div className="relative aspect-[4/3] bg-gradient-to-br from-white to-[var(--dc-primary-50)] sm:aspect-[16/11]">
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain p-4 transition duration-500 hover:scale-[1.02] sm:p-8"
                />
              </div>
              {/* Ảnh phụ từ `media[]`: render ở server, bấm để mở ảnh gốc; không cần JS cho gallery. */}
              {extraImages.length > 0 && (
                <ul className="grid grid-cols-4 gap-2 border-t border-[var(--dc-border)] p-3 sm:grid-cols-6 sm:gap-3 sm:p-4">
                  {extraImages.map((image, index) => (
                    <li key={image.id}>
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block aspect-square overflow-hidden rounded-xl border border-[var(--dc-border)] bg-white transition hover:border-[var(--dc-primary-500)]"
                        aria-label={`Xem ảnh ${index + 2} của ${product.name}`}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 110px"
                          className="object-contain p-1.5"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Product Story / Description — chỉ hiện nội dung API trả về, không có văn mẫu dự phòng. */}
            {(shortDescription || showLongDescription) && (
              <div className="rounded-[28px] border border-[var(--dc-border)] bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-black text-ink sm:text-2xl">Mô tả sản phẩm</h2>
                {shortDescription && (
                  <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                    {shortDescription}
                  </p>
                )}
                {showLongDescription && (
                  <div className="mt-4 whitespace-pre-line break-words text-sm leading-relaxed text-stone-600 sm:text-base">
                    {longDescription}
                  </div>
                )}
              </div>
            )}

            {/* Technical Specifications Table */}
            {TECH_SPECS.length > 0 && (
            <div className="rounded-[28px] border border-[var(--dc-border)] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black text-ink sm:text-2xl">Thông số kỹ thuật chi tiết</h2>
              <div className="mt-6 divide-y divide-stone-100 rounded-2xl border border-stone-100 bg-stone-50/50">
                {TECH_SPECS.map(({ label, value }: { label: string; value: string }) => (
                  <div key={label} className="grid grid-cols-1 gap-1 sm:grid-cols-[1fr_1.3fr] sm:gap-4 px-4 py-3.5 text-xs sm:px-6 sm:text-sm">
                    <span className="font-bold text-stone-500">{label}</span>
                    <span className="font-semibold text-ink">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Customer Rating & Reviews Summary */}
            <ProductReviewSection productName={product.name} productSlug={slug} />
          </div>

          {/* Right Column: Sticky Purchase Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductPurchasePanel product={purchaseView} />
          </div>
        </main>

        {/* Related Products ("Cùng loại"), Flash Sale & Category List */}
        <ProductRelatedSection currentSlug={product.slug} categorySlug={relatedCategorySlug} />
      </div>
    </StorefrontLayout>
  );
}
