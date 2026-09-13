import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ShieldCheck,
  Award,
  Flame,
  Images,
  BadgeCheck,
} from 'lucide-react';
import type { Metadata } from 'next';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ProductPurchasePanel } from '@/features/catalog/components/product-purchase-panel';
import { ProductRelatedSection } from '@/features/catalog/components/product-related-section';
import { ProductReviewSection } from '@/features/reviews/components/product-review-section';
import { getCatalogProduct } from '@/generated/api/catalog/catalog';
import { ApiError } from '@/lib/api/fetcher';
import { getMockProductDetail } from '@/shared/data/mocks';

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getMockProductDetail(slug) || {
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    shortDescription:
      'Thiết bị thể thao chính hãng Bảo An Sport — Đạt tiêu chuẩn an toàn thể thao châu Âu, bảo hành 2-5 năm, hỗ trợ giao lắp tận nhà.',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85',
  };

  const title = `${product.name} — Chính Hãng, Trả Góp 0%`;
  const description = product.shortDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: product.imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: any;
  try {
    product = await getCatalogProduct(slug);
  } catch (error) {
    const mock = getMockProductDetail(slug);
    if (mock) {
      product = mock;
    } else {
      if (error instanceof ApiError && error.status === 404) notFound();
      throw error;
    }
  }

  const TECH_SPECS = product.techSpecs ?? [
    { label: 'Thương hiệu', value: product.brand ?? 'Bảo An Pro Series' },
    { label: 'Phân loại', value: product.primaryCategory ?? 'Thiết bị thể hình & Home Gym chuyên nghiệp' },
    { label: 'Quy cách khung thép', value: 'Thép hộp cường lực Q235 (độ dày 2.5mm - 3.0mm), sơn tĩnh điện sần' },
    { label: 'Tải trọng chịu lực', value: 'Tối đa 500 KG (Thử nghiệm quá tải chu kỳ 100.000 lần)' },
    { label: 'Kích thước lắp đặt', value: '1450 x 1200 x 2150 mm (Diện tích sàn an toàn tối thiểu 6m²)' },
    { label: 'Vật liệu đệm & tay cầm', value: 'Đệm PU mật độ cao 60mm bọc da Carbon + Tay cầm khía vân Diamond Knurl' },
    { label: 'Tiêu chuẩn kiểm định', value: 'Đạt chứng nhận an toàn thiết bị thể thao Châu Âu CE & EN957' },
    { label: 'Chính sách bảo hành', value: '60 tháng khung thép, 24 tháng linh kiện, 1 đổi 1 trong 7 ngày' },
  ];

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.shortDescription,
    sku: product.productNo || product.slug,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Bảo An Sport',
    },
    offers: {
      '@type': 'Offer',
      url: `https://baoansport.vn/products/${product.slug}`,
      priceCurrency: 'VND',
      price: product.minPrice || '1890000',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://baoansport.vn',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sản phẩm',
        item: 'https://baoansport.vn/products',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://baoansport.vn/products/${product.slug}`,
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
        {/* Breadcrumbs Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-7xl px-4 py-4 text-xs font-semibold text-stone-500 sm:px-6 lg:px-8"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-[var(--dc-primary-700)]">
                Trang chủ
              </Link>
            </li>
            <li>
              <ChevronRight className="size-3 text-stone-400" />
            </li>
            <li>
              <Link href="/#products" className="transition hover:text-[var(--dc-primary-700)]">
                Sản phẩm
              </Link>
            </li>
            <li>
              <ChevronRight className="size-3 text-stone-400" />
            </li>
            <li className="font-bold text-ink">{product.name}</li>
          </ol>
        </nav>

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

            {/* Customer Rating & Reviews Summary */}
            <ProductReviewSection productName={product.name} productSlug={slug} />
          </div>

          {/* Right Column: Sticky Purchase Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductPurchasePanel product={product} />
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
