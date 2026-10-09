import { Headphones, MessageCircle, Phone } from 'lucide-react';
import { STORE_CONTACT } from '@/shared/constants';

export function OrderSupportCard({ orderNo, onOpenSupport }: { orderNo: string; onOpenSupport: () => void }) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-50/60 via-white to-white p-6 shadow-card">
      <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-3">
        <div className="grid size-9 place-items-center rounded-2xl bg-neutral-900 text-white shadow-sm">
          <Headphones className="size-4.5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-neutral-900">Bạn cần hỗ trợ về đơn hàng?</h2>
          <p className="text-2xs text-neutral-500">Đội ngũ Bảo An Sport phục vụ {STORE_CONTACT.openingHoursShort}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <a
          href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
          className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white p-3 text-xs font-bold text-neutral-800 transition hover:bg-neutral-50/50 focus-ring"
        >
          <div className="flex items-center gap-2">
            <Phone className="size-4 text-neutral-700" />
            <span>Hotline</span>
          </div>
          <span className="font-mono text-neutral-900 font-bold">{STORE_CONTACT.primaryHotline}</span>
        </a>

        <button
          type="button"
          onClick={onOpenSupport}
          className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white p-3 text-xs font-bold text-neutral-800 transition hover:bg-neutral-50"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="size-4 text-neutral-600" />
            <span>Chat tư vấn trực tuyến</span>
          </div>
          <span className="text-2xs text-neutral-400">Đính kèm #{orderNo} →</span>
        </button>
      </div>

      <p className="mt-3 text-2xs leading-relaxed text-neutral-500">
        * Mẹo: Khi liên hệ hỗ trợ, mã đơn <strong className="font-mono text-neutral-800">#{orderNo}</strong> sẽ giúp nhân viên tra cứu nhanh nhất.
      </p>
    </section>
  );
}
