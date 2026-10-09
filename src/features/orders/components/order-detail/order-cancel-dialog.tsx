import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Spinner } from '@/foundation/components/feedback';
import { Field, Textarea } from '@/foundation/components/field-system';
import type { useCancelOrder } from '../../hooks/use-cancel-order';
import { apiErrorMessage } from '@/lib/api/error-message';
import { ORDER_LOAD_ERROR_MESSAGE } from '../../model/order.constants';
import { OrderDialogShell } from './order-dialog-shell';

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
    <OrderDialogShell
      titleId="order-cancel-dialog-title"
      title="Xác nhận hủy đơn hàng"
      subtitle={<span className="font-mono">#{orderNo}</span>}
      icon={AlertTriangle}
      iconClassName="bg-red-100 text-red-600"
      className="max-w-lg"
      onClose={closeCancel}
      closeDisabled={cancel.isPending}
    >
        <div className="mt-4 rounded-2xl bg-red-50/80 p-3.5 border border-red-100 text-xs leading-relaxed text-red-900">
          <strong className="block font-bold">Lưu ý quan trọng:</strong>
          Sau khi hủy, hệ thống sẽ tự động giải phóng toàn bộ sản phẩm đang giữ chỗ cho bạn. Nếu đơn đã thanh toán online, nhân viên sẽ liên hệ để hoàn tiền theo chính sách. Thao tác hủy không thể hoàn tác.
        </div>

        <div className="mt-4">
          <label className="block text-xs font-bold text-neutral-800">
            Chọn lý do hủy nhanh:
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {CANCEL_REASONS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setReason(preset)}
                className={`rounded-lg px-2.5 py-1 text-2xs font-medium transition ${
                  reason === preset
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Field
            label={<>Chi tiết lý do hủy đơn <span className="text-red-600">*</span></>}
            labelClassName="block text-xs font-bold text-neutral-800"
          >
            <Textarea
              id="customer-cancel-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Vui lòng cho Bảo An Sport biết lý do bạn muốn hủy đơn (tối thiểu 3 ký tự)..."
              styled
              className="mt-1.5"
            />
          </Field>
          <div className="mt-1 flex justify-between text-2xs text-neutral-400">
            <span>Tối thiểu 3 ký tự</span>
            <span>{reason.trim().length}/500</span>
          </div>
        </div>

        {cancel.isError && (
          <p className="mt-2 text-xs font-semibold text-red-700">
            {apiErrorMessage(cancel.error, ORDER_LOAD_ERROR_MESSAGE)}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" disabled={cancel.isPending} onClick={closeCancel} className="px-5 text-xs">
            Đóng
          </Button>
          <Button
            variant="danger"
            disabled={cancel.isPending || reason.trim().length < 3}
            onClick={() => cancel.mutate()}
            className="gap-1.5 px-5 text-xs shadow-sm"
          >
            {cancel.isPending ? <Spinner className="size-4 animate-spin" /> : <X className="size-4" />}
            {cancel.isPending ? 'Đang hủy...' : 'Xác nhận hủy đơn'}
          </Button>
        </div>
    </OrderDialogShell>
  );
}
