import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import type { CheckoutQuoteDto } from '@/generated/api/checkout/checkout.schemas';
import { Button } from '@/foundation/components/buttons';
import { InlineAlert } from '@/foundation/components/feedback';
import { Checkbox } from '@/foundation/components/field-system';
import { STORE_POLICY_PAGES } from '@/shared/constants';

/**
 * Bước 4: đồng ý điều khoản, kiểm tra lại phí khi chờ tư vấn cước và khung lỗi.
 * Nút đặt hàng mobile nằm ở thanh dính đáy trong `CheckoutOrderSummary` (một CTA duy nhất mỗi breakpoint).
 */
export function CheckoutConfirmSection({
  acceptedTerms,
  setAcceptedTerms,
  quote,
  refreshConsultedQuote,
  busy,
  error,
}: {
  acceptedTerms: boolean;
  setAcceptedTerms: (value: boolean) => void;
  quote: CheckoutQuoteDto | undefined;
  refreshConsultedQuote: () => void;
  busy: boolean;
  error: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-6">
      <Checkbox
        checked={acceptedTerms}
        onChange={(e) => setAcceptedTerms(e.target.checked)}
        wrapperClassName="rounded-2xl border border-slate-200/60 bg-slate-50 p-4"
        label={
          <span className="text-xs leading-relaxed sm:text-sm">
            Tôi đã đọc và đồng ý với{' '}
            <Link href={STORE_POLICY_PAGES.TERMS.href} target="_blank" className="font-bold text-slate-900 underline-offset-2 hover:underline">
              {STORE_POLICY_PAGES.TERMS.title.toLowerCase()}
            </Link>{' '}
            và{' '}
            <Link href={STORE_POLICY_PAGES.RETURNS.href} target="_blank" className="font-bold text-slate-900 underline-offset-2 hover:underline">
              chính sách đổi trả & bảo hành
            </Link>{' '}
            của Bảo An Sport.
          </span>
        }
      />

      {quote?.requiresShippingConsultation && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs sm:text-sm font-semibold text-amber-900">
            Đơn hàng hiện chỉ tính tiền sản phẩm. Nhân viên sẽ liên hệ thông báo cước gửi xe; bấm kiểm tra lại phí sau khi đã thống nhất để đặt hàng.
          </p>
          <Button
            variant="warning"
            onClick={refreshConsultedQuote}
            disabled={busy}
            className="shrink-0 text-xs font-black focus-visible:ring-amber-500"
          >
            {busy ? 'Đang kiểm tra...' : 'Kiểm tra lại phí'}
          </Button>
        </div>
      )}

      {error && (
        <InlineAlert role="alert" className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
          <AlertTriangle aria-hidden className="size-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </InlineAlert>
      )}

    </section>
  );
}
