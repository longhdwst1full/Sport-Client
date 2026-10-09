import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { STORE_CONTACT } from '@/shared/constants';

export function ArticleConsultationCta() {
  return (
    <aside className="relative my-10 overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/70 p-6 text-white shadow-xl shadow-red-950/20 sm:p-8">
      {/* Decorative background glow elements */}
      <div className="pointer-events-none absolute -left-12 -top-12 size-56 rounded-full bg-red-600/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-12 -bottom-12 size-56 rounded-full bg-rose-500/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Header Badge & Text - Full Width */}
        <div className="w-full">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/60 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-red-200 shadow-xs backdrop-blur-md whitespace-nowrap max-w-fit">
            <Sparkles className="size-3.5 text-amber-400 shrink-0" aria-hidden="true" />
            <span>Tư vấn thể thao chuyên nghiệp 1:1</span>
          </div>

          <h2 className="mt-3 text-xl font-black leading-snug tracking-tight text-white sm:text-2xl lg:text-3xl">
            Cần giải pháp thiết bị chuẩn cho phòng tập hoặc gia đình?
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Đội ngũ chuyên viên Bảo An Sport sẵn sàng khảo sát, đo đạc mặt bằng và tư vấn combo thiết bị tối ưu chi phí, bảo hành chính hãng đến 5 năm.
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-red-600/30 transition hover:from-red-500 hover:to-rose-500 hover:shadow-xl hover:shadow-red-600/40 active:scale-95 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <Phone className="size-4 animate-phone-ring text-white shrink-0" aria-hidden="true" />
            <span>Gọi ngay: {STORE_CONTACT.primaryHotline}</span>
          </a>

          <a
            href={STORE_CONTACT.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-2xl border border-sky-400/30 bg-sky-500/15 px-5 py-3 text-xs sm:text-sm font-bold text-sky-100 backdrop-blur-sm transition hover:bg-sky-500/25 hover:border-sky-400/50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <MessageCircle className="size-4 text-sky-300 shrink-0" aria-hidden="true" />
            <span>Chat qua Zalo</span>
            <span className="sr-only"> (mở tab mới)</span>
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 rounded-2xl border border-amber-400/30 bg-amber-500/15 px-5 py-3 text-xs sm:text-sm font-bold text-amber-100 backdrop-blur-sm transition hover:bg-amber-500/25 hover:border-amber-400/50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <MapPin className="size-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span>Hệ thống Showroom</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
