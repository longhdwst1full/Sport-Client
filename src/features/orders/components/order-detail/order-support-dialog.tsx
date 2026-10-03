import { Headphones, MessageCircle, Phone, X } from 'lucide-react';
import { useRef } from 'react';
import { useDialogA11y } from '@/foundation/components/overlay/use-dialog-a11y';

/** Kênh hỗ trợ theo đơn (gọi tổng đài, email kèm mã đơn) và nút chép mã đơn để đọc khi gọi. */
export function OrderSupportDialog({
  orderNo,
  copiedOrderNo,
  onCopyOrderNo,
  onClose,
}: {
  orderNo: string;
  copiedOrderNo: boolean;
  onCopyOrderNo: (code: string) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  useDialogA11y(dialogRef, { onClose, trapFocus: true });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-support-dialog-title"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 sm:p-7 shadow-2xl animate-fade-in-up outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Headphones className="size-5.5" />
            </div>
            <div>
              <h2 id="order-support-dialog-title" className="text-base font-black text-slate-900">Hỗ trợ đơn hàng #{orderNo}</h2>
              <p className="text-xs text-slate-500">Bảo An Sport Support Center</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-600">
          Nếu bạn muốn thay đổi thông tin người nhận, điều chỉnh sản phẩm, kiểm tra tiến độ giao hàng hoặc yêu cầu hỗ trợ đặc biệt, hãy chọn một trong các kênh dưới đây:
        </p>

        <div className="mt-4 space-y-2.5">
          <a
            href="tel:0862576222"
            className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs font-bold text-emerald-950 hover:bg-emerald-100 transition"
          >
            <div className="flex items-center gap-2.5">
              <Phone className="size-4 text-emerald-700" />
              <div>
                <strong className="block text-sm">Gọi tổng đài ngay</strong>
                <span className="text-[11px] font-normal text-slate-600">Hỗ trợ tức thì (8:00 - 22:00)</span>
              </div>
            </div>
            <span className="font-mono text-sm font-black text-emerald-700">0862 576 222</span>
          </a>

          <a
            href={`mailto:support@baoansport.vn?subject=${encodeURIComponent(`[Hỗ trợ đơn hàng] ${orderNo}`)}`}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="size-4 text-blue-600" />
              <div>
                <strong className="block text-sm">Gửi email hỗ trợ</strong>
                <span className="text-[11px] font-normal text-slate-500">support@baoansport.vn</span>
              </div>
            </div>
            <span className="text-slate-400">Gửi mail →</span>
          </a>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Mã đơn hàng cần đọc khi gọi</span>
            <strong className="font-mono text-sm font-black text-slate-900">#{orderNo}</strong>
          </div>
          <button
            type="button"
            onClick={() => onCopyOrderNo(orderNo)}
            className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            {copiedOrderNo ? 'Đã sao chép' : 'Sao chép'}
          </button>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
