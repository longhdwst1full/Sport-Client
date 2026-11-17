import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { CountUp, Reveal } from '@/foundation/components/motion';
import {
  STORE_CONTACT,
  STORE_MARKETING_STATS,
  STORE_SHOWROOMS,
} from '@/shared/constants';

/**
 * Khối tối nhận diện thương hiệu Bảo An Sport (Dark Luxury Athletic).
 * Kết hợp chỉ số niềm tin khách hàng (Social Proof) và trải nghiệm thực tế tại hệ thống Showroom.
 */
const COMMITMENTS = [
  'Miễn phí tư vấn setup theo diện tích',
  STORE_MARKETING_STATS.warrantyHighlight,
];

const STAT_ITEMS = [
  {
    icon: Star,
    iconColor: 'text-amber-400 fill-amber-400',
    primary: STORE_MARKETING_STATS.rating,
    secondary: '/ 5.0',
    caption: `${STORE_MARKETING_STATS.reviewCount} đánh giá tin cậy`,
  },
  {
    icon: Award,
    iconColor: 'text-brand-400',
    primary: STORE_MARKETING_STATS.yearsLabel,
    secondary: '',
    caption: 'Kinh nghiệm phân phối',
  },
  {
    icon: ShieldCheck,
    iconColor: 'text-success-400',
    primary: '100%',
    secondary: '',
    caption: 'Hàng chính hãng',
  },
];

const DARK_BLOCK_BUTTON_LAYOUT =
  'flex-1 justify-center whitespace-nowrap px-5 py-3 text-sm font-bold focus-ring-inverse focus-visible:ring-offset-neutral-950 transition-all duration-300';

export function TrustSocialProof() {
  return (
    <section className="page-section">
      <Reveal
        variant="zoom-in"
        durationMs={700}
        offsetY={12}
        rootMargin="-60px"
        className="relative overflow-hidden rounded-3xl border border-neutral-800/80 bg-gradient-to-br from-neutral-950 via-[#111215] to-neutral-900 p-5 text-white shadow-2xl sm:p-10 lg:p-12"
      >
        {/* Dynamic Athletic Ambient Glows */}
        <div
          className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-brand-600/15 blur-[100px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-amber-500/10 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Social Proof & Commitments */}
          <Reveal variant="slide-right" durationMs={700} delayMs={150} rootMargin="-60px">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-300 backdrop-blur-md">
              <Sparkles className="size-3.5 text-brand-400" aria-hidden="true" />
              <span>An tâm khi đầu tư thiết bị</span>
            </div>

            {/* Main Heading with Highlight */}
            <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              Vì sao hơn{' '}
              <span className="text-amber-400">
                {STORE_MARKETING_STATS.customers}
              </span>{' '}
              khách hàng tin chọn Bảo An Sport?
            </h2>

            {/* Description */}
            <p className="mt-3.5 max-w-xl text-xs sm:text-sm leading-relaxed text-neutral-300/90 font-medium">
              Thiết bị thể thao là khoản đầu tư cho sức khoẻ lâu dài. Không chỉ cung cấp sản phẩm chính hãng, Bảo An Sport
              đồng hành cùng bạn từ khâu tư vấn không gian đến lắp đặt và bảo trì.
            </p>

            {/* Stats Cards (Glassmorphic) */}
            <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-4">
              {STAT_ITEMS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.caption}
                    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 text-center backdrop-blur-md transition-all duration-300 hover:border-white/15 hover:bg-white/[0.06] sm:p-4"
                  >
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                      <Icon className={`size-4 sm:size-4.5 ${stat.iconColor} drop-shadow-xs shrink-0`} aria-hidden="true" />
                      <CountUp value={stat.primary} className="text-xl sm:text-2xl font-bold text-white" />
                      {stat.secondary && (
                        <span className="text-2xs sm:text-xs font-bold text-neutral-400">{stat.secondary}</span>
                      )}
                    </div>
                    <span className="mt-1 block text-2xs sm:text-xs font-medium text-neutral-400 leading-tight">
                      {stat.caption}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 4 Golden Commitments */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {COMMITMENTS.map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-colors duration-200 hover:bg-white/[0.04]"
                >
                  <div className="grid size-7 shrink-0 place-items-center rounded-lg border border-brand-500/30 bg-brand-500/15 text-brand-400">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-neutral-200 leading-snug">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right Column: Showroom Hub (Interactive) */}
          <Reveal
            variant="slide-left"
            durationMs={700}
            delayMs={250}
            rootMargin="-60px"
            className="relative flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl shadow-2xl sm:p-7"
          >
            {/* Showroom Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid size-8.5 shrink-0 place-items-center rounded-xl border border-brand-500/30 bg-brand-500/15 text-brand-400 shadow-xs">
                  <MapPin className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                    Trải nghiệm tại showroom
                  </h3>
                  <p className="text-2xs font-medium text-neutral-400">
                    Thử máy thực tế trước khi mua
                  </p>
                </div>
              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 self-start sm:self-auto rounded-full border border-neutral-700/80 bg-neutral-800/90 px-3 py-1 text-2xs font-medium text-neutral-300">
                <Clock className="size-3 text-amber-400 shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">{STORE_CONTACT.openingHoursShort}</span>
              </div>
            </div>

            {/* Showroom List */}
            <div className="space-y-3">
              {STORE_SHOWROOMS.map((showroom) => (
                <div
                  key={showroom.id}
                  className="group relative rounded-2xl border border-white/5 bg-neutral-950/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/40 hover:bg-neutral-900/80 hover:shadow-lg hover:shadow-black/40"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <strong className="block text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                      {showroom.city}: {showroom.name}
                    </strong>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider ${
                        showroom.isHeadquarter
                          ? 'border border-amber-400/40 bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-300'
                          : 'border border-neutral-600 bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {showroom.isHeadquarter ? 'Trụ sở' : 'Chi nhánh'}
                    </span>
                  </div>

                  <p className="mb-2.5 text-xs font-medium leading-relaxed text-neutral-400">{showroom.address}</p>

                  <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5">
                    <a
                      href={`tel:${showroom.phoneRaw}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 transition-colors hover:text-white"
                    >
                      <Phone className="size-3.5 text-brand-400 animate-phone-ring" aria-hidden="true" />
                      <span>Hotline: {showroom.phone}</span>
                    </a>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1 text-2xs font-bold text-neutral-400 transition-colors hover:text-brand-300"
                    >
                      <span>Bản đồ</span>
                      <Navigation className="size-3 text-neutral-500 group-hover:text-brand-400" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/contact"
                className={buttonVariants({
                  variant: 'static',
                  className: `${DARK_BLOCK_BUTTON_LAYOUT} bg-white text-neutral-950 hover:bg-neutral-100 shadow-md shadow-white/10`,
                })}
              >
                <span>Xem chỉ đường</span>
              </Link>
              <a
                href={STORE_CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: 'primary',
                  className: `${DARK_BLOCK_BUTTON_LAYOUT} bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white shadow-lg shadow-brand-600/30`,
                })}
              >
                <span>Chat Zalo tư vấn</span>
                <span className="sr-only"> (mở tab mới)</span>
              </a>
            </div>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
