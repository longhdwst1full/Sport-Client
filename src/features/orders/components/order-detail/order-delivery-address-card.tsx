import { Check, Copy, MapPin, Phone, Store, User } from 'lucide-react';
import type { OrderDetailView } from '../../model/order.mapper';
import { Button } from '@/foundation/components/buttons';
import { OrderDetailCard } from './order-detail-card';

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
    <OrderDetailCard
      icon={MapPin}
      title="Địa chỉ giao hàng"
      description="Thông tin nhận kiện hàng"
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={onCopyAddress}
          className="gap-1 rounded-lg border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-600"
          title="Sao chép toàn bộ thông tin người nhận"
          aria-label={copiedAddress ? 'Đã sao chép thông tin người nhận' : 'Sao chép toàn bộ thông tin người nhận'}
        >
          {copiedAddress ? (
            <>
              <Check className="size-3 text-success-600" />
              <span className="text-success-700 font-bold">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Chép địa chỉ</span>
            </>
          )}
        </Button>
      }
    >
      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm sm:text-base">
            <User className="size-4 text-slate-900" />
            <span>{view?.recipientName}</span>
          </div>
          <span className="text-slate-300">|</span>
          <a
            href={`tel:${view?.recipientPhone}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:underline"
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
          <Store className="size-4 text-slate-900 shrink-0" />
          <span>
            Chuẩn bị và xuất phát từ: <strong className="text-slate-900">{view?.branchName}</strong>
          </span>
        </div>
      </div>
    </OrderDetailCard>
  );
}
