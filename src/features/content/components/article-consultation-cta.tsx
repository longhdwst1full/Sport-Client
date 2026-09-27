'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { STORE_CONTACT } from '@/shared/constants';

export function ArticleConsultationCta() {
  return (
    <aside className="my-10 overflow-hidden rounded-3xl border border-emerald-200/90 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 text-white shadow-xl sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
            <Sparkles className="size-3.5" />
            Tư vấn thể thao chuyên nghiệp 1:1
          </div>
          <h3 className="mt-3 text-xl sm:text-2xl font-black text-white leading-snug">
            Cần giải pháp thiết bị chuẩn cho phòng tập hoặc gia đình?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Đội ngũ chuyên viên Bảo An Sport sẵn sàng khảo sát, đo đạc mặt bằng và tư vấn combo thiết bị tối ưu chi phí, bảo hành chính hãng đến 5 năm.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-black text-white shadow-md transition hover:bg-emerald-500 active:scale-95"
          >
            <Phone className="size-4" />
            <span>Gọi ngay: {STORE_CONTACT.primaryHotline}</span>
          </a>

          <a
            href={STORE_CONTACT.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            <MessageCircle className="size-4 text-emerald-400" />
            <span>Chat qua Zalo</span>
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            <MapPin className="size-4 text-amber-400" />
            <span>Hệ thống Showroom</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
