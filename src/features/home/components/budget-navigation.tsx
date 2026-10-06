import Link from 'next/link';
import { Banknote, ChevronRight, Tag, Sparkles, ArrowRight } from 'lucide-react';

interface BudgetTier {
  id: string;
  label: string;
  sublabel: string;
  tag: string;
  badgeClass: string;
  accentBorder: string;
  href: string;
}

const BUDGET_TIERS: BudgetTier[] = [
  {
    id: 'under-500k',
    label: 'Dưới 500K',
    sublabel: 'Dây kháng lực, con lăn, găng tay & phụ kiện tập',
    tag: 'Tiết kiệm',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    accentBorder: 'hover:border-emerald-300',
    href: '/products?maxPrice=500000',
  },
  {
    id: '500k-2m',
    label: '500K – 2 Triệu',
    sublabel: 'Tạ tay, đòn tạ, xà đơn, thảm tập yoga cao cấp',
    tag: 'Tập tại nhà',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/80',
    accentBorder: 'hover:border-sky-300',
    href: '/products?minPrice=500000&maxPrice=2000000',
  },
  {
    id: '2m-5m',
    label: '2 – 5 Triệu',
    sublabel: 'Ghế tập tạ đa năng, bao cát đấm bốc, bàn mini',
    tag: 'Bán chạy nhất',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    accentBorder: 'hover:border-amber-300',
    href: '/products?minPrice=2000000&maxPrice=5000000',
  },
  {
    id: 'over-5m',
    label: 'Trên 5 Triệu',
    sublabel: 'Máy chạy bộ điện, giàn tạ khối, xe đạp thể lực',
    tag: 'Chuyên nghiệp',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/80',
    accentBorder: 'hover:border-purple-300',
    href: '/products?minPrice=5000000',
  },
];

export interface BudgetNavigationProps {
  quickLinks?: { name: string; slug: string }[];
}

export function BudgetNavigation({ quickLinks = [] }: BudgetNavigationProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14" aria-label="Tìm kiếm theo ngân sách">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="grid size-11 place-items-center rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 shadow-2xs">
              <Banknote className="size-5" aria-hidden="true" />
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
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            <span>Xem tất cả mức giá</span>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Budget Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {BUDGET_TIERS.map((tier) => (
            <Link
              key={tier.id}
              href={tier.href}
              className={`group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${tier.badgeClass}`}>
                    <Tag className="size-3" aria-hidden="true" />
                    {tier.tag}
                  </span>
                </div>
                <strong className="block text-xl font-black text-slate-900 group-hover:text-slate-950 transition-colors">
                  {tier.label}
                </strong>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {tier.sublabel}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-200/70 pt-3.5 text-xs font-bold text-slate-600 group-hover:text-slate-950 transition-colors">
                <span>Xem danh sách</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 text-slate-400 group-hover:text-slate-900" />
              </div>
            </Link>
          ))}
        </div>

        {/* Seamlessly Integrated Popular Category Quick Links */}
        {quickLinks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200">
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
