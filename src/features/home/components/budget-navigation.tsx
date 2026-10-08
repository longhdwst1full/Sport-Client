import Link from 'next/link';
import { ChevronRight, Tag, Sparkles, ArrowRight } from 'lucide-react';

interface BudgetTier {
  id: string;
  label: string;
  sublabel: string;
  tag: string;
  highlight?: boolean;
  href: string;
  gradient: string;
  tagClass: string;
  textColor: string;
}

const BUDGET_TIERS: BudgetTier[] = [
  {
    id: 'under-500k',
    label: 'Dưới 500K',
    sublabel: 'Dây kháng lực, con lăn, găng tay & phụ kiện tập',
    tag: 'Tiết kiệm',
    href: '/products?maxPrice=500000',
    gradient: 'from-emerald-50/80 via-teal-50/30 to-white hover:border-emerald-300 hover:shadow-emerald-500/5',
    tagClass: 'border-emerald-200/80 bg-emerald-50 text-emerald-800',
    textColor: 'group-hover:text-emerald-700',
  },
  {
    id: '500k-2m',
    label: '500K – 2 Triệu',
    sublabel: 'Tạ tay, đòn tạ, xà đơn, thảm tập yoga cao cấp',
    tag: 'Tập tại nhà',
    href: '/products?minPrice=500000&maxPrice=2000000',
    gradient: 'from-sky-50/80 via-blue-50/30 to-white hover:border-sky-300 hover:shadow-sky-500/5',
    tagClass: 'border-sky-200/80 bg-sky-50 text-sky-800',
    textColor: 'group-hover:text-sky-700',
  },
  {
    id: '2m-5m',
    label: '2 – 5 Triệu',
    sublabel: 'Ghế tập tạ đa năng, bao cát đấm bốc, bàn mini',
    tag: 'Bán chạy nhất',
    highlight: true,
    href: '/products?minPrice=2000000&maxPrice=5000000',
    gradient: 'from-rose-50/90 via-amber-50/40 to-white border-rose-300/80 hover:border-rose-400 shadow-sm shadow-rose-500/5',
    tagClass: 'border-rose-200 bg-rose-50 text-rose-800 font-bold',
    textColor: 'group-hover:text-rose-700',
  },
  {
    id: 'over-5m',
    label: 'Trên 5 Triệu',
    sublabel: 'Máy chạy bộ điện, giàn tạ khối, xe đạp thể lực',
    tag: 'Chuyên nghiệp',
    href: '/products?minPrice=5000000',
    gradient: 'from-purple-50/80 via-violet-50/30 to-white hover:border-purple-300 hover:shadow-purple-500/5',
    tagClass: 'border-purple-200/80 bg-purple-50 text-purple-800',
    textColor: 'group-hover:text-purple-700',
  },
];

export interface BudgetNavigationProps {
  quickLinks?: { name: string; slug: string }[];
}

export function BudgetNavigation({ quickLinks = [] }: BudgetNavigationProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10" aria-label="Tìm kiếm theo ngân sách">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 md:p-10 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 sm:mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-slate-900">Theo ngân sách</p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Tìm thiết bị theo mức ngân sách của bạn
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Dễ dàng lựa chọn giải pháp tập luyện phù hợp với khả năng chi trả và mục tiêu thể lực
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            <span>Xem tất cả mức giá</span>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Budget Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {BUDGET_TIERS.map((tier) => (
            <Link
              key={tier.id}
              href={tier.href}
              className={`group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-gradient-to-br ${tier.gradient} p-3.5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide shadow-2xs ${tier.tagClass}`}>
                    <Tag className="size-3" aria-hidden="true" />
                    {tier.tag}
                  </span>
                </div>
                <strong className={`block text-base sm:text-xl font-black text-slate-900 ${tier.textColor} transition-colors`}>
                  {tier.label}
                </strong>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2 max-sm:hidden">
                  {tier.sublabel}
                </p>
              </div>

              <div className="mt-3 sm:mt-5 flex items-center justify-between border-t border-slate-200/70 pt-2.5 sm:pt-3.5 text-xs font-bold text-slate-600 group-hover:text-slate-950 transition-colors">
                <span>Xem danh sách</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 text-slate-400 group-hover:text-slate-900" />
              </div>
            </Link>
          ))}
        </div>

        {/* Seamlessly Integrated Popular Category Quick Links */}
        {quickLinks.length > 0 && (
          <div className="mt-5 pt-5 sm:mt-8 sm:pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Sparkles className="size-3.5 text-slate-600" />
                <span>Nhóm sản phẩm được tìm kiếm nhiều:</span>
              </span>
              <Link
                href="/category"
                className="group inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-950 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                <span>Xem tất cả danh mục</span>
                <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {quickLinks.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
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
