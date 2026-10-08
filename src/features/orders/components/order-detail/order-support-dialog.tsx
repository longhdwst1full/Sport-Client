import { Headphones, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { OrderDialogShell } from './order-dialog-shell';

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
  return (
    <OrderDialogShell
      titleId="order-support-dialog-title"
      title={`Hỗ trợ đơn hàng #${orderNo}`}
      subtitle="Bảo An Sport Support Center"
      icon={Headphones}
      iconClassName="bg-slate-100 text-slate-900"
      className="max-w-md"
      onClose={onClose}
    >
        <p className="mt-4 text-xs leading-relaxed text-slate-600">
          Nếu bạn muốn thay đổi thông tin người nhận, điều chỉnh sản phẩm, kiểm tra tiến độ giao hàng hoặc yêu cầu hỗ trợ đặc biệt, hãy chọn một trong các kênh dưới đây:
        </p>

        <div className="mt-4 space-y-2.5">
          <a
            href="tel:0862576222"
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs font-bold text-slate-950 hover:bg-slate-100 transition"
          >
            <div className="flex items-center gap-2.5">
              <Phone className="size-4 text-slate-900" />
              <div>
                <strong className="block text-sm">Gọi tổng đài ngay</strong>
                <span className="text-[11px] font-normal text-slate-600">Hỗ trợ tức thì (8:00 - 22:00)</span>
              </div>
            </div>
            <span className="font-mono text-sm font-black text-slate-900">0862 576 222</span>
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
          <Button variant="outline" size="sm" onClick={() => onCopyOrderNo(orderNo)} className="rounded-lg px-2.5 text-xs">
            {copiedOrderNo ? 'Đã sao chép' : 'Sao chép'}
          </Button>
        </div>

        <div className="mt-5 flex justify-end">
          <Button variant="outline" onClick={onClose} className="px-5 text-xs">
            Đóng
          </Button>
        </div>
    </OrderDialogShell>
  );
}
