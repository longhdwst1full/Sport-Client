import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ShieldCheck, CheckCircle2, ArrowLeft, Sparkles, Star, Award, RotateCcw } from 'lucide-react';
import { IconList, type IconListItem } from '@/foundation/components/structure';

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

const AUTH_PERKS: IconListItem[] = [
  { icon: CheckCircle2, label: 'Miễn phí lắp đặt tại nhà', iconClassName: 'text-success-400' },
  { icon: ShieldCheck, label: 'Bảo hành chính hãng 24 tháng' },
  { icon: RotateCcw, label: '1 đổi 1 trong 7 ngày nếu có lỗi' },
  { icon: Award, label: 'Tích điểm thưởng 5% trọn đời' },
];

const REGISTER_PERKS: IconListItem[] = [
  { icon: CheckCircle2, label: 'Giao lắp hỏa tốc toàn quốc', iconClassName: 'text-success-400' },
  { icon: ShieldCheck, label: 'Cam kết 100% chính hãng' },
  { icon: CheckCircle2, label: 'Đổi mới trong 7 ngày nếu lỗi', iconClassName: 'text-success-400' },
  { icon: Award, label: 'Hỗ trợ kỹ thuật 24/7 trọn đời' },
];

const PANEL_CONTENT: Record<AuthBrandPanelProps['variant'], PanelContent> = {
  login: {
    imageSrc: '/images/banners/slide-may-chay-bo.jpg',
    imageBrightness: 'brightness-[0.4]',
    badge: 'Đặc Quyền Hội Viên Thể Thao Bảo An',
    headline: 'Nâng tầm thể lực cùng trang bị',
    highlight: 'chuẩn thi đấu chuyên nghiệp',
    description:
      'Đăng nhập để theo dõi lộ trình đơn hàng, kích hoạt bảo hành điện tử chính hãng 24 tháng và tận hưởng dịch vụ giao lắp chuyên nghiệp từ Bảo An Sport.',
    metrics: [
      { value: '50K+', label: 'Hội viên tin chọn' },
      { value: '100%', label: 'Chính hãng Bảo An' },
      { value: '24/7', label: 'Tư vấn kỹ thuật' },
    ],
    perks: AUTH_PERKS,
  },
  register: {
    imageSrc: '/images/banners/slide-xe-dap-tap.jpg',
    imageBrightness: 'brightness-[0.38]',
    badge: 'Đặc Quyền Thành Viên Mới 2026',
    headline: 'Gia nhập Bảo An Sport,',
    highlight: 'đồng hành cùng thể lực đỉnh cao',
    description:
      'Khởi động hành trình rèn luyện thể chất với trang thiết bị chuẩn thi đấu. Nhận ngay đặc quyền giao lắp tận nơi và chế độ bảo hành chính hãng toàn diện.',
    metrics: [
      { value: '100%', label: 'Chính hãng phân phối' },
      { value: '0đ', label: 'Tư vấn lộ trình 1:1' },
      { value: '24T', label: 'Bảo hành điện tử' },
    ],
    perks: REGISTER_PERKS,
  },
};

const STAR_COUNT = 5;

/** Hộp giữa panel: đăng nhập hiện trích dẫn khách hàng, đăng ký hiện cam kết dịch vụ. */
function PanelCallout({ variant }: AuthBrandPanelProps): ReactNode {
  if (variant === 'login') {
    return (
      <>
        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1.5">
          {Array.from({ length: STAR_COUNT }, (_, index) => (
            <Star key={index} className="size-3.5 fill-amber-400" />
          ))}
          <span className="ml-1 text-slate-300 text-[11px]">4.9/5 (12.800+ đánh giá xác thực)</span>
        </div>
        <p className="text-xs italic text-slate-300 leading-relaxed">
          &ldquo;Trang bị tập luyện của Bảo An Sport chắc chắn, khung thép dày, máy chạy rất đầm và êm. Dịch vụ bảo hành tận nơi cực kỳ an tâm.&rdquo;
        </p>
        <div className="mt-2 text-[11px] font-bold text-slate-300">— HLV. Tuấn Anh (HLV Thể Hình & Marathoner)</div>
      </>
    );
  }
  return (
    <>
      <div className="flex items-center gap-2 text-slate-300 font-bold text-xs mb-1.5">
        <ShieldCheck className="size-4" />
        <span>Cam kết chất lượng dịch vụ</span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">
        Trang bị thể thao chuẩn thi đấu, hỗ trợ giao lắp tận nơi và bảo dưỡng định kỳ trọn đời cho mọi hội viên Bảo An Sport.
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
    <div className="relative hidden lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between overflow-hidden bg-slate-950 p-7 xl:p-10 text-white h-full">
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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-slate-900/20 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-20 right-10 size-96 rounded-full bg-slate-950/20 blur-[140px]" />
      </div>

      {/* Top Bar: Brand Logo & Return Link */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" aria-label="Bảo An Sport — Trang chủ" className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
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
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-slate-300 backdrop-blur-md transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          <span>Trang chủ</span>
        </Link>
      </div>

      {/* Center: Editorial Showcase */}
      <div className="relative z-10 my-auto py-3 xl:py-5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-400/30 bg-slate-950/60 px-3.5 py-1 text-xs font-extrabold text-slate-300 backdrop-blur-md">
          <Sparkles className="size-3.5 text-slate-300" />
          <span>{content.badge}</span>
        </div>

        <h2 className="mt-3 text-2xl font-black leading-tight text-white xl:text-3xl">
          {content.headline} <br className="hidden xl:inline" />
          <span className="bg-gradient-to-r from-slate-300 via-slate-300 to-slate-50 bg-clip-text text-transparent">
            {content.highlight}
          </span>
        </h2>

        <p className="mt-2.5 max-w-lg text-xs xl:text-sm leading-relaxed text-slate-300 line-clamp-3">{content.description}</p>

        {/* Quick Metrics Bento Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {content.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center backdrop-blur-md transition hover:bg-white/10"
            >
              <div className="text-xl font-black text-slate-300 xl:text-2xl">{metric.value}</div>
              <div className="mt-0.5 text-[11px] font-bold text-slate-300">{metric.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-3.5 rounded-xl border border-slate-900/20 bg-slate-900/60 p-3 backdrop-blur-md">
          <PanelCallout variant={variant} />
        </div>
      </div>

      {/* Bottom Trust Commitments */}
      <IconList
        items={content.perks}
        columns={2}
        className="relative z-10 gap-2 border-t border-white/10 pt-4 text-xs text-slate-300"
        iconClassName="text-slate-300"
      />
    </div>
  );
}
