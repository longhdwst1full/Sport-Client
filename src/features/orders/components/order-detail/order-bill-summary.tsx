import type { ReactNode } from 'react';
import { Banknote, CheckCircle2, Clock3, FileText } from 'lucide-react';
import type { OrderDetailView } from '../../model/order.mapper';
import { DescriptionList } from '@/foundation/components/structure';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '../../model/order.constants';

/** Ghi chú cách thanh toán theo phương thức/trạng thái: COD, đã thanh toán, hoặc chờ thanh toán online. */
function paymentNote(view: OrderDetailView | undefined): {
  icon: typeof Banknote;
  tone: string;
  iconTone: string;
  title: string;
  body: ReactNode;
} {
  if (view?.paymentMethodCode === PAYMENT_METHOD.COD) {
    return {
      icon: Banknote,
      tone: 'text-neutral-900 bg-neutral-50/90 border-neutral-200/80',
      iconTone: 'text-neutral-600',
      title: 'Hình thức thanh toán khi nhận hàng (COD):',
      body: <>Quý khách vui lòng chuẩn bị đúng số tiền <strong className="text-neutral-900">{view.grandTotalLabel}</strong> tiền mặt để thanh toán cho bưu tá khi nhận kiện hàng.</>,
    };
  }
  if (view?.paymentStatusCode === PAYMENT_STATUS.SUCCESS) {
    return {
      icon: CheckCircle2,
      tone: 'text-success-900 bg-success-50/90 border-success-200/80',
      iconTone: 'text-success-600',
      title: 'Đã thanh toán thành công:',
      body: <>Đơn hàng đã được thanh toán đủ số tiền <strong className="text-success-800">{view.grandTotalLabel}</strong>. Quý khách không cần trả thêm bất kỳ khoản phí nào khi nhận kiện hàng.</>,
    };
  }
  return {
    icon: Clock3,
    tone: 'text-amber-900 bg-amber-50/90 border-amber-200/80',
    iconTone: 'text-amber-600',
    title: 'Chờ thanh toán:',
    body: <>Đơn hàng đang chờ thanh toán qua cổng {view?.paymentMethodLabel}. Vui lòng hoàn tất thanh toán để đơn được xử lý và xuất kho nhanh nhất.</>,
  };
}

/** Bảng tiền (tạm tính, chiết khấu, phí giao, tổng), ghi chú cách thanh toán và ghi chú đơn của khách. */
export function OrderBillSummary({ view }: { view: OrderDetailView | undefined }) {
  const note = paymentNote(view);
  return (
    <>
      {/* Bill Breakdown Summary (P0 & P1) */}
      <div className="mt-5 space-y-3 rounded-2xl bg-neutral-50/80 p-4 sm:p-5 border border-neutral-100 text-sm">
        <DescriptionList
          layout="inline"
          className="gap-y-3"
          labelClassName="text-neutral-600"
          items={[
            { label: 'Tiền hàng (tạm tính)', value: view?.subtotalLabel },
            {
              label: <span className="text-success-700">Chiết khấu / Khuyến mãi</span>,
              key: 'discount',
              value: `- ${view?.discountTotalLabel ?? ''}`,
              valueClassName: 'text-success-700',
              visible: Boolean(view?.hasDiscount),
            },
            { label: 'Phí vận chuyển', value: view?.isShippingFree ? 'Miễn phí' : view?.shippingTotalLabel },
            {
              key: 'grand-total',
              label: <span className="font-bold text-neutral-900">Tổng thanh toán</span>,
              value: view?.grandTotalLabel,
              itemClassName: 'border-t border-neutral-200/80 pt-3 text-base',
              valueClassName: 'text-xl sm:text-2xl font-bold text-neutral-900',
            },
          ]}
        />

        {/* Contextual payment instruction note */}
        <div className="mt-2 rounded-xl p-3 text-xs leading-relaxed border">
          <div className={`flex items-start gap-2 rounded-lg p-2.5 ${note.tone}`}>
            <note.icon aria-hidden className={`size-4 shrink-0 mt-0.5 ${note.iconTone}`} />
            <div>
              <strong>{note.title}</strong>
              <p className="mt-0.5 text-neutral-700">{note.body}</p>
            </div>
          </div>
        </div>

        <p className="text-2xs text-neutral-400 text-right">
          (Đã bao gồm thuế GTGT/VAT nếu có)
        </p>
      </div>

      {view?.customerNote && (
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-amber-50/80 p-3.5 border border-amber-200/60 text-xs text-amber-900">
          <FileText className="size-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong className="block font-bold">Ghi chú đơn hàng từ bạn:</strong>
            <p className="mt-0.5 leading-relaxed">{view.customerNote}</p>
          </div>
        </div>
      )}
    </>
  );
}
