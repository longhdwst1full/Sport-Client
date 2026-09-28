import { CheckCircle2, Clock3, FileText } from 'lucide-react';
import type { OrderDetailView } from '../../model/order.mapper';

/** Bảng tiền (tạm tính, chiết khấu, phí giao, tổng), ghi chú cách thanh toán và ghi chú đơn của khách. */
export function OrderBillSummary({ view }: { view: OrderDetailView | undefined }) {
  return (
    <>
      {/* Bill Breakdown Summary (P0 & P1) */}
      <div className="mt-5 space-y-3 rounded-2xl bg-slate-50/80 p-4 sm:p-5 border border-slate-100 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Tiền hàng (tạm tính)</span>
          <span className="font-semibold text-slate-900">{view?.subtotalLabel}</span>
        </div>
        {view?.hasDiscount && (
          <div className="flex justify-between text-emerald-700">
            <span>Chiết khấu / Khuyến mãi</span>
            <span className="font-semibold">- {view.discountTotalLabel}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-600">
          <span>Phí vận chuyển</span>
          <span className="font-semibold text-slate-900">
            {view?.shippingTotalLabel === '0 ₫' ? 'Miễn phí' : view?.shippingTotalLabel}
          </span>
        </div>
        <div className="flex items-baseline justify-between border-t border-slate-200/80 pt-3 text-base">
          <span className="font-black text-slate-900">Tổng thanh toán</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700">
            {view?.grandTotalLabel}
          </span>
        </div>

        {/* Contextual payment instruction note */}
        <div className="mt-2 rounded-xl p-3 text-xs leading-relaxed border">
          {view?.paymentMethodCode === 'COD' ? (
            <div className="flex items-start gap-2 text-emerald-900 bg-emerald-50/90 border-emerald-200/80 rounded-lg p-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Hình thức thanh toán khi nhận hàng (COD):</strong>
                <p className="mt-0.5 text-slate-700">
                  Quý khách vui lòng chuẩn bị đúng số tiền <strong className="text-emerald-800">{view?.grandTotalLabel}</strong> tiền mặt để thanh toán cho bưu tá khi nhận kiện hàng.
                </p>
              </div>
            </div>
          ) : view?.paymentStatusCode === 'SUCCESS' ? (
            <div className="flex items-start gap-2 text-emerald-900 bg-emerald-50/90 border-emerald-200/80 rounded-lg p-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Đã thanh toán thành công:</strong>
                <p className="mt-0.5 text-slate-700">
                  Đơn hàng đã được thanh toán đủ số tiền <strong className="text-emerald-800">{view?.grandTotalLabel}</strong>. Quý khách không cần trả thêm bất kỳ khoản phí nào khi nhận kiện hàng.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-amber-900 bg-amber-50/90 border-amber-200/80 rounded-lg p-2.5">
              <Clock3 className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Chờ thanh toán:</strong>
                <p className="mt-0.5 text-slate-700">
                  Đơn hàng đang chờ thanh toán qua cổng {view?.paymentMethodLabel}. Vui lòng hoàn tất thanh toán để đơn được xử lý và xuất kho nhanh nhất.
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-400 text-right">
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
