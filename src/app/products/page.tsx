import Link from 'next/link';
import {
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgePercent,
} from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ProductShowcase } from '@/features/catalog/components/product-showcase';
import { FlashSaleSection } from '@/features/home/components/flash-sale-section';

export const metadata = {
  title: 'Tất cả thiết bị & Phụ kiện thể thao — DCTD Sport',
  description:
    'Danh mục trọn bộ thiết bị tập gym, máy chạy bộ, xe đạp thể thao và phụ kiện chính hãng đạt chuẩn vận động viên.',
};

export default function ProductsPage() {
  return (
    <StorefrontLayout>
      <div className="bg-slate-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-emerald-700">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="font-bold text-slate-900">Tất cả sản phẩm</span>
          </nav>

          {/* Catalog Hero Banner */}
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-slate-950 via-slate-900 to-[#032617] p-8 text-white shadow-xl sm:p-12">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                <Sparkles className="size-3.5" /> Kho thiết bị chính hãng DCTD
              </span>
              <h1 className="mt-4 text-3xl font-black text-white sm:text-5xl">
                Thiết Bị Thể Thao Chuẩn Thi Đấu
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                Tuyển chọn hơn 400+ thiết bị rèn luyện sức mạnh, cardio tốc độ cao và phụ kiện phục hồi cơ bắp. Đạt chứng chỉ kiểm định an toàn tải trọng khắt khe.
              </p>
            </div>

            {/* Ambient blur lighting */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-emerald-500/15 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-10 right-1/4 size-60 rounded-full bg-emerald-400/10 blur-[80px]" />
          </div>

          {/* Quick Value Props Strip */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { icon: Truck, title: 'Giao & Lắp đặt', desc: 'Miễn phí tại nhà' },
              { icon: ShieldCheck, title: 'Bảo hành 2-5 năm', desc: 'Chính hãng tại chỗ' },
              { icon: RotateCcw, title: 'Đổi mới 7 ngày', desc: 'Nếu lỗi sản xuất' },
              { icon: BadgePercent, title: 'Trả góp 0%', desc: 'Thủ tục duyệt 5 phút' },
            ].map((prop, i) => {
              const Icon = prop.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <strong className="block truncate text-xs font-bold text-slate-900">
                      {prop.title}
                    </strong>
                    <span className="block truncate text-[11px] text-slate-500">{prop.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Category Quick Filters & Sorting Bar */}
          <div className="mt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: 'Tất cả sản phẩm', href: '/products', active: true },
                  { label: 'Gym & Sức mạnh', href: '/category/gym-fitness', active: false },
                  { label: 'Chạy bộ & Cardio', href: '/category/chay-bo-cardio', active: false },
                  { label: 'Bóng đá', href: '/category/bong-da', active: false },
                  { label: 'Yoga & Phục hồi', href: '/category/yoga-phuc-hoi', active: false },
                ].map((tag) => (
                  <Link
                    key={tag.label}
                    href={tag.href}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      tag.active
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                    }`}
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="text-slate-400">Sắp xếp:</span>
                <select className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm outline-none focus:border-emerald-500">
                  <option>Bán chạy nhất</option>
                  <option>Giá: Thấp đến Cao</option>
                  <option>Giá: Cao đến Thấp</option>
                  <option>Mới ra mắt</option>
                </select>
              </div>
            </div>

            {/* Product Grid Showcase */}
            <ProductShowcase />
          </div>

          {/* Flash Deals Banner for Catalog */}
          <div className="mt-16 overflow-hidden rounded-[32px]">
            <FlashSaleSection />
          </div>
        </main>
      </div>
    </StorefrontLayout>
  );
}
