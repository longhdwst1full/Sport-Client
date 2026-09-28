import Link from 'next/link';
import { ArrowLeft, Headphones, RotateCcw, ShoppingBag, X } from 'lucide-react';

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
}: {
  orderStatus: string;
  isAuthenticated: boolean;
  canCancel: boolean;
  onReorderAll: () => void;
  onOpenCancel: () => void;
  onOpenSupport: () => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <ShoppingBag className="size-3.5" /> Tiếp tục mua sắm
          </Link>

          {orderStatus === 'COMPLETED' && (
            <button
              type="button"
              onClick={onReorderAll}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
            >
              <RotateCcw className="size-3.5 text-emerald-600" /> Mua lại cả đơn
            </button>
          )}

          {isAuthenticated && (
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft className="size-3.5" /> Danh sách đơn
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {canCancel ? (
            <button
              type="button"
              onClick={onOpenCancel}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 hover:border-rose-300"
            >
              <X className="size-3.5" /> Hủy đơn hàng
            </button>
          ) : orderStatus !== 'CANCELLED' ? (
            <button
              type="button"
              onClick={onOpenSupport}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
            >
              <Headphones className="size-3.5 text-emerald-600" /> Cần hỗ trợ về đơn này?
            </button>
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
