import { Headphones, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { STORE_CONTACT } from '@/shared/constants';
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
      iconClassName="bg-neutral-100 text-neutral-900"
      className="max-w-md"
      onClose={onClose}
    >
        <p className="mt-4 text-xs leading-relaxed text-neutral-600">
          Nếu bạn muốn thay đổi thông tin người nhận, điều chỉnh sản phẩm, kiểm tra tiến độ giao hàng hoặc yêu cầu hỗ trợ đặc biệt, hãy chọn một trong các kênh dưới đây:
        </p>

        <div className="mt-4 space-y-2.5">
          <a
            href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
            className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3.5 text-xs font-bold text-neutral-950 hover:bg-neutral-100 transition"
          >
            <div className="flex items-center gap-2.5">
              <Phone className="size-4 text-neutral-900" />
              <div>
                <strong className="block text-sm">Gọi tổng đài ngay</strong>
                <span className="text-2xs font-normal text-neutral-600">{STORE_CONTACT.openingHoursShort}</span>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-neutral-900">{STORE_CONTACT.primaryHotline}</span>
          </a>

          <a
            href={`mailto:${STORE_CONTACT.supportEmail}?subject=${encodeURIComponent(`[Hỗ trợ đơn hàng] ${orderNo}`)}`}
            className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="size-4 text-neutral-600" />
              <div>
                <strong className="block text-sm">Gửi email hỗ trợ</strong>
                <span className="text-2xs font-normal text-neutral-500">{STORE_CONTACT.supportEmail}</span>
              </div>
            </div>
            <span className="text-neutral-400">Gửi mail →</span>
          </a>
        </div>

        <div className="mt-4 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-600 border border-neutral-200/70 flex items-center justify-between">
          <div>
            <span className="text-3xs uppercase font-bold text-neutral-400 block">Mã đơn hàng cần đọc khi gọi</span>
            <strong className="font-mono text-sm font-bold text-neutral-900">#{orderNo}</strong>
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
