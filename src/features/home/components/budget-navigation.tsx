import Link from 'next/link';
import { ChevronRight, Tag, Sparkles, ArrowRight } from 'lucide-react';
import { priceRangeHref } from '@/features/catalog';

interface BudgetTier {
  /** Id trong `PRICE_RANGES` của catalog — link và bộ lọc dùng chung một mốc giá. */
  id: string;
  label: string;
  sublabel: string;
  tag: string;
  highlight?: boolean;
}

// Một kiểu thẻ trung tính cho cả 4 mức; thẻ nổi bật chỉ đậm viền. Không tô màu theo mức giá
// (xanh lá dành cho trạng thái thành công, đỏ dành cho giá/khuyến mãi).
const TIER_CARD = 'from-neutral-50 to-white hover:border-neutral-900';
const TIER_TAG = 'border-neutral-200 bg-white text-neutral-700';

const BUDGET_TIERS: BudgetTier[] = [
  { id: 'under-500k', label: 'Dưới 500K', sublabel: 'Dây kháng lực, con lăn, găng tay & phụ kiện tập', tag: 'Tiết kiệm' },
  { id: '500k-2m', label: '500K – 2 Triệu', sublabel: 'Tạ tay, đòn tạ, xà đơn, thảm tập yoga cao cấp', tag: 'Tập tại nhà' },
  { id: '2m-5m', label: '2 – 5 Triệu', sublabel: 'Ghế tập tạ đa năng, bao cát đấm bốc, bàn mini', tag: 'Home gym cơ bản', highlight: true },
  { id: 'over-5m', label: 'Trên 5 Triệu', sublabel: 'Máy chạy bộ điện, giàn tạ khối, xe đạp thể lực', tag: 'Chuyên nghiệp' },
];

export interface BudgetNavigationProps {
  quickLinks?: { name: string; slug: string }[];
}

export function BudgetNavigation({ quickLinks = [] }: BudgetNavigationProps) {
  return (
    <section className="page-section" aria-label="Tìm kiếm theo ngân sách">
      <div className="surface-card p-4 sm:p-8 md:p-10 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 sm:mb-8">
          <div>
            <p className="eyebrow text-neutral-900">Theo ngân sách</p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
              Tìm thiết bị theo mức ngân sách của bạn
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500">
              Dễ dàng lựa chọn giải pháp tập luyện phù hợp với khả năng chi trả và mục tiêu thể lực
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-950 transition rounded focus-ring"
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
              href={priceRangeHref(tier.id)}
              className={`group flex flex-col justify-between rounded-2xl border ${tier.highlight ? "border-neutral-900" : "border-neutral-200"} bg-gradient-to-br ${TIER_CARD} p-3.5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-ring`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-2xs font-bold tracking-wide shadow-2xs ${TIER_TAG}`}>
                    <Tag className="size-3" aria-hidden="true" />
                    {tier.tag}
                  </span>
                </div>
                <strong className={`block text-base sm:text-xl font-bold text-neutral-900`}>
                  {tier.label}
                </strong>
                <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed line-clamp-2 max-sm:hidden">
                  {tier.sublabel}
                </p>
              </div>

              <div className="mt-3 sm:mt-5 flex items-center justify-between border-t border-neutral-200/70 pt-2.5 sm:pt-3.5 text-xs font-bold text-neutral-600 group-hover:text-neutral-950 transition-colors">
                <span>Xem danh sách</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 text-neutral-400 group-hover:text-neutral-900" />
              </div>
            </Link>
          ))}
        </div>

        {/* Seamlessly Integrated Popular Category Quick Links */}
        {quickLinks.length > 0 && (
          <div className="mt-5 pt-5 sm:mt-8 sm:pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                <Sparkles className="size-3.5 text-neutral-600" />
                <span>Nhóm sản phẩm được tìm kiếm nhiều:</span>
              </span>
              <Link
                href="/category"
                className="group inline-flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-neutral-950 transition rounded focus-ring"
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
                  className="rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 active:scale-95 focus-ring"
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
