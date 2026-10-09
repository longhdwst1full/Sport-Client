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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-950 p-6 text-white sm:p-10 lg:p-12">
        {/* Ánh sáng nền rất nhẹ theo màu logo; chỉ trang trí, không mang thông tin. */}
        <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-brand-600/15 blur-[100px]" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-white/5 blur-[100px]" aria-hidden />

        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <span className="eyebrow text-brand-400">An tâm khi đầu tư thiết bị</span>
            <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              Vì sao hơn {STORE_MARKETING_STATS.customers} khách hàng tin chọn Bảo An Sport?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-300">
              Thiết bị thể thao là khoản đầu tư cho sức khoẻ lâu dài. Không chỉ cung cấp sản phẩm chính
              hãng, Bảo An Sport đồng hành cùng bạn từ khâu tư vấn không gian đến lắp đặt và bảo trì.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-white/10 py-6 sm:gap-8">
              <div>
                <div className="flex items-center gap-1.5">
                  <Star className="size-5 fill-amber-400 text-amber-400" aria-hidden />
                  <span className="text-2xl font-bold">{STORE_MARKETING_STATS.rating}</span>
                  <span className="text-xs text-neutral-400">/ 5.0</span>
                </div>
                <span className="mt-1 block text-xs text-neutral-400">
                  {STORE_MARKETING_STATS.reviewCount} đánh giá
                </span>
              </div>
              {FACTS.map((fact) => (
                <div key={fact.caption} className="flex items-center gap-6 sm:gap-8">
                  <span className="h-8 w-px bg-white/10" aria-hidden />
                  <div>
                    <span className="block text-2xl font-bold">{fact.value}</span>
                    <span className="mt-1 block text-xs text-neutral-400">{fact.caption}</span>
                  </div>
                </div>
              ))}
            </div>

            <IconList
              items={COMMITMENTS}
              columns={2}
              className="mt-6 grid-cols-1 gap-2.5 text-sm text-neutral-300 sm:grid-cols-2"
              iconClassName="text-success-400"
            />
          </div>

          <div className="flex flex-col gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm sm:p-7">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-neutral-300" aria-hidden />
                <h3 className="text-base font-semibold">Trải nghiệm máy tại showroom</h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-neutral-300">
                <Clock className="size-3" aria-hidden />
                {STORE_CONTACT.openingHoursShort}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              {STORE_SHOWROOMS.map((showroom) => (
                <div key={showroom.id} className="rounded-lg bg-neutral-950/60 p-4 ring-1 ring-white/5">
                  <strong className="mb-1 block font-semibold">
                    {showroom.city}: {showroom.name}
                  </strong>
                  <p className="mb-2 leading-relaxed text-neutral-400">{showroom.address}</p>
                  <a
                    href={`tel:${showroom.phoneRaw}`}
                    className="focus-ring-inverse inline-flex items-center gap-1.5 rounded font-semibold text-neutral-200 hover:text-white"
                  >
                    <Phone className="size-3.5" aria-hidden />
                    Hotline: {showroom.phone}
                  </a>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/contact" className={buttonVariants({ variant: 'inverse', className: 'focus-ring-inverse flex-1 whitespace-nowrap' })}>
                Xem chỉ đường
              </Link>
              <a
                href={STORE_CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'outline', className: `${OUTLINE_ON_DARK} flex-1 whitespace-nowrap` })}
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
