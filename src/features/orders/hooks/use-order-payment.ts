import { useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAccountPayment,
  getGetAccountPaymentQueryKey,
  getGetGuestPaymentQueryKey,
  getGuestPayment,
  submitAccountPaymentEvidence,
  submitGuestPaymentEvidence,
} from '@/generated/api/payments/payments';
import type { PaymentDetailDto } from '@/generated/api/payments/payments.schemas';
import { apiErrorMessage } from '@/lib/api/error-message';
import { uploadPaymentEvidence, type VerifiedPaymentEvidenceUpload } from '../api/payment-evidence-upload';
import { paymentRequest } from '../api/payment-request';
import { toPaymentDetailView } from '../model/payment.mapper';
import {
  EVIDENCE_SUBMITTABLE_PAYMENT_STATUSES,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  VNPAY_RETRYABLE_PAYMENT_STATUSES,
  statusIn,
} from '../model/order.constants';

interface PendingUpload {
  signature: string;
  idempotencyKey: string;
  verified?: VerifiedPaymentEvidenceUpload;
}

export function paymentErrorMessage(error: unknown): string {
  const fallback = error instanceof Error && error.message
    ? error.message
    : 'Không xử lý được bằng chứng thanh toán. Vui lòng thử lại.';
  return apiErrorMessage(error, fallback);
}

/**
 * Query trạng thái thanh toán + mutation gửi bằng chứng chuyển khoản. Giữ nguyên hành vi
 * idempotency: cùng chữ ký (file/note/version) tái dùng key cũ; đổi nội dung sinh key mới.
 */
export function useOrderPayment({
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
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File>();
  const [note, setNote] = useState('');
  const pendingUpload = useRef<PendingUpload | undefined>(undefined);
  const queryKey = authenticated
    ? getGetAccountPaymentQueryKey(orderNo)
    : getGetGuestPaymentQueryKey(orderNo);
  const paymentQuery = useQuery({
    queryKey,
    retry: false,
    queryFn: ({ signal }) => authenticated
      ? getAccountPayment(orderNo, paymentRequest(), signal)
      : getGuestPayment(orderNo, paymentRequest({ headers: { 'x-cart-token': guestToken } }), signal),
  });
  const payment = paymentQuery.data;
  // DTO giữ cho lệnh gửi bằng chứng; hiển thị dùng view model.
  const view = useMemo(() => (payment ? toPaymentDetailView(payment) : undefined), [payment]);
  const submit = useMutation({
    retry: false,
    mutationFn: async (): Promise<PaymentDetailDto> => {
      if (!file || !payment) throw new Error('Vui lòng chọn ảnh bằng chứng chuyển khoản.');
      const signature = `${file.name}:${file.size}:${file.lastModified}:${payment.version}:${note.trim()}`;
      if (pendingUpload.current?.signature !== signature) {
        pendingUpload.current = { signature, idempotencyKey: crypto.randomUUID() };
      }
      // RETRY: Sau khi Cloudinary upload thành công, giữ lại provider response để
      // retry chỉ gọi finalize API với cùng idempotency payload, không upload ảnh lần hai.
      pendingUpload.current.verified ??= await uploadPaymentEvidence(
        orderNo, file, authenticated, guestToken,
      );
      const body = {
        ...pendingUpload.current.verified,
        note: note.trim() || undefined,
        expectedVersion: payment.version,
      };
      const headers = { 'idempotency-key': pendingUpload.current.idempotencyKey };
      return authenticated
        ? submitAccountPaymentEvidence(orderNo, body, paymentRequest({ headers }))
        : submitGuestPaymentEvidence(orderNo, body, paymentRequest({ headers: { ...headers, 'x-cart-token': guestToken } }));
    },
    onSuccess: async (updated) => {
      queryClient.setQueryData(queryKey, updated);
      pendingUpload.current = undefined;
      setFile(undefined);
      setNote('');
      await onPaymentChanged();
    },
  });

  const canSubmit = Boolean(
    view
    && view.methodCode === PAYMENT_METHOD.BANK_TRANSFER
    && statusIn(EVIDENCE_SUBMITTABLE_PAYMENT_STATUSES, view.statusCode),
  );
  const canRetryVnpay = Boolean(
    view
    && view.methodCode === PAYMENT_METHOD.VNPAY
    && view.redirectUrl
    && statusIn(VNPAY_RETRYABLE_PAYMENT_STATUSES, view.statusCode),
  );

  return {
    isLoading: paymentQuery.isLoading,
    isError: paymentQuery.isError || (!paymentQuery.isLoading && (!payment || !view)),
    error: paymentQuery.error,
    view,
    canSubmit,
    canRetryVnpay,
    file,
    setFile,
    note,
    setNote,
    submit,
    resetPendingUpload: () => { pendingUpload.current = undefined; },
  };
}
