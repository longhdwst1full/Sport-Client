'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  RotateCw,
  Home,
  Phone,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { STORE_CONFIG, STORE_CONTACT } from '@/shared/constants';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    reset();
    setTimeout(() => setIsRetrying(false), 1000);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-16 text-white sm:px-10 lg:px-16 flex items-center justify-center">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Modern Error Visual */}
        <div className="mx-auto mb-6 flex justify-center">
          <div className="relative grid size-24 place-items-center rounded-3xl bg-red-500/15 border border-red-500/30 text-red-400 shadow-2xl shadow-red-500/20">
            <AlertTriangle className="size-12 animate-pulse text-red-400" />
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-950/60 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-red-400 backdrop-blur-md">
            <ShieldAlert className="size-3.5" /> Sự cố hệ thống · Gián đoạn kết nối
          </span>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-balance text-3xl font-black tracking-tight sm:text-5xl">
          Đã có sự cố kết nối tới hệ thống!
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-stone-300">
          Hệ thống tạm thời không thể xử lý yêu cầu hoặc đường truyền mạng không ổn định. Vui lòng bấm thử lại hoặc liên hệ hỗ trợ để tiếp tục.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-8 py-4 font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-400 disabled:opacity-60"
          >
            <RotateCw className={`size-4.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Đang tải lại dữ liệu…' : 'Thử tải lại trang'}</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 font-bold text-white backdrop-blur-md transition hover:bg-white/10"
          >
            <Home className="size-4.5" />
            <span>Về trang chủ</span>
          </Link>
        </div>

        {/* Support Hotline */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <p className="text-xs text-stone-400">
            Nếu sự cố vẫn tiếp diễn, vui lòng liên hệ đội ngũ {STORE_CONFIG.name} để được hỗ trợ tức thời:
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-6 text-sm font-bold">
            <a href={`tel:${STORE_CONTACT.primaryHotlineRaw}`} className="inline-flex items-center gap-2 text-emerald-400 hover:underline">
              <Phone className="size-4" /> {STORE_CONTACT.primaryHotline} ({STORE_CONTACT.openingHours})
            </a>
            <span className="text-stone-600">·</span>
            <span className="text-stone-300">{STORE_CONTACT.email}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
