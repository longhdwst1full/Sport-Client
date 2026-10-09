import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft, Headphones, MapPin, PackageSearch, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { IconList, type IconListItem } from '@/foundation/components/structure';
import { STORE_CONTACT, STORE_POLICY_FACTS, STORE_SHOWROOMS } from '@/shared/constants';

interface AuthBrandPanelProps {
  variant: 'login' | 'register';
}

type PanelMetric = { value: string; label: string };

type PanelContent = {
  imageSrc: string;
  imageBrightness: string;
  badge: string;
  headline: string;
  highlight: string;
  description: string;
  metrics: PanelMetric[];
  perks: IconListItem[];
};

// Chỉ nêu điều tài khoản làm được thật và cam kết có nguồn (`STORE_POLICY_FACTS`, trang CMS).
// Bản trước có số liệu không có nguồn (50K+ hội viên, 12.800+ đánh giá, bảo hành 24 tháng, đổi 7
// ngày, tích điểm 5%, hỗ trợ 24/7) và một lời chứng thực đặt tên giả — mâu thuẫn chính sách đổi trả 3 ngày.
const AUTH_PERKS: IconListItem[] = [
  { icon: PackageSearch, label: 'Theo dõi trạng thái đơn hàng' },
  { icon: MapPin, label: 'Lưu sổ địa chỉ, đặt hàng nhanh hơn' },
  { icon: RotateCcw, label: 'Gửi yêu cầu đổi trả trực tuyến' },
  { icon: Headphones, label: 'Gửi và theo dõi yêu cầu hỗ trợ' },
];

const PANEL_CONTENT: Record<AuthBrandPanelProps['variant'], PanelContent> = {
  login: {
    imageSrc: '/images/banners/slide-may-chay-bo.jpg',
    imageBrightness: 'brightness-[0.4]',
    badge: 'Tài khoản Bảo An Sport',
    headline: 'Quản lý đơn hàng',
    highlight: 'và yêu cầu hỗ trợ ở một nơi',
    description:
      'Đăng nhập để theo dõi đơn hàng, gửi yêu cầu đổi trả hoặc hỗ trợ và đặt hàng nhanh với địa chỉ đã lưu.',
    metrics: [
      { value: String(STORE_SHOWROOMS.length), label: 'Showroom HN & HCM' },
      { value: '63', label: 'Tỉnh thành giao tới' },
      { value: `${STORE_POLICY_FACTS.returnWindowDays} ngày`, label: 'Đổi trả khi lỗi' },
    ],
    perks: AUTH_PERKS,
  },
  register: {
    imageSrc: '/images/banners/slide-xe-dap-tap.jpg',
    imageBrightness: 'brightness-[0.38]',
    badge: 'Tạo tài khoản miễn phí',
    headline: 'Mua sắm thuận tiện hơn',
    highlight: 'cùng Bảo An Sport',
    description:
      'Tạo tài khoản để lưu địa chỉ nhận hàng, theo dõi đơn và gửi yêu cầu đổi trả, hỗ trợ trực tuyến.',
    metrics: [
      { value: String(STORE_SHOWROOMS.length), label: 'Showroom HN & HCM' },
      { value: '63', label: 'Tỉnh thành giao tới' },
      { value: `${STORE_POLICY_FACTS.returnWindowDays} ngày`, label: 'Đổi trả khi lỗi' },
    ],
    perks: AUTH_PERKS,
  },
};

/** Hộp giữa panel: kênh liên hệ thật thay cho lời chứng thực không có nguồn. */
function PanelCallout(): ReactNode {
  return (
    <>
      <div className="flex items-center gap-2 text-neutral-300 font-bold text-xs mb-1.5">
        <ShieldCheck className="size-4" />
        <span>{STORE_POLICY_FACTS.warrantySummary}</span>
      </div>
      <p className="text-xs text-neutral-300 leading-relaxed">
        Hotline {STORE_CONTACT.primaryHotline} · {STORE_CONTACT.openingHoursShort}
      </p>
    </>
  );
}

/**
 * Left-side desktop editorial panel shown on login and register pages. Layout is shared; the
 * per-page image/copy/metrics/perks live in `PANEL_CONTENT` so the two variants never drift apart.
 */
export function AuthBrandPanel({ variant }: AuthBrandPanelProps) {
  const content = PANEL_CONTENT[variant];

  return (
    <div className="relative hidden lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between overflow-hidden bg-neutral-950 p-7 xl:p-10 text-white h-full">
      {/* Background Photography with Depth Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src={content.imageSrc}
          alt=""
          fill
          sizes="(min-width: 1280px) 58vw, 50vw"
          className={`object-cover object-center ${content.imageBrightness} contrast-125 saturate-75 transition-transform duration-1000 scale-105`}
        />
        {/* Rich gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-neutral-900/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-neutral-900/20 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-20 right-10 size-96 rounded-full bg-neutral-950/20 blur-[140px]" />
      </div>

      {/* Top Bar: Brand Logo & Return Link */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" aria-label="Bảo An Sport — Trang chủ" className="group inline-flex items-center gap-3 rounded-lg focus-ring focus-visible:ring-offset-neutral-950">
          <div className="relative h-9 w-40 transition-transform group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng"
              fill
              sizes="160px"
              className="object-contain object-left"
            />
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-neutral-300 backdrop-blur-md transition hover:bg-white/15 hover:text-white focus-ring-tight"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          <span>Trang chủ</span>
        </Link>
      </div>

      {/* Center: Editorial Showcase */}
      <div className="relative z-10 my-auto py-3 xl:py-5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-400/30 bg-neutral-950/60 px-3.5 py-1 text-xs font-semibold text-neutral-300 backdrop-blur-md">
          <Sparkles className="size-3.5 text-neutral-300" />
          <span>{content.badge}</span>
        </div>

        <h2 className="mt-3 text-2xl font-bold leading-tight text-white xl:text-3xl">
          {content.headline} <br className="hidden xl:inline" />
          <span className="bg-gradient-to-r from-neutral-300 via-neutral-300 to-neutral-50 bg-clip-text text-transparent">
            {content.highlight}
          </span>
        </h2>

        <p className="mt-2.5 max-w-lg text-xs xl:text-sm leading-relaxed text-neutral-300 line-clamp-3">{content.description}</p>

        {/* Quick Metrics Bento Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {content.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center backdrop-blur-md transition hover:bg-white/10"
            >
              <div className="text-xl font-bold text-neutral-300 xl:text-2xl">{metric.value}</div>
              <div className="mt-0.5 text-2xs font-bold text-neutral-300">{metric.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-3.5 rounded-xl border border-neutral-900/20 bg-neutral-900/60 p-3 backdrop-blur-md">
          <PanelCallout />
        </div>
      </div>

      {/* Bottom Trust Commitments */}
      <IconList
        items={content.perks}
        columns={2}
        className="relative z-10 gap-2 border-t border-white/10 pt-4 text-xs text-neutral-300"
        iconClassName="text-neutral-300"
      />
    </div>
  );
}
