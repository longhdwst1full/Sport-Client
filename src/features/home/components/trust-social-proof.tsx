import Link from 'next/link';
import { CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { IconList } from '@/foundation/components/structure';
import { STORE_CONFIG, STORE_CONTACT, STORE_POLICY_FACTS, STORE_SHOWROOMS } from '@/shared/constants';

/**
 * Khối tối DUY NHẤT của trang chủ (nhịp: trắng → … → tối → footer). Chỉ nêu điều kiểm chứng được:
 * năm thành lập, số showroom, phạm vi giao, chính sách đổi trả (`STORE_POLICY_FACTS`, CMS). Bản trước
 * có "30.000+ khách", "4.9/3.200+ đánh giá", "10+ năm", "bảo hành khung 5 năm" không có nguồn.
 */
const COMMITMENTS = [
  'Tư vấn chọn thiết bị theo diện tích, mục tiêu',
  STORE_POLICY_FACTS.shippingSummary,
  STORE_POLICY_FACTS.returnSummary,
  STORE_POLICY_FACTS.warrantySummary,
].map((label) => ({ icon: CheckCircle2, label }));

const FACTS = [
  { value: `Từ ${STORE_CONFIG.sinceYear}`, caption: 'Phân phối thiết bị thể thao' },
  { value: String(STORE_SHOWROOMS.length), caption: 'Showroom Hà Nội & TP.HCM' },
  { value: '63', caption: 'Tỉnh thành giao tới' },
];

export function TrustSocialProof() {
  return (
    <section className="bg-neutral-950 text-white">
      <div className="page-container grid gap-10 py-14 sm:py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <span className="eyebrow text-neutral-400">An tâm khi đầu tư thiết bị</span>
          <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
            Mua thiết bị tập có người đồng hành
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-300">
            Thiết bị thể thao là khoản đầu tư cho sức khoẻ lâu dài. {STORE_CONFIG.name} tư vấn từ khâu chọn
            máy theo không gian tới giao, lắp đặt và bảo hành.
          </p>

          <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-neutral-800 py-6">
            {FACTS.map((fact) => (
              <div key={fact.caption}>
                <dt className="sr-only">{fact.caption}</dt>
                <dd className="text-2xl font-bold">{fact.value}</dd>
                <dd className="mt-1 text-xs text-neutral-400">{fact.caption}</dd>
              </div>
            ))}
          </dl>

          <IconList
            items={COMMITMENTS}
            columns={2}
            className="mt-6 grid-cols-1 gap-2.5 text-sm text-neutral-300 sm:grid-cols-2"
            iconClassName="text-neutral-400"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-neutral-400" aria-hidden />
            <h3 className="text-base font-semibold">Trải nghiệm máy tại showroom</h3>
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-neutral-400">
              <Clock className="size-3" aria-hidden /> {STORE_CONTACT.openingHoursShort}
            </span>
          </div>

          {STORE_SHOWROOMS.map((showroom) => (
            <div key={showroom.id} className="rounded-xl bg-neutral-900 p-4 text-sm">
              <strong className="mb-1 block font-semibold">{showroom.city}: {showroom.name}</strong>
              <p className="mb-2 leading-relaxed text-neutral-400">{showroom.address}</p>
              <a href={`tel:${showroom.phoneRaw}`} className="focus-ring-inverse inline-flex items-center gap-1.5 rounded font-semibold text-neutral-200 hover:text-white">
                <Phone className="size-3" aria-hidden /> Hotline: {showroom.phone}
              </a>
            </div>
          ))}

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/contact" className={buttonVariants({ variant: 'inverse', className: 'focus-ring-inverse flex-1' })}>
              Xem chỉ đường
            </Link>
            <a
              href={STORE_CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'outline', className: 'focus-ring-inverse flex-1 border-neutral-700 bg-transparent text-white hover:border-white hover:bg-white/10' })}
            >
              Chat Zalo tư vấn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
