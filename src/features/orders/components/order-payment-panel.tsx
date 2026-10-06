'use client';

import { Banknote, CreditCard, CheckCircle2, Clock3, ImageUp } from 'lucide-react';
import { ErrorState, InlineAlert, Skeleton, SkeletonText, Spinner } from '@/foundation/components/feedback';
import { Field, Textarea } from '@/foundation/components/field-system';
import { Card } from '@/foundation/components/structure';
import { Button, CopyButton, buttonVariants } from '@/foundation/components/buttons';
import { useOrderPayment, paymentErrorMessage } from '../hooks/use-order-payment';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '../model/order.constants';

export function OrderPaymentPanel({
  orderNo,
  authenticated,
  guestToken,
  onPaymentChanged,
}: {
  orderNo: string;
  authenticated: boolean;
  guestToken: string | null;
  onPaymentChanged: () => Promise<void>;
}) {
  const {
    isLoading,
    isError,
    error,
    view,
    canSubmit,
    canRetryVnpay,
    file,
    setFile,
    note,
    setNote,
    submit,
    resetPendingUpload,
  } = useOrderPayment({ orderNo, authenticated, guestToken, onPaymentChanged });

  if (isLoading) {
    return (
      <Card as="section" aria-label="Đang tải thông tin thanh toán" className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <SkeletonText lines={2} className="w-40" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="mt-5 h-24 w-full rounded-2xl" />
        <Skeleton className="mt-4 h-12 w-full rounded-2xl" />
      </Card>
    );
  }
  if (isError || !view) {
    return (
      <ErrorState
        as="section"
        className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-sm text-rose-800 shadow-sm"
        titleAs="p"
        titleClassName="font-bold"
        title="Không thể tải thông tin thanh toán"
        descriptionClassName="mt-1 text-xs text-rose-700"
        description={paymentErrorMessage(error)}
      />
    );
  }

  const isSuccess = view.statusCode === PAYMENT_STATUS.SUCCESS;
  const isFailed = view.statusCode === PAYMENT_STATUS.FAILED || view.statusCode === PAYMENT_STATUS.CANCELLED;
  const isPending = view.statusCode === PAYMENT_STATUS.PENDING;

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-700">
            <CreditCard aria-hidden className="size-3.5" /> Thông tin thanh toán
          </span>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-sm font-extrabold text-slate-900">{view.paymentRef}</span>
            <CopyButton
              value={view.paymentRef}
              className="grid size-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              title="Sao chép mã giao dịch"
              aria-label="Sao chép mã giao dịch"
              idleIcon={<CreditCard className="size-3.5" />}
              copiedIcon={<CheckCircle2 className="size-3.5 text-success-600" />}
            />
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
            isSuccess
              ? 'bg-success-100 text-success-800'
              : isFailed
              ? 'bg-rose-100 text-rose-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {isSuccess && <CheckCircle2 className="size-3.5" />}
          {isPending && <Clock3 className="size-3.5" />}
          {view.statusLabel}
        </span>
      </div>

      {/* Main Payment Details Box */}
      <div className="mt-5 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2.5 text-slate-900">
          <div className="grid size-8 place-items-center rounded-xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
            {view.methodCode === PAYMENT_METHOD.COD ? <Banknote className="size-4" /> : <CreditCard className="size-4" />}
          </div>
          <div>
            <strong className="block text-sm font-bold text-slate-900">{view.providerLabel}</strong>
            <span className="text-[11px] text-slate-500">Phương thức: {view.methodLabel}</span>
          </div>
        </div>

        {view.customerMessage && (
          <p className="mt-3 text-xs leading-relaxed text-slate-600 bg-white/80 rounded-xl p-3 border border-slate-100">
            {view.customerMessage}
          </p>
        )}
      </div>

      {/* Expiry Notice */}
      {view.expiresLabel && isPending && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-xs font-medium text-amber-800">
          <Clock3 className="size-4 shrink-0 text-amber-600" />
          <span>Vui lòng hoàn tất trước <strong>{view.expiresLabel}</strong> để tránh đơn bị tự động hủy.</span>
        </div>
      )}

      {/* Success Notification */}
      {isSuccess && (
        <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-success-50 border border-success-200/80 p-3.5 text-sm font-bold text-success-800">
          <CheckCircle2 className="size-5 shrink-0 text-success-600" />
          <span>Đã xác nhận thanh toán đủ tiền thành công.</span>
        </div>
      )}

      {/* VNPay Actions */}
      {canRetryVnpay && (
        <a
          href={view.redirectUrl ?? undefined}
          className={buttonVariants({ variant: 'primary', size: 'lg', fullWidth: true, className: 'mt-5 rounded-2xl px-5 text-sm font-black shadow-glow' })}
        >
          <CreditCard className="size-4.5" />
          {view.statusCode === PAYMENT_STATUS.FAILED ? 'Thử thanh toán lại qua VNPay' : 'Thanh toán qua cổng VNPay'}
        </a>
      )}
      {view.methodCode === PAYMENT_METHOD.VNPAY && !view.redirectUrl && (
        <p className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs leading-5 text-amber-800">
          Cổng VNPay hiện chưa sẵn sàng. Vui lòng liên hệ cửa hàng để được hỗ trợ phương thức khác.
        </p>
      )}

      {/* Failure Reason */}
      {view.failureReason && (
        <InlineAlert as="p" className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-800">
          {view.failureReason}
        </InlineAlert>
      )}

      {/* Submitted Evidences */}
      {view.evidences.length > 0 && (
        <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Bằng chứng đã gửi ({view.evidences.length})</h3>
          {view.evidences.map((evidence) => (
            <a
              key={evidence.id}
              href={evidence.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 text-xs transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <span className="font-medium text-slate-700">Ảnh gửi {evidence.submittedLabel}</span>
              <strong className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-slate-700 text-[11px]">
                {evidence.statusLabel}
              </strong>
            </a>
          ))}
        </div>
      )}

      {/* Submit Evidence Form */}
      {canSubmit && (
        <div className="mt-5 border-t border-slate-100 pt-5">
          <span className="block text-xs font-black uppercase tracking-wider text-slate-800">
            Tải lên bằng chứng chuyển khoản <span className="text-rose-600">*</span>
          </span>
          <div className="mt-2.5">
            <label className="block text-xs font-semibold text-slate-700">
              Chọn tệp ảnh
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(event) => {
                  setFile(event.target.files?.[0]);
                  submit.reset();
                  resetPendingUpload();
                }}
                className="mt-1.5 block w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-brand-700"
              />
            </label>
          </div>
          <div className="mt-3">
            <Field label="Ghi chú thêm (không bắt buộc)" labelClassName="block text-xs font-semibold text-slate-700">
              <Textarea
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);
                  resetPendingUpload();
                }}
                rows={2}
                maxLength={1000}
                placeholder="Ví dụ: Đã chuyển khoản từ ngân hàng MB qua số..."
                invalid={false} // Textarea chưa có `size`: cần `invalid` để thoát chế độ passthrough className
                className="mt-1.5 min-h-16"
              />
            </Field>
          </div>
          {submit.isError && (
            <p role="alert" className="mt-2.5 text-xs font-semibold text-rose-700">
              {paymentErrorMessage(submit.error)}
            </p>
          )}
          <Button
            variant="primary"
            fullWidth
            disabled={!file || submit.isPending}
            onClick={() => submit.mutate()}
            className="mt-4 text-xs font-bold shadow-sm"
          >
            {submit.isPending ? <Spinner className="size-4 animate-spin" /> : <ImageUp className="size-4" />}
            {submit.isPending ? 'Đang tải ảnh và gửi...' : 'Gửi xác nhận chuyển khoản'}
          </Button>
        </div>
      )}
    </section>
  );
}
