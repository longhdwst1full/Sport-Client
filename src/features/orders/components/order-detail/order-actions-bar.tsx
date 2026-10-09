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
    <div className="surface-card p-4 shadow-card sm:p-5">
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
              className={`${ACTION_CLASS} border-neutral-300 bg-neutral-50 text-neutral-950 hover:bg-neutral-100`}
            >
              <RotateCcw aria-hidden className="size-3.5 text-neutral-900" /> Mua lại cả đơn
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
              className={`${ACTION_CLASS} gap-1.5 border-red-200 bg-red-50/70 text-red-700 hover:border-red-300 hover:bg-red-100 hover:text-red-700`}
            >
              <X aria-hidden className="size-3.5" /> Hủy đơn hàng
            </Button>
          ) : orderStatus !== ORDER_STATUS.CANCELLED ? (
            <Button variant="outline" onClick={onOpenSupport} className={`${ACTION_CLASS} gap-1.5 bg-neutral-50 hover:bg-neutral-100`}>
              <Headphones aria-hidden className="size-3.5 text-neutral-900" /> Cần hỗ trợ về đơn này?
            </Button>
          ) : null}
        </div>
      </div>

      {canCancel && (
        <p className="mt-3 text-2xs text-neutral-500">
          * Đơn hàng đang ở trạng thái chờ xác nhận. Bạn có thể tự thao tác hủy đơn trực tiếp trên website trước khi đơn được tiếp nhận tại kho.
        </p>
      )}
    </div>
  );
}
