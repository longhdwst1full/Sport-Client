import Link from 'next/link';
import { ChevronRight, Tag, Sparkles, ArrowRight } from 'lucide-react';
import { priceRangeHref } from '@/features/catalog';
import { Reveal } from '@/foundation/components/motion';
import { buttonVariants } from '@/foundation/components/buttons';

interface BudgetTier {
  id: string;
  label: string;
  sublabel: string;
  tag: string;
  /** Mức phổ biến nhất: nhấn đỏ thương hiệu (token `selected`), các mức còn lại trung tính. */
  highlight?: boolean;
}

/**
 * Thẻ ngân sách theo bảng màu logo (`20-design-tokens.md`): trắng + viền xám, hover nổi bóng; chỉ mức
 * `highlight` được nhấn bằng token `selected`. Trước đây mỗi mức một màu (xanh/amber/indigo) + gradient.
 */
const TIER_CARD_STYLE = {
  default: 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-card',
  highlight: 'border-selected-border bg-selected hover:shadow-card',
} as const;
const TIER_BADGE_STYLE = {
  default: 'border-neutral-200 bg-neutral-50 text-neutral-700',
  highlight: 'border-selected-border bg-white text-on-selected',
} as const;

const BUDGET_TIERS: BudgetTier[] = [
  {
    id: 'under-500k',
    label: 'Dưới 500K',
    sublabel: 'Dây kháng lực, con lăn, găng tay & phụ kiện tập',
    tag: 'Tiết kiệm',
  },
  {
    id: '500k-2m',
    label: '500K – 2 Triệu',
    sublabel: 'Tạ tay, đòn tạ, xà đơn, thảm tập yoga cao cấp',
    tag: 'Tập tại nhà',
  },
  {
    id: '2m-5m',
    label: '2 – 5 Triệu',
    sublabel: 'Ghế tập tạ đa năng, bao cát đấm bốc, bàn mini',
    tag: 'Home gym cơ bản',
    highlight: true,
  },
  {
    id: 'over-5m',
    label: 'Trên 5 Triệu',
    sublabel: 'Máy chạy bộ điện, giàn tạ khối, xe đạp thể lực',
    tag: 'Chuyên nghiệp',
  },
];

export interface BudgetNavigationProps {
  quickLinks?: { name: string; slug: string }[];
}

export function BudgetNavigation({ quickLinks = [] }: BudgetNavigationProps) {
  return (
    <section className="page-section" aria-label="Tìm kiếm theo ngân sách">
      <div className="relative rounded-2xl border border-neutral-200 bg-white p-5 sm:p-8 md:p-10">

        {/* Header */}
        <Reveal rootMargin="-60px" className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <p className="eyebrow text-neutral-900">Theo ngân sách</p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
              Tìm thiết bị theo mức ngân sách của bạn
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
              Dễ dàng lựa chọn giải pháp tập luyện phù hợp với khả năng chi trả và mục tiêu thể lực
            </p>
          </div>
          {/* Lối "xem tất cả" của khối trang chủ: biến thể `link` (RULE-DS-01). */}
          <Link href="/products" className={buttonVariants({ variant: 'link', className: 'group gap-1.5 self-start sm:self-auto' })}>
            <span>Xem tất cả mức giá</span>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        {/* 4 Budget Cards Grid */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {BUDGET_TIERS.map((tier) => (
            <Reveal key={tier.id} rootMargin="-60px" stagger className="flex">
              <Link
                href={priceRangeHref(tier.id)}
                className={`group relative flex flex-1 flex-col justify-between rounded-xl border p-4 sm:p-6 transition duration-300 hover:-translate-y-1 focus-ring ${tier.highlight ? TIER_CARD_STYLE.highlight : TIER_CARD_STYLE.default}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-2xs font-semibold tracking-wide ${tier.highlight ? TIER_BADGE_STYLE.highlight : TIER_BADGE_STYLE.default}`}>
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
                  <ArrowRight className="size-4 text-brand-600 transition-transform group-hover:translate-x-1.5" aria-hidden="true" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Popular Product Category Tag Pills */}
        {quickLinks.length > 0 && (
          <Reveal variant="fade" rootMargin="-60px" delayMs={150} className="relative z-10 mt-6 pt-6 sm:mt-8 sm:pt-6 border-t border-neutral-100">
            <div className="flex items-center justify-between gap-3 mb-3.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                <Sparkles className="size-3.5 text-brand-600" aria-hidden="true" />
                <span>Nhóm sản phẩm được tìm kiếm nhiều:</span>
              </span>
              <Link
                href="/category"
                className="group inline-flex items-center gap-1 text-xs font-semibold text-neutral-800 hover:text-neutral-950 hover:underline transition"
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
                  className="rounded-full border border-control-border bg-control px-3.5 py-1.5 text-xs font-semibold text-on-control transition-colors hover:border-control-border-strong hover:bg-control-hover focus-ring"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
