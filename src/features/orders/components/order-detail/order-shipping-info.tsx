import { Check, ChevronDown, ChevronUp, Copy, ExternalLink, PackageCheck, Truck } from 'lucide-react';
import type { OrderDetailView } from '../../model/order.mapper';

/** Hãng, mã vận đơn, dự kiến giao, tình trạng bưu kiện và lịch sử cập nhật thu gọn được. */
export function OrderShippingInfo({
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
    <div className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5">
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-2">
          <Truck className="size-4 text-emerald-600" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            Thông tin vận chuyển thực tế
          </span>
        </div>
        {view?.shipment?.trackingUrl && (
          <a
            href={view.shipment.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
          >
            <span>Tra cứu trên hệ thống hãng</span>
            <ExternalLink className="size-3" />
          </a>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs">
          <span className="block text-[11px] font-bold text-slate-400 uppercase">Đơn vị vận chuyển</span>
          <strong className="mt-1 block text-sm font-bold text-slate-900">
            {view?.shipment?.carrierLabel || 'Chưa phân bổ'}
          </strong>
          <span className="mt-0.5 block text-[11px] text-slate-500">Đối tác giao nhận tiêu chuẩn</span>
        </div>

        <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs">
          <span className="block text-[11px] font-bold text-slate-400 uppercase">Mã vận đơn</span>
          {view?.shipment?.trackingNo ? (
            <div className="mt-1 flex items-center gap-1.5">
              <strong className="font-mono text-sm font-black text-slate-900">
                {view.shipment.trackingNo}
              </strong>
              <button
                type="button"
                onClick={() => onCopyTrackingNo(view.shipment?.trackingNo ?? '')}
                className="rounded p-1 text-slate-400 hover:text-slate-700 transition"
                title="Sao chép"
              >
                {copiedTrackingNo ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              </button>
            </div>
          ) : (
            <strong className="mt-1 block text-sm font-semibold text-slate-500">Chưa có mã vận đơn</strong>
          )}
          <span className="mt-0.5 block text-[11px] text-slate-500">
            {view?.shipment?.hasTracking ? 'Đã tạo vận đơn điện tử' : 'Đang chuẩn bị bàn giao'}
          </span>
        </div>

        <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs">
          <span className="block text-[11px] font-bold text-slate-400 uppercase">Dự kiến giao hàng</span>
          <strong className="mt-1 block text-sm font-bold text-emerald-700">
            {view?.shipment?.estimatedDeliveryLabel}
          </strong>
          <span className="mt-0.5 block text-[11px] text-slate-500">Trong giờ hành chính</span>
        </div>

        <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs">
          <span className="block text-[11px] font-bold text-slate-400 uppercase">Tình trạng bưu kiện</span>
          <strong className="mt-1 block text-sm font-bold text-slate-900 truncate">
            {view?.shipment?.statusText}
          </strong>
          <span className="mt-0.5 block text-[11px] text-slate-500 truncate">
            Kho xuất: {view?.warehouseName}
          </span>
        </div>
      </div>

      {/* Tracking & Timeline Toggle */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        {view?.shipment?.trackingUrl ? (
          <a
            href={view.shipment.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Truck className="size-3.5" /> Theo dõi lộ trình trực tiếp <ExternalLink className="size-3" />
          </a>
        ) : (
          <span className="text-slate-500 text-xs">
            {view?.shipment?.hasTracking
              ? `Vận đơn ${view.shipment.trackingNo} đang được phân bổ tới bưu tá phát.`
              : 'Đơn hàng đang trong quy trình đóng gói tại kho và chuẩn bị bàn giao cho bưu cục.'}
          </span>
        )}

        {(view?.timeline ?? []).length > 0 && (
          <button
            type="button"
            onClick={() => setShowTimeline(!showTimeline)}
            className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-emerald-700 transition ml-auto"
          >
            <PackageCheck className="size-3.5 text-emerald-600" />
            Lịch sử cập nhật chi tiết ({view?.timeline.length})
            {showTimeline ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
        )}
      </div>

      {/* Collapsible status history */}
      {showTimeline && (view?.timeline ?? []).length > 0 && (
        <div className="mt-3 space-y-2 rounded-2xl bg-white p-4 border border-slate-200/80 animate-fade-in text-xs">
          {(view?.timeline ?? []).map((entry) => (
            <div key={entry.key} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
              <div>
                <span className="font-bold text-slate-900">{entry.statusLabel}</span>
                {entry.note && <p className="mt-0.5 text-slate-600">{entry.note}</p>}
              </div>
              <span className="shrink-0 text-[11px] text-slate-400 font-mono">{entry.occurredLabel}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
