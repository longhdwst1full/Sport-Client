import Link from 'next/link';
import { CheckCircle2, Clock, MapPin, Phone, Star } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { IconList } from '@/foundation/components/structure';
import {
  STORE_CONTACT,
  STORE_MARKETING_STATS,
  STORE_POLICY_FACTS,
  STORE_SHOWROOMS,
} from '@/shared/constants';

/**
 * Khối tối duy nhất của trang chủ (nhịp: trắng → … → tối → footer). Số liệu marketing lấy từ
 * `STORE_MARKETING_STATS`; cam kết chính sách lấy từ `STORE_POLICY_FACTS` để khớp trang CMS.
 */
const COMMITMENTS = [
  'Miễn phí tư vấn setup theo diện tích',
  STORE_POLICY_FACTS.shippingSummary,
  STORE_POLICY_FACTS.returnSummary,
  STORE_MARKETING_STATS.warrantyHighlight,
].map((label) => ({ icon: CheckCircle2, label }));

const FACTS = [
  { value: STORE_MARKETING_STATS.yearsLabel, caption: 'Kinh nghiệm phân phối' },
  { value: '100%', caption: 'Hàng chính hãng' },
];

const OUTLINE_ON_DARK =
  'focus-ring-inverse border-white/20 bg-white/5 text-white hover:border-white/60 hover:bg-white/10';

export function TrustSocialProof() {
  return (
    <section className="page-section">
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/70 p-6 text-white sm:p-10 lg:p-12 shadow-2xl">
        {/* Rich Ambient Glow Backgrounds */}
        <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-red-600/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-amber-500/15 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-950/70 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-red-200 backdrop-blur-md">
              <CheckCircle2 className="size-3.5 text-red-400" aria-hidden />
              <span>An tâm khi đầu tư thiết bị</span>
            </div>

            <h2 className="mt-3.5 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              Vì sao hơn <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-red-300">{STORE_MARKETING_STATS.customers}</span> khách hàng tin chọn Bảo An Sport?
            </h2>
            <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
              Thiết bị thể thao là khoản đầu tư cho sức khoẻ lâu dài. Không chỉ cung cấp sản phẩm chính
              hãng, Bảo An Sport đồng hành cùng bạn từ khâu tư vấn không gian đến lắp đặt và bảo trì.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-slate-800/90 py-6 sm:gap-8">
              <div>
                <div className="flex items-center gap-1.5">
                  <Star className="size-5 fill-amber-400 text-amber-400 drop-shadow-xs" aria-hidden />
                  <span className="text-2xl font-black text-white">{STORE_MARKETING_STATS.rating}</span>
                  <span className="text-xs font-bold text-slate-400">/ 5.0</span>
                </div>
                <span className="mt-1 block text-xs text-slate-400 font-medium">
                  {STORE_MARKETING_STATS.reviewCount} đánh giá tin cậy
                </span>
              </div>
              {FACTS.map((fact) => (
                <div key={fact.caption} className="flex items-center gap-6 sm:gap-8">
                  <span className="h-8 w-px bg-slate-800" aria-hidden />
                  <div>
                    <span className="block text-2xl font-black text-white">{fact.value}</span>
                    <span className="mt-1 block text-xs text-slate-400 font-medium">{fact.caption}</span>
                  </div>
                </div>
              ))}
            </div>

            <IconList
              items={COMMITMENTS}
              columns={2}
              className="mt-6 grid-cols-1 gap-3 text-xs sm:text-sm text-slate-200 font-medium sm:grid-cols-2"
              iconClassName="text-emerald-400"
            />
          </div>

          {/* Showroom Box on the Right */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl sm:p-7">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800/90 pb-4">
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                  <MapPin className="size-4" aria-hidden />
                </div>
                <h3 className="text-base font-black text-white">Trải nghiệm máy tại showroom</h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-2xs font-extrabold text-slate-300 shadow-2xs">
                <Clock className="size-3 text-amber-400" aria-hidden />
                {STORE_CONTACT.openingHoursShort}
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {STORE_SHOWROOMS.map((showroom) => (
                <div key={showroom.id} className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-4 transition hover:border-slate-700">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <strong className="block font-black text-white">
                      {showroom.city}: {showroom.name}
                    </strong>
                    <span className="rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-300 text-2xs font-extrabold px-2 py-0.5 shrink-0">
                      {showroom.id === 'hanoi' ? 'Trụ sở' : 'Chi nhánh'}
                    </span>
                  </div>
                  <p className="mb-2 leading-relaxed text-slate-400 text-xs font-medium">{showroom.address}</p>
                  <a
                    href={`tel:${showroom.phoneRaw}`}
                    className="inline-flex items-center gap-1.5 font-extrabold text-red-400 hover:text-red-300 transition text-xs"
                  >
                    <Phone className="size-3.5 text-red-500 animate-phone-ring" aria-hidden />
                    Hotline: {showroom.phone}
                  </a>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/contact" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-black text-slate-950 shadow-md transition hover:bg-slate-100 active:scale-95 whitespace-nowrap">
                <span>Xem chỉ đường</span>
              </Link>
              <a
                href={STORE_CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-500/15 px-5 py-3 text-xs sm:text-sm font-bold text-sky-200 backdrop-blur-sm transition hover:bg-sky-500/25 active:scale-95 whitespace-nowrap"
              >
                <span>Chat Zalo tư vấn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
