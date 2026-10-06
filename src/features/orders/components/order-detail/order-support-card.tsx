import { Headphones, MessageCircle, Phone } from 'lucide-react';

export function OrderSupportCard({ orderNo, onOpenSupport }: { orderNo: string; onOpenSupport: () => void }) {
  return (
    <section className="rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/60 via-white to-white p-6 shadow-card">
      <div className="flex items-center gap-2.5 border-b border-brand-100 pb-3">
        <div className="grid size-9 place-items-center rounded-2xl bg-brand-600 text-white shadow-sm">
          <Headphones className="size-4.5" />
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-900">Bạn cần hỗ trợ về đơn hàng?</h2>
          <p className="text-[11px] text-slate-500">Đội ngũ Bảo An Sport sẵn sàng phục vụ 8h00 - 22h00</p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <a
          href="tel:0862576222"
          className="flex items-center justify-between rounded-xl border border-brand-200/80 bg-white p-3 text-xs font-bold text-slate-800 transition hover:bg-brand-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          <div className="flex items-center gap-2">
            <Phone className="size-4 text-brand-600" />
            <span>Hotline tổng đài (miễn phí)</span>
          </div>
          <span className="font-mono text-brand-700 font-black">0862 576 222</span>
        </a>

        <button
          type="button"
          onClick={onOpenSupport}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-800 transition hover:bg-slate-50"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="size-4 text-blue-600" />
            <span>Chat tư vấn trực tuyến</span>
          </div>
          <span className="text-[11px] text-slate-400">Đính kèm #{orderNo} →</span>
        </button>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        * Mẹo: Khi liên hệ hỗ trợ, mã đơn <strong className="font-mono text-slate-800">#{orderNo}</strong> sẽ giúp nhân viên tra cứu nhanh nhất.
      </p>
    </section>
  );
}
