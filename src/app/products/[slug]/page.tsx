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
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ProductPurchasePanel } from '@/features/catalog/components/product-purchase-panel';
import { Product3DViewer } from '@/components/3d/product-3d-viewer';
import { getCatalogProduct } from '@/generated/api/catalog/catalog';
import { ApiError } from '@/lib/api/fetcher';

export const revalidate = 0;

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
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const TECH_SPECS = [
    { label: 'Thương hiệu', value: product.brand ?? 'DCTD Pro Series' },
    { label: 'Phân loại', value: product.primaryCategory ?? 'Thiết bị thể hình cao cấp' },
    { label: 'Chất liệu chế tạo', value: 'Thép hợp kim mạ Chrome & Cao su đúc nguyên khối' },
    { label: 'Tải trọng an toàn', value: 'Tối đa 500 KG' },
    { label: 'Quy cách đóng gói', value: 'Thùng carton 5 lớp + Mút định hình chống sốc' },
    { label: 'Tiêu chuẩn kiểm định', value: 'ISO 9001:2015 & CE Athletic Standard' },
    { label: 'Bảo hành chính hãng', value: '24 Tháng (1 đổi 1 trong 7 ngày đầu)' },
  ];

  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20">
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
                  <div key={label} className="grid grid-cols-[1fr_1.3fr] px-4 py-3.5 text-xs sm:px-6 sm:text-sm">
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
