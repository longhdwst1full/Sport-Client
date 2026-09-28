import { Check, Copy, Truck } from 'lucide-react';
import type { OrderDetailView } from '../../model/order.mapper';
import { OrderMilestoneStepper } from './order-milestone-stepper';
import { OrderShippingInfo } from './order-shipping-info';

/** Khối "Tiến trình giao hàng": mã vận đơn ở đầu khối, stepper mốc đơn và thông tin vận chuyển. */
export function OrderShipmentSection({
  view,
  copiedTrackingNo,
  onCopyTrackingNo,
  showTimeline,
  setShowTimeline,
}: {
  view: OrderDetailView | undefined;
  copiedTrackingNo: boolean;
  onCopyTrackingNo: (code: string) => void;
  showTimeline: boolean;
  setShowTimeline: (value: boolean) => void;
}) {
  return (
    <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Truck className="size-4.5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Tiến trình giao hàng</h2>
            <p className="text-xs text-slate-500">Quy trình xử lý đóng gói và vận chuyển đơn hàng đến tay bạn</p>
          </div>
        </div>

        {view?.shipment?.trackingNo && (
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500">Mã vận đơn:</span>
            <span className="font-mono text-xs font-black text-slate-900">{view.shipment.trackingNo}</span>
            <button
              type="button"
              onClick={() => onCopyTrackingNo(view.shipment?.trackingNo ?? '')}
              className="rounded p-1 text-slate-400 hover:text-slate-700 transition"
              title="Sao chép mã vận đơn"
            >
              {copiedTrackingNo ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            </button>
          </div>
        )}
      </div>

      <OrderMilestoneStepper milestones={view?.milestones} />

      <OrderShippingInfo
        view={view}
        copiedTrackingNo={copiedTrackingNo}
        onCopyTrackingNo={onCopyTrackingNo}
        showTimeline={showTimeline}
        setShowTimeline={setShowTimeline}
      />
    </section>
  );
}
