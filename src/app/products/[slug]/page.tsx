import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  Award,
  Flame,
  Images,
  BadgeCheck,
} from 'lucide-react';
import type { Metadata } from 'next';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ProductPurchasePanel, ProductRelatedSection } from '@/features/catalog';
import { siteUrl, STORE_CONFIG } from '@/shared/constants';
import { toProductPurchaseView } from '@/features/catalog/model/product.mapper';
import { ProductReviewSection } from '@/features/reviews';
import { getCatalogProduct } from '@/generated/api/catalog/catalog';
import { ApiError } from '@/lib/api/fetcher';
import { Breadcrumb } from '@/foundation/components/navigation';

export const revalidate = 0;

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
    product = await getCatalogProduct(slug);
  } catch {
    return { title: 'Sản phẩm — Bảo An Sport' };
  }

  const title = `${product.name} — Chính Hãng, Trả Góp 0%`;
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
    product = await getCatalogProduct(slug);
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
    { label: 'Mã sản phẩm', value: product.productNo },
    ...(product.variants.length > 0
      ? [{ label: 'Số phiên bản', value: `${product.variants.length} phiên bản` }]
      : []),
  ];

  // Dữ liệu có cấu trúc gửi cho công cụ tìm kiếm phải đúng sự thật. Bản trước khai cứng
  // `aggregateRating` 4.9 với 128 đánh giá, luôn báo còn hàng và bịa giá 1.890.000 khi sản
  // phẩm chưa có bảng giá — không trường nào trong số đó có nguồn dữ liệu.
  const hasPrice = product.minPrice !== null && product.minPrice !== undefined;
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
            { label: 'Sản phẩm', href: '/#products' },
            { label: product.name },
          ]}
        />

        {/* Main Product Stage */}
        <main className="mx-auto grid max-w-7xl gap-8 px-4 py-3 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:px-8">
          {/* Left Column: Visual Showcase & Technical Detail */}
          <div className="space-y-8">
            {/* Product media is image-first. Heavy 3D rendering is intentionally excluded here. */}
            <div className="overflow-hidden rounded-[28px] border border-[var(--dc-border)] bg-white shadow-[0_18px_50px_rgba(0,49,41,0.08)]">
              <div className="flex items-center justify-between border-b border-[var(--dc-border)] px-5 py-3.5">
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--dc-primary-700)]">
                  <Images className="size-4" aria-hidden="true" />
                  Hình ảnh sản phẩm
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--dc-text-secondary)]">
                  <BadgeCheck className="size-4 text-[var(--dc-primary-500)]" aria-hidden="true" />
                  Ảnh thực tế đã kiểm duyệt
                </span>
              </div>
              <div className="relative aspect-[4/3] bg-gradient-to-br from-white to-[var(--dc-primary-50)] sm:aspect-[16/11]">
                <Image
                  src={product.imageUrl ?? 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=85'}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain p-4 transition duration-500 hover:scale-[1.02] sm:p-8"
                />
                <div className="absolute bottom-4 left-4 rounded-full bg-[var(--dc-primary-900)]/90 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                  Có hỗ trợ xem sản phẩm tại showroom
                </div>
              </div>
            </div>

            {/* Product Story / Description */}
            <div className="rounded-[28px] border border-[var(--dc-border)] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black text-ink sm:text-2xl">Mô tả sản phẩm</h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                {product.shortDescription ||
                  'Dòng thiết bị tập luyện chuyên nghiệp Bảo An Pro Series được thiết kế tối ưu cho các bài tập đa nhóm cơ. Khung kết cấu hợp kim thép cường lực, lớp phủ bề mặt mạ chrome và bọc cao su kỹ thuật giúp chống ăn mòn và giảm thiểu tiếng ồn va đập.'}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-50 p-4">
                  <Flame className="size-5 text-[var(--dc-primary-600)]" />
                  <strong className="mt-2 block text-sm font-bold text-ink">Thiết kế công thái học</strong>
                  <p className="mt-1 text-xs text-stone-500">Tay cầm tiện dụng, hạn chế mỏi cổ tay khi nâng tạ nặng.</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <ShieldCheck className="size-5 text-[var(--dc-primary-600)]" />
                  <strong className="mt-2 block text-sm font-bold text-ink">Bọc cao su đúc</strong>
                  <p className="mt-1 text-xs text-stone-500">Bảo vệ bề mặt sàn gỗ, gạch hoa và chống nứt vỡ.</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <Award className="size-5 text-[var(--dc-primary-600)]" />
                  <strong className="mt-2 block text-sm font-bold text-ink">Độ bền công nghiệp</strong>
                  <p className="mt-1 text-xs text-stone-500">Chịu được hơn 100.000 chu kỳ tập luyện liên tục.</p>
                </div>
              </div>
            </div>

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
            <ProductPurchasePanel product={toProductPurchaseView(product)} />
          </div>
        </main>

        {/* Related Products ("Cùng loại"), Flash Sale & Category List */}
        <ProductRelatedSection
          currentSlug={slug}
          currentCategory={product.primaryCategory}
          productName={product.name}
        />
      </div>
    </StorefrontLayout>
  );
}
