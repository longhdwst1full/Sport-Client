import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Spinner } from '@/foundation/components/feedback';
import type { useCancelOrder } from '../../hooks/use-cancel-order';
import { errorMessage } from '../../model/order-detail-error';

const CANCEL_REASONS = [
  'Đổi ý không muốn mua nữa',
  'Muốn thay đổi sản phẩm / kích cỡ / màu sắc',
  'Muốn thay đổi địa chỉ hoặc số điện thoại nhận hàng',
  'Tìm được giá hoặc ưu đãi tốt hơn',
  'Đặt trùng lặp đơn hàng',
];

/** Xác nhận hủy đơn: lý do bắt buộc (≥ 3 ký tự), không đóng được khi lệnh hủy đang chạy. */
export function OrderCancelDialog({
  orderNo,
  reason,
  setReason,
  cancel,
  closeCancel,
}: {
  orderNo: string;
  reason: string;
  setReason: (value: string) => void;
  cancel: ReturnType<typeof useCancelOrder>['cancel'];
  closeCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 sm:p-7 shadow-2xl animate-fade-in-up">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-rose-100 text-rose-600">
              <AlertTriangle className="size-5.5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Xác nhận hủy đơn hàng</h2>
              <p className="font-mono text-xs text-slate-500">#{orderNo}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCancel}
            disabled={cancel.isPending}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-rose-50/80 p-3.5 border border-rose-100 text-xs leading-relaxed text-rose-900">
          <strong className="block font-bold">Lưu ý quan trọng:</strong>
          Sau khi hủy, hệ thống sẽ tự động giải phóng toàn bộ sản phẩm đang giữ chỗ cho bạn. Nếu đơn đã thanh toán online, nhân viên sẽ liên hệ để hoàn tiền theo chính sách. Thao tác hủy không thể hoàn tác.
        </div>

        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-800">
            Chọn lý do hủy nhanh:
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {CANCEL_REASONS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setReason(preset)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                  reason === preset
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="customer-cancel-reason" className="block text-xs font-bold text-slate-800">
            Chi tiết lý do hủy đơn <span className="text-rose-600">*</span>
          </label>
          <textarea
            id="customer-cancel-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Vui lòng cho Bảo An Sport biết lý do bạn muốn hủy đơn (tối thiểu 3 ký tự)..."
            className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>Tối thiểu 3 ký tự</span>
            <span>{reason.trim().length}/500</span>
          </div>
        </div>

        {cancel.isError && (
          <p className="mt-2 text-xs font-semibold text-rose-700">
            {errorMessage(cancel.error)}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            disabled={cancel.isPending}
            onClick={closeCancel}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Đóng
          </Button>
          <Button
            type="button"
            disabled={cancel.isPending || reason.trim().length < 3}
            onClick={() => cancel.mutate()}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
          >
            {cancel.isPending ? <Spinner className="size-4 animate-spin" /> : <X className="size-4" />}
            {cancel.isPending ? 'Đang hủy...' : 'Xác nhận hủy đơn'}
          </Button>
        </div>
      </div>
    </div>
  );
}
