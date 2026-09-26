'use client';

import Link from 'next/link';
import { Award, CheckCircle2, Clock, MapPin, Phone, ShieldCheck, Star } from 'lucide-react';
import { STORE_CONTACT, STORE_SHOWROOMS } from '@/shared/constants';

export function TrustSocialProof() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          {/* Left Column: Proof points & Rating */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="size-4 text-emerald-400" />
              AN TÂM TUYỆT ĐỐI KHI ĐẦU TƯ THIẾT BỊ
            </div>

            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              Vì sao hơn 30.000+ khách hàng tin chọn Bảo An Sport?
            </h2>

            <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xl">
              Chúng tôi hiểu rằng thiết bị thể thao là khoản đầu tư cho sức khỏe lâu dài. Không chỉ cung cấp sản phẩm chính hãng, Bảo An Sport đồng hành cùng bạn từ khâu tư vấn không gian đến bảo trì định kỳ.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 sm:gap-8 border-y border-slate-800 py-6">
              <div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="size-5 fill-amber-400" />
                  <span className="text-2xl font-black text-white">4.9</span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
                <span className="mt-1 block text-xs text-slate-400">3.200+ đánh giá xác thực</span>
              </div>

              <div className="h-8 w-px bg-slate-800" />

              <div>
                <span className="text-2xl font-black text-emerald-400">10+ Năm</span>
                <span className="mt-1 block text-xs text-slate-400">Kinh nghiệm phân phối</span>
              </div>

              <div className="h-8 w-px bg-slate-800" />

              <div>
                <span className="text-2xl font-black text-white">100%</span>
                <span className="mt-1 block text-xs text-slate-400">Chính hãng có VAT</span>
              </div>
            </div>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>Miễn phí tư vấn setup theo diện tích</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>Giao hàng và hỗ trợ lắp đặt tận nơi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>Đổi mới trong 7 ngày nếu lỗi kỹ thuật</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>Bảo hành khung sườn lên đến 5 năm</span>
              </div>
            </div>
          </div>

          {/* Right Column: Showroom System */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">Trải nghiệm máy tại Showroom</h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                <Clock className="size-3" />
                8:30 - 21:30
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {STORE_SHOWROOMS.map((showroom) => (
                <div
                  key={showroom.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 transition hover:border-slate-700"
                >
                  <strong className="block text-sm font-bold text-white mb-1">
                    {showroom.city}: {showroom.name}
                  </strong>
                  <p className="text-slate-400 mb-2 leading-relaxed">
                    {showroom.address}
                  </p>
                  <a
                    href={`tel:${showroom.phoneRaw}`}
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    <Phone className="size-3" />
                    <span>Hotline: {showroom.phone}</span>
                  </a>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Link
                href="/contact"
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500 shadow-md shadow-emerald-950"
              >
                Xem chi tiết chỉ đường
              </Link>
              <a
                href={STORE_CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
              >
                Chat Zalo tư vấn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
