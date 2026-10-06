import type { ReactNode } from 'react';
import { Check, ChevronDown, ChevronUp, Copy, ExternalLink, PackageCheck, Truck } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import type { OrderDetailView } from '../../model/order.mapper';

export type OrderShippingInfoProps = {
  view: OrderDetailView | undefined;
  copiedTrackingNo: boolean;
  onCopyTrackingNo: (code: string) => void;
  showTimeline: boolean;
  setShowTimeline: (value: boolean) => void;
};

/** Nút icon sao chép mã vận đơn (dùng ở header khối giao hàng và ô "Mã vận đơn"). */
export function TrackingNoCopyButton({
  trackingNo,
  copied,
  onCopy,
  className,
}: {
  trackingNo: string;
  copied: boolean;
  onCopy: (code: string) => void;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onCopy(trackingNo)}
      className={`grid size-9 place-items-center rounded-lg text-slate-500 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${className}`}
      title="Sao chép mã vận đơn"
      aria-label={copied ? 'Đã sao chép mã vận đơn' : 'Sao chép mã vận đơn'}
    >
      {copied ? <Check className="size-3.5 text-success-600" /> : <Copy className="size-3.5" />}
    </button>
  );
}

/** Một ô thông tin vận chuyển: nhãn nhỏ in hoa, giá trị, dòng chú thích. */
function ShipmentInfoTile({ label, hint, children }: { label: string; hint: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs">
      <span className="block text-[11px] font-bold text-slate-400 uppercase">{label}</span>
      {children}
      <span className="mt-0.5 block truncate text-[11px] text-slate-500">{hint}</span>
    </div>
  );
}

/** Hãng, mã vận đơn, dự kiến giao, tình trạng bưu kiện và lịch sử cập nhật thu gọn được. */
export function OrderShippingInfo({
  view,
  copiedTrackingNo,
  onCopyTrackingNo,
  showTimeline,
  setShowTimeline,
}: OrderShippingInfoProps) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-2">
          <Truck aria-hidden className="size-4 text-brand-600" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            Thông tin vận chuyển thực tế
          </span>
        </div>
        {view?.shipment?.trackingUrl && (
          <a
            href={view.shipment.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
          >
            <span>Tra cứu trên hệ thống hãng</span>
            <ExternalLink aria-hidden className="size-3" />
            <span className="sr-only">(mở tab mới)</span>
          </a>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ShipmentInfoTile label="Đơn vị vận chuyển" hint="Đối tác giao nhận tiêu chuẩn">
          <strong className="mt-1 block text-sm font-bold text-slate-900">
            {view?.shipment?.carrierLabel || 'Chưa phân bổ'}
          </strong>
        </ShipmentInfoTile>

        <ShipmentInfoTile
          label="Mã vận đơn"
          hint={view?.shipment?.hasTracking ? 'Đã tạo vận đơn điện tử' : 'Đang chuẩn bị bàn giao'}
        >
          {view?.shipment?.trackingNo ? (
            <div className="mt-1 flex items-center gap-1.5">
              <strong className="font-mono text-sm font-black text-slate-900">
                {view.shipment.trackingNo}
              </strong>
              <TrackingNoCopyButton
                trackingNo={view.shipment.trackingNo}
                copied={copiedTrackingNo}
                onCopy={onCopyTrackingNo}
                className="-m-1.5 hover:bg-slate-100"
              />
            </div>
          ) : (
            <strong className="mt-1 block text-sm font-semibold text-slate-500">Chưa có mã vận đơn</strong>
          )}
        </ShipmentInfoTile>

        <ShipmentInfoTile label="Dự kiến giao hàng" hint="Trong giờ hành chính">
          <strong className="mt-1 block text-sm font-bold text-brand-700">
            {view?.shipment?.estimatedDeliveryLabel}
          </strong>
        </ShipmentInfoTile>

        <ShipmentInfoTile label="Tình trạng bưu kiện" hint={`Kho xuất: ${view?.warehouseName ?? ''}`}>
          <strong className="mt-1 block text-sm font-bold text-slate-900 truncate">
            {view?.shipment?.statusText}
          </strong>
        </ShipmentInfoTile>
      </div>

      {/* Tracking & Timeline Toggle */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        {view?.shipment?.trackingUrl ? (
          <a
            href={view.shipment.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'primary', className: 'gap-1.5 px-4 text-xs shadow-sm' })}
          >
            <Truck aria-hidden className="size-3.5" /> Theo dõi lộ trình trực tiếp <ExternalLink aria-hidden className="size-3" />
            <span className="sr-only">(mở tab mới)</span>
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
            aria-expanded={showTimeline}
            className="inline-flex min-h-11 items-center gap-1.5 font-bold text-slate-700 hover:text-brand-700 transition ml-auto"
          >
            <PackageCheck aria-hidden className="size-3.5 text-brand-600" />
            Lịch sử cập nhật chi tiết ({view?.timeline.length})
            {showTimeline ? <ChevronUp aria-hidden className="size-3.5" /> : <ChevronDown aria-hidden className="size-3.5" />}
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
