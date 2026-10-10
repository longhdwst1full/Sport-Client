import Link from 'next/link';
import { ChevronRight, Tag, Sparkles, ArrowRight } from 'lucide-react';
import { priceRangeHref } from '@/features/catalog';

interface BudgetTier {
  id: string;
  label: string;
  sublabel: string;
  tag: string;
  badgeStyle: string;
  cardStyle: string;
  arrowColor: string;
  highlight?: boolean;
}

const BUDGET_TIERS: BudgetTier[] = [
  {
    id: 'under-500k',
    label: 'Dưới 500K',
    sublabel: 'Dây kháng lực, con lăn, găng tay & phụ kiện tập',
    tag: 'Tiết kiệm',
    badgeStyle: 'bg-success-100/80 text-success-800 border-success-300',
    cardStyle: 'border-success-200/90 bg-gradient-to-br from-success-50/60 via-white to-neutral-50/40 hover:border-success-400 hover:shadow-lg hover:shadow-success-500/10',
    arrowColor: 'text-success-600',
  },
  {
    id: '500k-2m',
    label: '500K – 2 Triệu',
    sublabel: 'Tạ tay, đòn tạ, xà đơn, thảm tập yoga cao cấp',
    tag: 'Tập tại nhà',
    badgeStyle: 'bg-neutral-100/80 text-neutral-800 border-neutral-300',
    cardStyle: 'border-neutral-200/90 bg-gradient-to-br from-neutral-50/60 via-white to-neutral-50/40 hover:border-neutral-400 hover:shadow-lg hover:shadow-neutral-500/10',
    arrowColor: 'text-neutral-600',
  },
  {
    id: '2m-5m',
    label: '2 – 5 Triệu',
    sublabel: 'Ghế tập tạ đa năng, bao cát đấm bốc, bàn mini',
    tag: 'Home gym cơ bản',
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
    cardStyle: 'border-amber-400 bg-gradient-to-br from-amber-50/80 via-white to-brand-50/50 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/15 shadow-sm ring-1 ring-amber-400/30',
    arrowColor: 'text-amber-600',
    highlight: true,
  },
  {
    id: 'over-5m',
    label: 'Trên 5 Triệu',
    sublabel: 'Máy chạy bộ điện, giàn tạ khối, xe đạp thể lực',
    tag: 'Chuyên nghiệp',
    badgeStyle: 'bg-red-100/80 text-red-800 border-red-300',
    cardStyle: 'border-red-200/90 bg-gradient-to-br from-red-50/60 via-white to-red-50/40 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/10',
    arrowColor: 'text-red-600',
  },
];

export interface BudgetNavigationProps {
  quickLinks?: { name: string; slug: string }[];
}

export function BudgetNavigation({ quickLinks = [] }: BudgetNavigationProps) {
  return (
    <section className="page-section" aria-label="Tìm kiếm theo ngân sách">
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Ambient background accent glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-gradient-to-br from-amber-400/10 to-red-500/10 blur-3xl" aria-hidden="true" />

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/80 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-red-600 shadow-2xs">
              <Sparkles className="size-3 text-red-500" aria-hidden="true" />
              Theo ngân sách
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
              Tìm thiết bị theo mức ngân sách của bạn
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
              Dễ dàng lựa chọn giải pháp tập luyện phù hợp với khả năng chi trả và mục tiêu thể lực
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-semibold text-neutral-700 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-200 shadow-2xs"
          >
            <span>Xem tất cả mức giá</span>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Budget Cards Grid */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {BUDGET_TIERS.map((tier) => (
            <Link
              key={tier.id}
              href={priceRangeHref(tier.id)}
              className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 ${tier.cardStyle}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-2xs font-semibold tracking-wide shadow-2xs ${tier.badgeStyle}`}>
                    <Tag className="size-3" aria-hidden="true" />
                    {tier.tag}
                  </span>
                </div>
                <strong className="block text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-neutral-950">
                  {tier.label}
                </strong>
                <p className="mt-1.5 text-xs text-neutral-600 font-medium leading-relaxed line-clamp-2 max-sm:hidden">
                  {tier.sublabel}
                </p>
              </div>

              <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-neutral-200/80 pt-3 text-xs font-bold text-neutral-700 group-hover:text-neutral-950 transition-colors">
                <span>Xem danh sách</span>
                <ArrowRight className={`size-4 transition-transform group-hover:translate-x-1.5 ${tier.arrowColor}`} />
              </div>
            </Link>
          ))}
        </div>

        {/* Popular Product Category Tag Pills */}
        {quickLinks.length > 0 && (
          <div className="relative z-10 mt-6 pt-6 sm:mt-8 sm:pt-6 border-t border-neutral-100">
            <div className="flex items-center justify-between gap-3 mb-3.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                <Sparkles className="size-3.5 text-amber-500" />
                <span>Nhóm sản phẩm được tìm kiếm nhiều:</span>
              </span>
              <Link
                href="/category"
                className="group inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline transition"
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
                  className="rounded-full border border-neutral-200/90 bg-neutral-50/80 px-3.5 py-1.5 text-xs font-bold text-neutral-700 shadow-2xs transition-all hover:border-red-300 hover:bg-red-50/90 hover:text-red-700 hover:shadow-xs active:scale-95"
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
