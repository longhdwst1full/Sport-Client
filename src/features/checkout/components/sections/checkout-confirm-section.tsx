import { AlertTriangle } from 'lucide-react';
import type { CheckoutQuoteDto } from '@/generated/api/checkout/checkout.schemas';
import { Button } from '@/foundation/components/buttons';
import { InlineAlert } from '@/foundation/components/feedback';

/**
 * Bước cuối: kiểm tra lại phí khi chờ tư vấn cước và khung lỗi. Ô đồng ý điều khoản nằm trong
 * `CheckoutOrderSummary`, ngay trên nút đặt hàng (desktop) và trước thanh dính đáy (mobile).
 */
export function CheckoutConfirmSection({
  quote,
  refreshConsultedQuote,
  busy,
  error,
}: {
  quote: CheckoutQuoteDto | undefined;
  refreshConsultedQuote: () => void;
  busy: boolean;
  error: string;
}) {
  const consultation = Boolean(quote?.requiresShippingConsultation);
  // Không còn nội dung thì không render thẻ rỗng.
  if (!consultation && !error) return null;
  return (
    <section className="space-y-4 surface-card p-4 shadow-sm sm:p-6">
      {consultation && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs sm:text-sm font-semibold text-amber-900">
            Đơn hàng hiện chỉ tính tiền sản phẩm. Nhân viên sẽ liên hệ thông báo cước gửi xe; bấm kiểm tra lại phí sau khi đã thống nhất để đặt hàng.
          </p>
          <Button
            variant="warning"
            onClick={refreshConsultedQuote}
            disabled={busy}
            className="shrink-0 text-xs font-bold focus-visible:ring-amber-500"
          >
            {busy ? 'Đang kiểm tra...' : 'Kiểm tra lại phí'}
          </Button>
        </div>
      )}

      {error && (
        <InlineAlert role="alert" className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
          <AlertTriangle aria-hidden className="size-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </InlineAlert>
      )}

    </section>
  );
}
