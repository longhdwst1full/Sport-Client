import { Truck } from 'lucide-react';
import { OrderDetailCard } from './order-detail-card';
import { OrderMilestoneStepper } from './order-milestone-stepper';
import { OrderShippingInfo, TrackingNoCopyButton, type OrderShippingInfoProps } from './order-shipping-info';

/** Khối "Tiến trình giao hàng": mã vận đơn ở đầu khối, stepper mốc đơn và thông tin vận chuyển. */
export function OrderShipmentSection(props: OrderShippingInfoProps) {
  const { view, copiedTrackingNo, onCopyTrackingNo } = props;
  const trackingNo = view?.shipment?.trackingNo;
  return (
    <OrderDetailCard
      icon={Truck}
      title="Tiến trình giao hàng"
      description="Quy trình xử lý đóng gói và vận chuyển đơn hàng đến tay bạn"
      className="mt-6"
      headerClassName="flex flex-wrap items-center justify-between gap-3"
      action={
        trackingNo && (
          <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-1.5 border border-neutral-200/80">
            <span className="text-2xs font-semibold text-neutral-500">Mã vận đơn:</span>
            <span className="font-mono text-xs font-black text-neutral-900">{trackingNo}</span>
            <TrackingNoCopyButton
              trackingNo={trackingNo}
              copied={copiedTrackingNo}
              onCopy={onCopyTrackingNo}
              className="-my-1.5 hover:bg-neutral-200/60"
            />
          </div>
        )
      }
    >
      <OrderMilestoneStepper milestones={view?.milestones} />
      <OrderShippingInfo {...props} />
    </OrderDetailCard>
  );
}
