import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { STORE_CONTACT } from '@/shared/constants';

export function ArticleConsultationCta() {
  return (
    <aside className="relative my-12 overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-br from-neutral-950 via-neutral-900 to-red-950/80 p-6 text-white shadow-2xl shadow-red-950/40 sm:p-10">
      {/* Decorative background glow elements */}
      <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-red-600/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-red-500/15 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-gradient-to-r from-red-600/30 to-red-600/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-red-200 shadow-sm backdrop-blur-md">
            <Sparkles className="size-3.5 text-amber-400" aria-hidden="true" />
            Tư vấn thể thao chuyên nghiệp 1:1
          </div>
          <h2 className="mt-3.5 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
            Cần giải pháp thiết bị chuẩn cho phòng tập hoặc gia đình?
          </h2>
          <p className="mt-2.5 text-sm text-neutral-300 leading-relaxed sm:text-base">
            Đội ngũ chuyên viên Bảo An Sport sẵn sàng khảo sát, đo đạc mặt bằng và tư vấn combo thiết bị tối ưu chi phí, bảo hành chính hãng đến 5 năm.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-600 px-5 py-3.5 text-xs font-black text-white shadow-lg shadow-red-600/30 transition hover:from-red-500 hover:to-red-500 hover:shadow-xl hover:shadow-red-600/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            <Phone className="size-4 animate-phone-ring text-white" aria-hidden="true" />
            <span>Gọi ngay: {STORE_CONTACT.primaryHotline}</span>
          </a>

          <a
            href={STORE_CONTACT.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-2xl border border-neutral-400/30 bg-neutral-500/15 px-5 py-3.5 text-xs font-bold text-neutral-100 backdrop-blur-sm transition hover:bg-neutral-500/25 hover:border-neutral-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            <MessageCircle className="size-4 text-neutral-300" aria-hidden="true" />
            <span>Chat qua Zalo</span>
            <span className="sr-only"> (mở tab mới)</span>
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 rounded-2xl border border-amber-400/30 bg-amber-500/15 px-5 py-3.5 text-xs font-bold text-amber-100 backdrop-blur-sm transition hover:bg-amber-500/25 hover:border-amber-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            <MapPin className="size-4 text-amber-400" aria-hidden="true" />
            <span>Hệ thống Showroom</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
