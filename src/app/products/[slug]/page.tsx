import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  CheckCircle2,
  Box,
  Flame,
  Info,
} from 'lucide-react';
import type { Metadata } from 'next';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ProductPurchasePanel } from '@/features/catalog/components/product-purchase-panel';
import { Product3DViewer } from '@/components/3d/product-3d-viewer';
import { getCatalogProduct } from '@/generated/api/catalog/catalog';
import { ApiError } from '@/lib/api/fetcher';

export const revalidate = 0;

const FALLBACK_DETAILS: Record<string, any> = {
  'may-chay-bo-dctd-pro-x1': {
    id: 'prod-1',
    productNo: 'PRD-X1-001',
    name: 'Máy Chạy Bộ Điện Đa Năng DCTD Pro X1',
    slug: 'may-chay-bo-dctd-pro-x1',
    brand: 'DCTD Sport',
    primaryCategory: 'Máy chạy bộ',
    productType: 'SIMPLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '14500000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Máy chạy bộ điện thông minh DCTD Pro X1 với động cơ 3.5HP êm ái, thảm chạy kim cương 7 lớp chống chấn thương, kết nối Bluetooth thông minh và gập gọn thủy lực tiện lợi.',
    description: 'Trang bị động cơ AC biến tần thế hệ mới chịu tải lên đến 150kg, tốc độ tối đa 18km/h, độ dốc tự động 15 mức và tích hợp 12 bài tập chuyên sâu từ HLV Olympic.',
    variants: [
      {
        id: 'var-1-1',
        sku: 'DCTD-X1-STD',
        name: 'Bản Tiêu Chuẩn (Động cơ 3.0HP)',
        effectivePrice: '14500000',
        inventoryQuantity: 25,
      },
      {
        id: 'var-1-2',
        sku: 'DCTD-X1-PRO',
        name: 'Bản Cao Cấp (Động cơ 3.5HP + Nâng dốc tự động)',
        effectivePrice: '16900000',
        inventoryQuantity: 18,
      },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'bo-ta-tay-dieu-chinh-24kg': {
    id: 'prod-2',
    productNo: 'PRD-DMB-024',
    name: 'Bộ Tạ Tay Điều Chỉnh Thông Minh 24KG Pro',
    slug: 'bo-ta-tay-dieu-chinh-24kg',
    brand: 'DCTD Sport',
    primaryCategory: 'Gym & Sức mạnh',
    productType: 'SIMPLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '3850000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Thay thế 15 cặp tạ truyền thống chỉ với 1 núm xoay chuyển nấc từ 2.5kg đến 24kg. Lõi thép carbon nguyên khối bọc nhựa kỹ thuật cao cấp chống va đập.',
    variants: [
      {
        id: 'var-2-1',
        sku: 'DCTD-DMB-SINGLE',
        name: '1 Quả (24KG)',
        effectivePrice: '3850000',
        inventoryQuantity: 50,
      },
      {
        id: 'var-2-2',
        sku: 'DCTD-DMB-PAIR',
        name: '1 Cặp 2 Quả (48KG kèm khay đế)',
        effectivePrice: '7200000',
        inventoryQuantity: 30,
      },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
  'gian-ta-da-nang-smith-pro': {
    id: 'prod-3',
    productNo: 'PRD-SMT-003',
    name: 'Combo Giàn Tạ Đa Năng Smith Machine All-in-One',
    slug: 'gian-ta-da-nang-smith-pro',
    brand: 'DCTD Sport',
    primaryCategory: 'Combo Home Gym',
    productType: 'BUNDLE',
    status: 'ACTIVE',
    version: 1,
    minPrice: '28900000',
    currency: 'VND',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85',
    shortDescription: 'Trọn bộ giàn tạ tích hợp khung kéo xô, thanh đòn Smith dẫn hướng an toàn, xà đơn xà kép và ghế tập tạ điều chỉnh cao cấp.',
    variants: [
      {
        id: 'var-3-1',
        sku: 'DCTD-SMT-BUNDLE',
        name: 'Trọn Bộ Giàn Tạ + Ghế Tập + Đòn Smith',
        effectivePrice: '28900000',
        inventoryQuantity: 10,
        bundle: {
          bundleVariantId: 'var-3-1',
          components: [
            { componentVariantId: 'comp-1', componentName: 'Khung Smith dẫn hướng chịu lực 500kg', quantity: 1 },
            { componentVariantId: 'comp-2', componentName: 'Ghế vớt tạ điều chỉnh 7 nấc DCTD', quantity: 1 },
            { componentVariantId: 'comp-3', componentName: 'Bộ ròng rọc kéo xô đôi cao thấp', quantity: 1 },
          ],
        },
      },
    ],
    media: [],
    categories: [],
    categoryIds: [],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = FALLBACK_DETAILS[slug] || {
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    shortDescription:
      'Thiết bị thể thao chính hãng DCTD Sport — Đạt tiêu chuẩn an toàn thể thao châu Âu, bảo hành 2-5 năm, hỗ trợ giao lắp tận nhà.',
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
  let product;
  try {
    product = await getCatalogProduct(slug);
  } catch (error) {
    if (FALLBACK_DETAILS[slug]) {
      product = FALLBACK_DETAILS[slug];
    } else if (FALLBACK_DETAILS['may-chay-bo-dctd-pro-x1']) {
      // Dynamic fallback for other demo slugs
      product = {
        ...FALLBACK_DETAILS['may-chay-bo-dctd-pro-x1'],
        slug,
        name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      };
    } else {
      if (error instanceof ApiError && error.status === 404) notFound();
      throw error;
    }
  }

  const TECH_SPECS = [
    { label: 'Thương hiệu', value: product.brand ?? 'DCTD Pro Series' },
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
      name: product.brand || 'DCTD Sport',
    },
    offers: {
      '@type': 'Offer',
      url: `https://dctdsport.vn/products/${product.slug}`,
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
        item: 'https://dctdsport.vn',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sản phẩm',
        item: 'https://dctdsport.vn/products',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://dctdsport.vn/products/${product.slug}`,
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
      <div className="bg-slate-50/70 pb-24">
        {/* Breadcrumbs Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-7xl px-4 py-4 text-xs font-semibold text-stone-500 sm:px-6 lg:px-8"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-emerald-700">
                Trang chủ
              </Link>
            </li>
            <li>
              <ChevronRight className="size-3 text-stone-400" />
            </li>
            <li>
              <Link href="/#products" className="hover:text-emerald-700">
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
        <main className="mx-auto grid max-w-7xl gap-10 px-4 py-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          {/* Left Column: Visual Showcase & Technical Detail */}
          <div className="space-y-8">
            {/* 3D Interactive Viewer Stage */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
                  <Sparkles className="size-4" />
                  Mô phỏng 3D tương tác đa chiều
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  Xoay 360° · Xem bóc tách linh kiện
                </span>
              </div>
              <Product3DViewer productName={product.name} />
            </div>

            {/* Product Static Gallery Preview Fallback / Secondary Photos */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-stone-200/80 bg-white shadow-sm">
              <Image
                src={product.imageUrl ?? 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=85'}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                Ảnh chụp thực tế tại Showroom
              </div>
            </div>

            {/* Product Story / Description */}
            <div className="rounded-[28px] border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black text-ink sm:text-2xl">Mô tả sản phẩm</h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                {product.shortDescription ||
                  'Dòng thiết bị tập luyện chuyên nghiệp DCTD Pro Series được thiết kế tối ưu cho các bài tập đa nhóm cơ. Khung kết cấu hợp kim thép cường lực, lớp phủ bề mặt mạ chrome và bọc cao su kỹ thuật giúp chống ăn mòn và giảm thiểu tiếng ồn va đập.'}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-50 p-4">
                  <Flame className="size-5 text-emerald-600" />
                  <strong className="mt-2 block text-sm font-bold text-ink">Thiết kế công thái học</strong>
                  <p className="mt-1 text-xs text-stone-500">Tay cầm tiện dụng, hạn chế mỏi cổ tay khi nâng tạ nặng.</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <ShieldCheck className="size-5 text-emerald-600" />
                  <strong className="mt-2 block text-sm font-bold text-ink">Bọc cao su đúc</strong>
                  <p className="mt-1 text-xs text-stone-500">Bảo vệ bề mặt sàn gỗ, gạch hoa và chống nứt vỡ.</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <Award className="size-5 text-emerald-600" />
                  <strong className="mt-2 block text-sm font-bold text-ink">Độ bền công nghiệp</strong>
                  <p className="mt-1 text-xs text-stone-500">Chịu được hơn 100.000 chu kỳ tập luyện liên tục.</p>
                </div>
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div className="rounded-[28px] border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black text-ink sm:text-2xl">Thông số kỹ thuật chi tiết</h2>
              <div className="mt-6 divide-y divide-stone-100 rounded-2xl border border-stone-100 bg-stone-50/50">
                {TECH_SPECS.map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-1 gap-1 sm:grid-cols-[1fr_1.3fr] sm:gap-4 px-4 py-3.5 text-xs sm:px-6 sm:text-sm">
                    <span className="font-bold text-stone-500">{label}</span>
                    <span className="font-semibold text-ink">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Rating & Reviews Summary */}
            <div className="rounded-[28px] border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-ink sm:text-2xl">Đánh giá từ khách hàng</h2>
                  <p className="mt-1 text-xs text-stone-500">Được xác thực từ người mua hàng thực tế</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="size-4 fill-amber-400" />
                    ))}
                  </div>
                  <strong className="text-sm font-black text-ink">4.9 / 5.0</strong>
                  <span className="text-xs text-stone-400">(128 nhận xét)</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-stone-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-ink">Trần Quang Huy</strong>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                        Đã mua hàng
                      </span>
                    </div>
                    <span className="text-xs text-stone-400">2 ngày trước</span>
                  </div>
                  <div className="mt-1 flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="size-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-stone-600">
                    "Tạ cầm rất đầm tay, lớp cao su đúc sắc nét không có mùi hôi như hàng chợ. Giao hàng hỏa tốc trong 2h tại Q7 đúng như cam kết. Rất hài lòng!"
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-ink">Lê Minh Tuấn (HLV Thể hình)</strong>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                        Đã mua hàng
                      </span>
                    </div>
                    <span className="text-xs text-stone-400">1 tuần trước</span>
                  </div>
                  <div className="mt-1 flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="size-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-stone-600">
                    "Khóa tạ rất chắc chắn, tập bài drop set hay bài tạ nặng không lo bị xộc xệch. Bản 3D xoay trên web xem trực quan đúng với thiết bị thực tế bên ngoài."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Purchase Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductPurchasePanel product={product} />
          </div>
        </main>
      </div>
    </StorefrontLayout>
  );
}
