import Link from 'next/link';
import {
  Filter,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ProductShowcase } from '@/features/catalog/components/product-showcase';

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const categoryName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs font-semibold text-stone-500">
            <Link href="/" className="hover:text-emerald-700">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href="/category" className="hover:text-emerald-700">Danh mục</Link>
            <span className="mx-2">/</span>
            <span className="font-bold text-ink">{categoryName}</span>
          </nav>

          {/* Category Banner */}
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0c1410] via-[#141f17] to-[#0a100d] p-8 text-white shadow-xl sm:p-12">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                <Sparkles className="size-3.5" /> Bộ sưu tập chọn lọc
              </span>
              <h1 className="mt-4 text-3xl font-black text-white sm:text-5xl">
                Thiết bị {categoryName}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-stone-300 sm:text-base">
                Các sản phẩm đạt tiêu chuẩn an toàn thể thao châu Âu, bảo hành chính hãng từ 2 đến 5 năm, hỗ trợ giao hàng và lắp đặt tận nơi.
              </p>
            </div>

            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-emerald-500/10 blur-[100px]" />
          </div>

          {/* Content & Product Showcase */}
          <div className="mt-12">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Danh sách thiết bị thể thao
              </span>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="text-stone-400">Sắp xếp theo:</span>
                <select className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm outline-none">
                  <option>Bán chạy nhất</option>
                  <option>Giá: Thấp đến Cao</option>
                  <option>Giá: Cao đến Thấp</option>
                  <option>Mới ra mắt</option>
                </select>
              </div>
            </div>

            <ProductShowcase categorySlug={slug} />
          </div>
        </main>
      </div>
    </StorefrontLayout>
  );
}
