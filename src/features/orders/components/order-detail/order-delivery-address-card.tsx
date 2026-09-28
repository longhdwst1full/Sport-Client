import { Check, Copy, MapPin, Phone, Store, User } from 'lucide-react';
import type { OrderDetailView } from '../../model/order.mapper';

export function OrderDeliveryAddressCard({
  view,
  copiedAddress,
  onCopyAddress,
}: {
  view: OrderDetailView | undefined;
  copiedAddress: boolean;
  onCopyAddress: () => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
            <MapPin className="size-4.5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Địa chỉ giao hàng</h2>
            <p className="text-xs text-slate-500">Thông tin nhận kiện hàng</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCopyAddress}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          title="Sao chép toàn bộ thông tin người nhận"
        >
          {copiedAddress ? (
            <>
              <Check className="size-3 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Chép địa chỉ</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm sm:text-base">
            <User className="size-4 text-emerald-600" />
            <span>{view?.recipientName}</span>
          </div>
          <span className="text-slate-300">|</span>
          <a
            href={`tel:${view?.recipientPhone}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:underline"
            title="Bấm để gọi"
          >
            <Phone className="size-3.5" />
            {view?.recipientPhone}
          </a>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 font-normal">
          {view?.recipientAddress}
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
          <Store className="size-4 text-emerald-600 shrink-0" />
          <span>
            Chuẩn bị và xuất phát từ: <strong className="text-slate-900">{view?.branchName}</strong>
          </span>
        </div>
      </div>
    </section>
  );
}
