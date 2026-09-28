import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Star,
  Award,
  RotateCcw,
} from 'lucide-react';

interface AuthBrandPanelProps {
  variant: 'login' | 'register';
}

/**
 * Left-side desktop editorial panel shown on login and register pages. The two pages show
 * different image/copy/metrics, so this branches internally on `variant` rather than exposing
 * a generic content API — keeps the move mechanical while output stays byte-identical per page.
 */
export function AuthBrandPanel({ variant }: AuthBrandPanelProps) {
  if (variant === 'login') {
    return (
      <div className="relative hidden lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between overflow-hidden bg-slate-950 p-10 xl:p-14 text-white">
        {/* Background Photography with Depth Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banners/slide-may-chay-bo.jpg"
            alt="Bảo An Sport Athlete Training"
            fill
            priority
            className="object-cover object-center brightness-[0.4] contrast-125 saturate-75 transition-transform duration-1000 scale-105"
          />
          {/* Rich gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-emerald-500/20 blur-[130px]" />
          <div className="pointer-events-none absolute -bottom-20 right-10 size-96 rounded-full bg-teal-500/15 blur-[140px]" />
        </div>

        {/* Top Bar: Brand Logo & Return Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="relative h-11 w-48 transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            <span>Trang chủ</span>
          </Link>
        </div>

        {/* Center: Editorial Athletic Showcase */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-extrabold text-emerald-300 backdrop-blur-md">
            <Sparkles className="size-4 text-emerald-400" />
            <span>Đặc Quyền Hội Viên Thể Thao Bảo An</span>
          </div>

          <h2 className="mt-5 text-3xl font-black leading-tight text-white xl:text-4xl">
            Nâng tầm thể lực cùng trang bị <br className="hidden xl:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              chuẩn thi đấu chuyên nghiệp
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
            Đăng nhập để theo dõi lộ trình đơn hàng, kích hoạt bảo hành điện tử chính hãng 24 tháng và tận hưởng dịch vụ giao lắp chuyên nghiệp từ Bảo An Sport.
          </p>

          {/* Quick Metrics Bento Grid */}
          <div className="mt-8 grid grid-cols-3 gap-3.5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10">
              <div className="text-2xl font-black text-emerald-400 xl:text-3xl">50K+</div>
              <div className="mt-1 text-xs font-bold text-slate-300">Hội viên tin chọn</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10">
              <div className="text-2xl font-black text-emerald-400 xl:text-3xl">100%</div>
              <div className="mt-1 text-xs font-bold text-slate-300">Chính hãng Bảo An</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10">
              <div className="text-2xl font-black text-emerald-400 xl:text-3xl">24/7</div>
              <div className="mt-1 text-xs font-bold text-slate-300">Tư vấn kỹ thuật</div>
            </div>
          </div>

          {/* Social Proof Quote */}
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4 backdrop-blur-md">
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1.5">
              <Star className="size-3.5 fill-amber-400" />
              <Star className="size-3.5 fill-amber-400" />
              <Star className="size-3.5 fill-amber-400" />
              <Star className="size-3.5 fill-amber-400" />
              <Star className="size-3.5 fill-amber-400" />
              <span className="ml-1 text-slate-300 text-[11px]">4.9/5 (12.800+ đánh giá xác thực)</span>
            </div>
            <p className="text-xs italic text-slate-300 leading-relaxed">
              &ldquo;Trang bị tập luyện của Bảo An Sport chắc chắn, khung thép dày, máy chạy rất đầm và êm. Dịch vụ bảo hành tận nơi cực kỳ an tâm.&rdquo;
            </p>
            <div className="mt-2 text-[11px] font-bold text-emerald-300">
              — HLV. Tuấn Anh (HLV Thể Hình & Marathoner)
            </div>
          </div>
        </div>

        {/* Bottom Trust Commitments */}
        <div className="relative z-10 grid grid-cols-2 gap-3.5 border-t border-white/10 pt-6 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
            <span>Miễn phí lắp đặt tại nhà</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
            <span>Bảo hành chính hãng 24 tháng</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="size-4 shrink-0 text-emerald-400" />
            <span>1 đổi 1 trong 7 ngày nếu có lỗi</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="size-4 shrink-0 text-emerald-400" />
            <span>Tích điểm thưởng 5% trọn đời</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative hidden lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between overflow-hidden bg-slate-950 p-10 xl:p-14 text-white">
      {/* Background Photography with Gym / Bike Atmosphere */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banners/slide-xe-dap-tap.jpg"
          alt="Bảo An Sport Member Experience"
          fill
          priority
          className="object-cover object-center brightness-[0.38] contrast-125 saturate-75 transition-transform duration-1000 scale-105"
        />
        {/* Rich gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-emerald-500/20 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-20 right-10 size-96 rounded-full bg-teal-500/15 blur-[140px]" />
      </div>

      {/* Top Bar: Brand Logo & Return Link */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="relative h-11 w-48 transition-transform group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          <span>Trang chủ</span>
        </Link>
      </div>

      {/* Center: Editorial Welcome Perks Showcase */}
      <div className="relative z-10 my-auto py-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-extrabold text-emerald-300 backdrop-blur-md">
          <Sparkles className="size-4 text-emerald-400" />
          <span>Đặc Quyền Thành Viên Mới 2026</span>
        </div>

        <h2 className="mt-5 text-3xl font-black leading-tight text-white xl:text-4xl">
          Gia nhập Bảo An Sport, <br className="hidden xl:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
            đồng hành cùng thể lực đỉnh cao
          </span>
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
          Khởi động hành trình rèn luyện thể chất với trang thiết bị chuẩn thi đấu. Nhận ngay đặc quyền giao lắp tận nơi và chế độ bảo hành chính hãng toàn diện.
        </p>

        {/* Welcome Perks Cards Grid */}
        <div className="mt-8 grid grid-cols-3 gap-3.5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10">
            <div className="text-2xl font-black text-emerald-400 xl:text-3xl">100%</div>
            <div className="mt-1 text-xs font-bold text-slate-300">Chính hãng phân phối</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10">
            <div className="text-2xl font-black text-emerald-400 xl:text-3xl">0đ</div>
            <div className="mt-1 text-xs font-bold text-slate-300">Tư vấn lộ trình 1:1</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10">
            <div className="text-2xl font-black text-emerald-400 xl:text-3xl">24T</div>
            <div className="mt-1 text-xs font-bold text-slate-300">Bảo hành điện tử</div>
          </div>
        </div>

        {/* Service Commitment Box */}
        <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1.5">
            <ShieldCheck className="size-4" />
            <span>Cam kết chất lượng dịch vụ</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Trang bị thể thao chuẩn thi đấu, hỗ trợ giao lắp tận nơi và bảo dưỡng định kỳ trọn đời cho mọi hội viên Bảo An Sport.
          </p>
        </div>
      </div>

      {/* Bottom Trust Commitments */}
      <div className="relative z-10 grid grid-cols-2 gap-3.5 border-t border-white/10 pt-6 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
          <span>Giao lắp hỏa tốc toàn quốc</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
          <span>Cam kết 100% chính hãng</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
          <span>Đổi mới trong 7 ngày nếu lỗi</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="size-4 shrink-0 text-emerald-400" />
          <span>Hỗ trợ kỹ thuật 24/7 trọn đời</span>
        </div>
      </div>
    </div>
  );
}
