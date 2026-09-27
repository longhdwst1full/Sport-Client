'use client';

import Link from 'next/link';
import { Banknote, ChevronRight, Tag, Sparkles, ArrowRight } from 'lucide-react';

interface BudgetTier {
  id: string;
  label: string;
  sublabel: string;
  tag: string;
  badgeClass: string;
  href: string;
}

const BUDGET_TIERS: BudgetTier[] = [
  {
    id: 'under-500k',
    label: 'Dưới 500K',
    sublabel: 'Dây kháng lực, con lăn, găng tay & phụ kiện',
    tag: 'Tiết kiệm',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    href: '/products?maxPrice=500000',
  },
  {
    id: '500k-2m',
    label: '500K – 2 Triệu',
    sublabel: 'Tạ tay, đòn tạ, xà đơn, thảm tập cao cấp',
    tag: 'Tập tại nhà',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
    href: '/products?minPrice=500000&maxPrice=2000000',
  },
  {
    id: '2m-5m',
    label: '2 – 5 Triệu',
    sublabel: 'Ghế tập tạ đa năng, trụ đấm, bàn bóng bàn mini',
    tag: 'Bán chạy',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
    href: '/products?minPrice=2000000&maxPrice=5000000',
  },
  {
    id: 'over-5m',
    label: 'Trên 5 Triệu',
    sublabel: 'Máy chạy bộ, giàn tạ khối, xe đạp thể lực',
    tag: 'Cao cấp',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/60',
    href: '/products?minPrice=5000000',
  },
];

export interface BudgetNavigationProps {
  quickLinks?: { name: string; slug: string }[];
}

export function BudgetNavigation({ quickLinks = [] }: BudgetNavigationProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14" aria-label="Tìm kiếm theo ngân sách">
      <div className="rounded-3xl border border-slate-200/90 bg-slate-50/80 p-6 sm:p-8 md:p-10 shadow-sm shadow-slate-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
          <div className="flex items-center gap-3.5">
            <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25">
              <Banknote className="size-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Tìm thiết bị theo mức ngân sách của bạn
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                Dễ dàng lựa chọn giải pháp tập luyện phù hợp với khả năng chi trả và mục tiêu thể lực
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
          >
            <span>Xem tất cả mức giá</span>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Budget Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BUDGET_TIERS.map((tier) => (
            <Link
              key={tier.id}
              href={tier.href}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-slate-200/60 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${tier.badgeClass}`}>
                    <Tag className="size-3" />
                    {tier.tag}
                  </span>
                </div>
                <strong className="block text-xl font-black text-slate-900 group-hover:text-emerald-700 transition">
                  {tier.label}
                </strong>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {tier.sublabel}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs font-bold text-slate-700 group-hover:text-emerald-700 transition">
                <span>Xem danh sách</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 text-slate-400 group-hover:text-emerald-600" />
              </div>
            </Link>
          ))}
        </div>

        {/* Seamlessly Integrated Popular Category Quick Links */}
        {quickLinks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200/80">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Sparkles className="size-3.5 text-emerald-600" />
                <span>Nhóm sản phẩm được tìm kiếm nhiều:</span>
              </span>
              <Link
                href="/category"
                className="group inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
              >
                <span>Xem tất cả danh mục</span>
                <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {quickLinks.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-500 hover:bg-emerald-50/70 hover:text-emerald-700 hover:shadow-xs"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
