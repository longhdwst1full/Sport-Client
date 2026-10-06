import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import type { CheckoutQuoteDto } from '@/generated/api/checkout/checkout.schemas';
import { InlineAlert } from '@/foundation/components/feedback';
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
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4 text-xs sm:text-sm text-slate-700 border border-slate-200/60">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-brand-600 cursor-pointer rounded"
        />
        <span className="leading-relaxed">
          Tôi đã đọc và đồng ý với{' '}
          <Link href={STORE_POLICY_PAGES.TERMS.href} target="_blank" className="font-bold text-brand-700 underline-offset-2 hover:underline">
            {STORE_POLICY_PAGES.TERMS.title.toLowerCase()}
          </Link>{' '}
          và{' '}
          <Link href={STORE_POLICY_PAGES.RETURNS.href} target="_blank" className="font-bold text-brand-700 underline-offset-2 hover:underline">
            chính sách đổi trả & bảo hành
          </Link>{' '}
          của Bảo An Sport.
        </span>
      </label>

      {quote?.requiresShippingConsultation && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs sm:text-sm font-semibold text-amber-900">
            Đơn hàng hiện chỉ tính tiền sản phẩm. Nhân viên sẽ liên hệ thông báo cước gửi xe; bấm kiểm tra lại phí sau khi đã thống nhất để đặt hàng.
          </p>
          <button
            type="button"
            onClick={refreshConsultedQuote}
            disabled={busy}
            className="min-h-11 shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-xs font-black text-white hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:bg-slate-300 disabled:text-slate-600"
          >
            {busy ? 'Đang kiểm tra...' : 'Kiểm tra lại phí'}
          </button>
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
