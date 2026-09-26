import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Dumbbell,
  Footprints,
  Goal,
  HeartPulse,
  Home,
  Phone,
  Sparkles,
} from 'lucide-react';
import { STORE_CONTACT } from '@/shared/constants';

export default function NotFound() {
  const QUICK_CATEGORIES = [
    { title: 'Gym & Thể hình', href: '/category/dung-cu-tap-gym', icon: Dumbbell },
    { title: 'Chạy bộ & Cardio', href: '/category/may-tap-the-duc', icon: Footprints },
    { title: 'Bóng đá & Thể thao', href: '/category/dung-cu-bong-da', icon: Goal },
    { title: 'Yoga & Hồi phục', href: '/category/dung-cu-tap-yoga', icon: HeartPulse },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-16 text-white sm:px-10 lg:px-16 flex items-center justify-center">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Modern 404 Badge Graphic */}
        <div className="mx-auto mb-6 flex justify-center">
          <div className="relative inline-flex items-center justify-center">
            <span className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 opacity-90 select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-400 shadow-xl shadow-emerald-500/30">
                <Dumbbell className="size-7" />
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 backdrop-blur-md">
            <Sparkles className="size-3.5" /> Lỗi 404 · Không tìm thấy trang
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="mt-4 text-balance text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          Không tìm thấy trang bạn yêu cầu!
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg">
          Trang bạn đang tìm kiếm không tồn tại, đã bị chuyển địa chỉ hoặc sản phẩm này tạm thời hết hàng trong kho.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-8 py-4 font-black text-ink shadow-lg shadow-emerald-400/25 transition hover:-translate-y-0.5 hover:bg-emerald-300"
          >
            <Home className="size-4.5" />
            <span>Về trang chủ mua sắm</span>
          </Link>
          <a
            href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 font-bold text-white backdrop-blur-md transition hover:bg-white/10"
          >
            <Phone className="size-4.5 text-emerald-400" />
            <span>Hotline hỗ trợ: {STORE_CONTACT.primaryHotline}</span>
          </a>
        </div>

        {/* Quick Category Shortcuts */}
        <div className="mt-14 border-t border-white/10 pt-10">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
            Khám phá các danh mục thể thao nổi bật:
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {QUICK_CATEGORIES.map(({ title, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:border-emerald-400/40 hover:bg-white/10 hover:shadow-lg"
              >
                <Icon className="size-6 text-emerald-400 transition group-hover:scale-110" />
                <span className="mt-2 text-xs font-bold text-stone-200 group-hover:text-white">
                  {title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
