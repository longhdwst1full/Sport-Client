import Link from 'next/link';
import { Award, CheckCircle2, Clock, MapPin, Phone, Star } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { IconList } from '@/foundation/components/structure';
import { STORE_CONTACT, STORE_SHOWROOMS } from '@/shared/constants';

const DARK_FOCUS = 'focus-visible:ring-white focus-visible:ring-offset-slate-900';

const COMMITMENTS = [
  'Miễn phí tư vấn setup theo diện tích',
  'Giao hàng và hỗ trợ lắp đặt tận nơi',
  'Đổi mới trong 7 ngày nếu lỗi kỹ thuật',
  'Bảo hành khung sườn lên đến 5 năm',
].map((label) => ({ icon: CheckCircle2, label }));

const FACTS = [
  { value: '10+ Năm', valueClassName: 'text-white', caption: 'Kinh nghiệm phân phối' },
  { value: '100%', valueClassName: 'text-white', caption: 'Chính hãng có VAT' },
];

export function TrustSocialProof() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-800/80 bg-gradient-to-br from-[#0c1222] via-[#0f172a] to-[#1e1b2e] text-white p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Subtle Sports Ambient Lighting */}
        <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-red-600/15 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 size-80 rounded-full bg-blue-600/10 blur-[100px]" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          {/* Left Column: Proof points & Rating */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/25 px-3 py-1 text-xs font-black uppercase tracking-wider text-red-400">
              An tâm khi đầu tư thiết bị
            </span>

            {/* TODO(data): số liệu chưa có nguồn xác nhận ("30.000+ khách hàng") — chờ chủ shop quyết định giữ/bỏ. */}
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              Vì sao hơn 30.000+ khách hàng tin chọn Bảo An Sport?
            </h2>

            <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xl">
              Chúng tôi hiểu rằng thiết bị thể thao là khoản đầu tư cho sức khỏe lâu dài. Không chỉ cung cấp sản phẩm chính hãng, Bảo An Sport đồng hành cùng bạn từ khâu tư vấn không gian đến bảo trì định kỳ.
            </p>

            {/* TODO(data): số liệu chưa có nguồn xác nhận ("4.9/5", "3.200+ đánh giá", "10+ năm") — không lấy từ API đánh giá. */}
            <div className="mt-6 flex flex-wrap items-center gap-6 sm:gap-8 border-y border-slate-800 py-6">
              <div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="size-5 fill-amber-400" />
                  <span className="text-2xl font-black text-white">4.9</span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
                <span className="mt-1 block text-xs text-slate-400">3.200+ đánh giá xác thực</span>
              </div>

              {FACTS.map((fact) => (
                <div key={fact.caption} className="contents">
                  <div className="h-8 w-px bg-slate-800" aria-hidden="true" />
                  <div>
                    <span className={`text-2xl font-black ${fact.valueClassName}`}>{fact.value}</span>
                    <span className="mt-1 block text-xs text-slate-400">{fact.caption}</span>
                  </div>
                </div>
              ))}
            </div>

            <IconList
              items={COMMITMENTS}
              columns={2}
              className="mt-6 grid-cols-1 gap-2.5 text-xs font-semibold text-slate-300 sm:grid-cols-2"
              iconClassName="text-success-400"
            />
          </div>

          {/* Right Column: Showroom System */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-slate-300" />
                <h3 className="text-base font-black text-white">Trải nghiệm máy tại Showroom</h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/10 px-2.5 py-0.5 text-xs font-bold text-slate-300">
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
                    className="inline-flex items-center gap-1.5 font-bold text-slate-300 hover:text-slate-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
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
                className={buttonVariants({
                  variant: 'primary',
                  className: `flex-1 text-xs font-bold shadow-md shadow-slate-900 ${DARK_FOCUS}`,
                })}
              >
                Xem chi tiết chỉ đường
              </Link>
              <a
                href={STORE_CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: 'secondary',
                  className: `border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 ${DARK_FOCUS}`,
                })}
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
