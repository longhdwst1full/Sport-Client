import { Calendar, Check, Clock, Copy, Store } from 'lucide-react';
import type { OrderDetailView } from '../../model/order.mapper';
import { getOrderStatusBadge, getPaymentStatusBadge } from './order-status-badges';

/** Khối trạng thái nổi bật: mã đơn (sao chép được), trạng thái, mốc thời gian và 3 chỉ số chính. */
export function OrderStatusHero({
  orderNo,
  view,
  copiedOrderNo,
  onCopyOrderNo,
}: {
  orderNo: string;
  view: OrderDetailView | undefined;
  copiedOrderNo: boolean;
  onCopyOrderNo: (code: string) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white shadow-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 size-64 rounded-full bg-teal-600/10 blur-2xl" />

      <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/25">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Đơn hàng trực tuyến
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm sm:text-base font-extrabold text-slate-300">
                #{orderNo}
              </span>
              <button
                type="button"
                onClick={() => onCopyOrderNo(orderNo)}
                className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-0.5 text-xs font-medium text-slate-300 hover:bg-white/20 hover:text-white transition"
                title="Sao chép mã đơn"
              >
                {copiedOrderNo ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Chép mã</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Banner Title & Description (P0) */}
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-3">
              {view && getOrderStatusBadge(view.statusCode, view.statusLabel)}
            </div>
            <p className="mt-2.5 text-sm sm:text-base font-medium leading-relaxed text-slate-200 max-w-2xl">
              {view?.statusDescription}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1.5 text-emerald-300/90 font-semibold">
                <Clock className="size-3.5 text-emerald-400" /> Cập nhật lần cuối: {view?.lastUpdatedLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Calendar className="size-3.5 text-slate-400" /> Đặt lúc: {view?.placedLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Store className="size-3.5 text-slate-400" /> Xuất phát từ: {view?.branchName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Grid (3 cards) */}
      <div className="relative mt-7 grid gap-3.5 sm:grid-cols-3 pt-6 border-t border-white/10">
        <div className="rounded-2xl bg-white/[0.06] p-4 backdrop-blur-sm border border-white/[0.08]">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Người nhận hàng</span>
          <strong className="mt-1 block truncate text-sm font-bold text-white">{view?.recipientName}</strong>
          <span className="mt-0.5 block text-xs text-slate-300 font-mono">{view?.recipientPhone}</span>
          <span className="mt-1 block truncate text-[11px] text-slate-400">{view?.recipientAddress}</span>
        </div>

        <div className="rounded-2xl bg-white/[0.06] p-4 backdrop-blur-sm border border-white/[0.08]">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Phương thức thanh toán</span>
          <strong className="mt-1 block text-sm font-bold text-white">{view?.paymentMethodLabel}</strong>
          <div className="mt-1.5 flex items-center gap-2">
            {view && getPaymentStatusBadge(view.paymentStatusCode, view.paymentStatusLabel)}
          </div>
          <span className="mt-1 block text-[11px] text-slate-300">
            {view?.paymentMethodCode === 'COD'
              ? 'Thanh toán tiền mặt khi nhận hàng'
              : view?.paymentStatusCode === 'SUCCESS'
              ? 'Đã thanh toán đủ'
              : 'Chờ hoàn tất thanh toán'}
          </span>
        </div>

        <div className="rounded-2xl bg-white/[0.06] p-4 backdrop-blur-sm border border-white/[0.08]">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Tổng thanh toán</span>
          <strong className="mt-1 block text-2xl font-black text-emerald-400 tracking-tight">
            {view?.grandTotalLabel}
          </strong>
          <div className="mt-0.5 flex items-center justify-between text-[11px] text-emerald-300/80">
            <span>{view?.itemCount} món sản phẩm</span>
            {view?.paymentMethodCode === 'COD' && (
              <span className="font-semibold text-amber-300">(Trả khi nhận)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
