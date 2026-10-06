import { Calendar, Check, Clock, Copy, Store } from 'lucide-react';
import { IconList } from '@/foundation/components/structure';
import type { OrderDetailView } from '../../model/order.mapper';

const METRIC_CARD_CLASS = 'rounded-2xl bg-white/[0.06] p-4 backdrop-blur-sm border border-white/[0.08]';
const METRIC_LABEL_CLASS = 'block text-[11px] font-bold uppercase tracking-wider text-slate-400';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '../../model/order.constants';
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
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 p-6 sm:p-8 text-white shadow-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 size-64 rounded-full bg-brand-700/10 blur-2xl" />

      <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-300 border border-brand-500/25">
              <span className="size-1.5 rounded-full bg-brand-400" />
              Đơn hàng trực tuyến
            </span>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-sm sm:text-base font-extrabold text-slate-200">
                <span className="sr-only">Đơn hàng </span>#{orderNo}
              </h1>
              <button
                type="button"
                onClick={() => onCopyOrderNo(orderNo)}
                className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-white/20 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                title="Sao chép mã đơn"
                aria-label={copiedOrderNo ? 'Đã sao chép mã đơn' : 'Sao chép mã đơn'}
              >
                {copiedOrderNo ? (
                  <>
                    <Check className="size-3 text-success-400" />
                    <span className="text-success-300 font-bold">Đã chép</span>
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
            <IconList
              className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-300"
              itemClassName="gap-1.5"
              iconClassName="size-3.5 text-slate-400"
              items={[
                {
                  key: 'updated',
                  icon: Clock,
                  label: <span className="font-semibold text-slate-200">Cập nhật lần cuối: {view?.lastUpdatedLabel}</span>,
                },
                { key: 'placed', icon: Calendar, label: <>Đặt lúc: {view?.placedLabel}</> },
                { key: 'branch', icon: Store, label: <>Xuất phát từ: {view?.branchName}</> },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Metric Grid (3 cards) */}
      <div className="relative mt-7 grid gap-3.5 sm:grid-cols-3 pt-6 border-t border-white/10">
        <div className={METRIC_CARD_CLASS}>
          <span className={METRIC_LABEL_CLASS}>Người nhận hàng</span>
          <strong className="mt-1 block truncate text-sm font-bold text-white">{view?.recipientName}</strong>
          <span className="mt-0.5 block text-xs text-slate-300 font-mono">{view?.recipientPhone}</span>
          <span className="mt-1 block truncate text-[11px] text-slate-400">{view?.recipientAddress}</span>
        </div>

        <div className={METRIC_CARD_CLASS}>
          <span className={METRIC_LABEL_CLASS}>Phương thức thanh toán</span>
          <strong className="mt-1 block text-sm font-bold text-white">{view?.paymentMethodLabel}</strong>
          <div className="mt-1.5 flex items-center gap-2">
            {view && getPaymentStatusBadge(view.paymentStatusCode, view.paymentStatusLabel)}
          </div>
          <span className="mt-1 block text-[11px] text-slate-300">
            {view?.paymentMethodCode === PAYMENT_METHOD.COD
              ? 'Thanh toán tiền mặt khi nhận hàng'
              : view?.paymentStatusCode === PAYMENT_STATUS.SUCCESS
              ? 'Đã thanh toán đủ'
              : 'Chờ hoàn tất thanh toán'}
          </span>
        </div>

        <div className={METRIC_CARD_CLASS}>
          <span className={METRIC_LABEL_CLASS}>Tổng thanh toán</span>
          <strong className="mt-1 block text-2xl font-black text-brand-400 tracking-tight">
            {view?.grandTotalLabel}
          </strong>
          <div className="mt-0.5 flex items-center justify-between text-[11px] text-brand-300/80">
            <span>{view?.itemCount} món sản phẩm</span>
            {view?.paymentMethodCode === PAYMENT_METHOD.COD && (
              <span className="font-semibold text-amber-300">(Trả khi nhận)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
