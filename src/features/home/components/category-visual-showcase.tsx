'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  count: string;
  href: string;
  imageUrl: string;
  badge?: string;
}

const VISUAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-may-chay-bo',
    name: 'Máy Chạy Bộ',
    count: '35+ mẫu máy',
    href: '/catalog?category=may-chay-bo',
    imageUrl: '/images/categories/may-chay-bo.jpg',
    badge: 'Bán chạy',
  },
  {
    id: 'cat-xe-dap-tap',
    name: 'Xe Đạp Tập',
    count: '28+ mẫu xe',
    href: '/catalog?category=xe-dap-tap',
    imageUrl: '/images/categories/xe-dap-tap.jpg',
    badge: 'Ưu đãi 30%',
  },
  {
    id: 'cat-gym',
    name: 'Dụng Cụ Gym',
    count: '64+ thiết bị',
    href: '/catalog?category=dung-cu-tap-gym',
    imageUrl: '/images/categories/dung-cu-tap-gym.jpg',
    badge: 'Chuyên nghiệp',
  },
  {
    id: 'cat-bong-ban',
    name: 'Dụng Cụ Bóng Bàn',
    count: '42+ sản phẩm',
    href: '/catalog?category=dung-cu-bong-ban',
    imageUrl: '/images/categories/dung-cu-bong-ban.jpg',
    badge: 'Chuẩn ITTF',
  },
  {
    id: 'cat-bong-ro',
    name: 'Dụng Cụ Bóng Rổ',
    count: '25+ sản phẩm',
    href: '/catalog?category=dung-cu-bong-ro',
    imageUrl: '/images/categories/dung-cu-bong-ro.jpg',
  },
  {
    id: 'cat-vo-thuat',
    name: 'Dụng Cụ Võ Thuật',
    count: '30+ sản phẩm',
    href: '/catalog?category=dung-cu-vo-thuat',
    imageUrl: '/images/categories/dung-cu-vo-thuat.jpg',
  },
  {
    id: 'cat-yoga',
    name: 'Dụng Cụ Yoga',
    count: '18+ sản phẩm',
    href: '/catalog?category=dung-cu-yoga',
    imageUrl: '/images/categories/dung-cu-yoga.jpg',
  },
  {
    id: 'cat-cau-long',
    name: 'Dụng Cụ Cầu Lông',
    count: '22+ sản phẩm',
    href: '/catalog?category=dung-cu-cau-long',
    imageUrl: '/images/categories/dung-cu-cau-long.jpg',
  },
  {
    id: 'cat-bong-da',
    name: 'Dụng Cụ Bóng Đá',
    count: '19+ sản phẩm',
    href: '/catalog?category=dung-cu-bong-da',
    imageUrl: '/images/categories/dung-cu-bong-da.jpg',
  },
  {
    id: 'cat-may-bung',
    name: 'Máy Tập Cơ Bụng',
    count: '16+ sản phẩm',
    href: '/catalog?category=may-tap-the-duc',
    imageUrl: '/images/categories/may-tap-bung.jpg',
  },
  {
    id: 'cat-may-chan',
    name: 'Máy Tập Cơ Chân',
    count: '12+ sản phẩm',
    href: '/catalog?category=may-tap-the-duc',
    imageUrl: '/images/categories/may-tap-co-chan.jpg',
  },
];

export function CategoryVisualShowcase() {
  return (
    <section
      id="categories"
      className="py-10 bg-slate-50/60 border-y border-slate-200/80"
      aria-label="Danh mục ngành hàng thể thao"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-800 mb-2">
              <Layers className="size-3.5" />
              <span>DANH MỤC THIẾT BỊ BẢO AN SPORT</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Sản Phẩm Theo Danh Mục Ngành Hàng
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Khám phá đầy đủ trang thiết bị thể thao chính hãng, sẵn sàng phục vụ tại hệ thống showroom
            </p>
          </div>

          <Link
            href="/catalog"
            className="group inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 hover:text-emerald-800 transition"
          >
            <span>Xem tất cả danh mục</span>
            <ChevronRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid (responsive: 2 cols on mobile, 3-4 on tablet, 6 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {VISUAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/10 text-center"
            >
              {/* Optional Promotion Badge */}
              {cat.badge && (
                <span className="absolute top-2 right-2 rounded-md bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                  {cat.badge}
                </span>
              )}

              {/* Category Thumbnail Image with gentle circular frame */}
              <div className="relative size-20 sm:size-24 rounded-2xl bg-slate-50 border border-slate-100 p-2 overflow-hidden transition duration-300 group-hover:border-emerald-200 group-hover:bg-emerald-50/50">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="96px"
                  className="object-contain p-1 transition duration-500 group-hover:scale-110"
                />
              </div>

              {/* Category Name & Product Count */}
              <h3 className="mt-3 text-xs sm:text-sm font-bold text-slate-800 transition group-hover:text-emerald-700 leading-tight">
                {cat.name}
              </h3>
              <span className="mt-0.5 text-[11px] font-semibold text-slate-400 group-hover:text-slate-500">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
