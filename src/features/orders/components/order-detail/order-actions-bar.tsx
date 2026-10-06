import Link from 'next/link';
import { ArrowLeft, Headphones, Printer, RotateCcw, ShoppingBag, X } from 'lucide-react';
import { Button, buttonVariants } from '@/foundation/components/buttons';
import { ORDER_STATUS } from '../../model/order.constants';

/** Nút trong thanh hành động: chữ nhỏ đậm, đệm ngang 16px. */
const ACTION_CLASS = 'px-4 text-xs font-bold';

/**
 * Hành động sau bán: mua tiếp, mua lại cả đơn (đơn hoàn tất), về danh sách đơn (tài khoản). Nút hủy chỉ
 * hiện khi đơn còn hủy được; ngoài ra (trừ đơn đã hủy) thay bằng nút mở hỗ trợ.
 */
export function OrderActionsBar({
  orderStatus,
  isAuthenticated,
  canCancel,
  onReorderAll,
  onOpenCancel,
  onOpenSupport,
  onPrintReceipt,
}: {
  orderStatus: string;
  isAuthenticated: boolean;
  canCancel: boolean;
  onReorderAll: () => void;
  onOpenCancel: () => void;
  onOpenSupport: () => void;
  /** D16: in biên lai nội bộ; không hiện với đơn đã huỷ. */
  onPrintReceipt?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/products"
            className={buttonVariants({ variant: 'primary', className: `${ACTION_CLASS} shadow-sm` })}
          >
            <ShoppingBag aria-hidden className="size-3.5" /> Tiếp tục mua sắm
          </Link>

          {orderStatus === ORDER_STATUS.COMPLETED && (
            <Button
              variant="outline"
              onClick={onReorderAll}
              className={`${ACTION_CLASS} border-brand-300 bg-brand-50 text-brand-800 hover:bg-brand-100`}
            >
              <RotateCcw aria-hidden className="size-3.5 text-brand-600" /> Mua lại cả đơn
            </Button>
          )}

          {onPrintReceipt && orderStatus !== ORDER_STATUS.CANCELLED && (
            <Button variant="outline" onClick={onPrintReceipt} className={`${ACTION_CLASS} shadow-sm`}>
              <Printer aria-hidden className="size-3.5" /> In biên lai
            </Button>
          )}

          {isAuthenticated && (
            <Link
              href="/orders"
              className={buttonVariants({ variant: 'outline', className: `${ACTION_CLASS} shadow-sm` })}
            >
              <ArrowLeft aria-hidden className="size-3.5" /> Danh sách đơn
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {canCancel ? (
            <Button
              variant="outline"
              onClick={onOpenCancel}
              className={`${ACTION_CLASS} gap-1.5 border-rose-200 bg-rose-50/70 text-rose-700 hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700`}
            >
              <X aria-hidden className="size-3.5" /> Hủy đơn hàng
            </Button>
          ) : orderStatus !== ORDER_STATUS.CANCELLED ? (
            <Button variant="outline" onClick={onOpenSupport} className={`${ACTION_CLASS} gap-1.5 bg-slate-50 hover:bg-slate-100`}>
              <Headphones aria-hidden className="size-3.5 text-brand-600" /> Cần hỗ trợ về đơn này?
            </Button>
          ) : null}
        </div>
      </div>

      {canCancel && (
        <p className="mt-3 text-[11px] text-slate-500">
          * Đơn hàng đang ở trạng thái chờ xác nhận. Bạn có thể tự thao tác hủy đơn trực tiếp trên website trước khi đơn được tiếp nhận tại kho.
        </p>
      )}
    </div>
  );
}
