import Link from 'next/link';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/foundation/components/feedback';
import type { CheckoutPaymentMethod, CheckoutQuoteDto } from '@/generated/api/checkout/checkout.schemas';
import { STORE_POLICY_PAGES } from '@/shared/constants';

/** Bước 4: đồng ý điều khoản, kiểm tra lại phí khi chờ tư vấn cước, khung lỗi và nút đặt hàng trên mobile. */
export function CheckoutConfirmSection({
  acceptedTerms,
  setAcceptedTerms,
  quote,
  refreshConsultedQuote,
  busy,
  error,
  redirectingToVnpay,
  paymentMethod,
}: {
  acceptedTerms: boolean;
  setAcceptedTerms: (value: boolean) => void;
  quote: CheckoutQuoteDto | undefined;
  refreshConsultedQuote: () => void;
  busy: boolean;
  error: string;
  redirectingToVnpay: boolean;
  paymentMethod: CheckoutPaymentMethod;
}) {
  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4 text-xs sm:text-sm text-slate-700 border border-slate-200/60">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-0.5 size-4 accent-emerald-600 cursor-pointer rounded"
        />
        <span className="leading-relaxed">
          Tôi đã đọc và đồng ý với{' '}
          <Link href={STORE_POLICY_PAGES.TERMS.href} target="_blank" className="font-bold text-emerald-700 underline-offset-2 hover:underline">
            {STORE_POLICY_PAGES.TERMS.title.toLowerCase()}
          </Link>{' '}
          và{' '}
          <Link href={STORE_POLICY_PAGES.RETURNS.href} target="_blank" className="font-bold text-emerald-700 underline-offset-2 hover:underline">
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
            className="shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-xs font-black text-white hover:bg-amber-700 disabled:bg-slate-300"
          >
            {busy ? 'Đang kiểm tra...' : 'Kiểm tra lại phí'}
          </button>
        </div>
      )}

      {error && (
        <div role="alert" className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
          <AlertTriangle className="size-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Mobile Submit Button */}
      <div className="mt-5 lg:hidden">
        <button
          type="submit"
          disabled={busy || redirectingToVnpay}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {busy ? <Spinner className="size-5 animate-spin" /> : <CheckCircle2 className="size-5" />}
          <span>
            {redirectingToVnpay
              ? 'Đang chuyển sang VNPay...'
              : busy
              ? 'Đang xử lý...'
              : paymentMethod === 'VNPAY'
              ? 'Đặt hàng & Thanh toán VNPay'
              : 'Đặt hàng'}
          </span>
        </button>
      </div>
    </section>
  );
}
