'use client';

import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Banknote, CheckCircle2, Clock3, ImageUp, LoaderCircle } from 'lucide-react';
import {
  getAccountPayment,
  getGetAccountPaymentQueryKey,
  getGetGuestPaymentQueryKey,
  getGuestPayment,
  submitAccountPaymentEvidence,
  submitGuestPaymentEvidence,
} from '@/generated/api/payments/payments';
import type { PaymentDetailDto } from '@/generated/api/payments/models';
import { ApiError } from '@/lib/api/fetcher';
import { vndMoney } from '@/shared/format/money';
import { uploadPaymentEvidence, type VerifiedPaymentEvidenceUpload } from '../api/payment-evidence-upload';

interface PendingUpload {
  signature: string;
  idempotencyKey: string;
  verified?: VerifiedPaymentEvidenceUpload;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.payload && typeof error.payload === 'object' && 'message' in error.payload) {
    const value = (error.payload as { message?: unknown }).message;
    if (typeof value === 'string') return value;
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Không xử lý được bằng chứng thanh toán. Vui lòng thử lại.';
}

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
      ? getAccountPayment(orderNo, undefined, signal)
      : getGuestPayment(orderNo, { headers: { 'x-cart-token': guestToken } }, signal),
  });
  const payment = paymentQuery.data;
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
        ? submitAccountPaymentEvidence(orderNo, body, { headers })
        : submitGuestPaymentEvidence(orderNo, body, { headers: { ...headers, 'x-cart-token': guestToken } });
    },
    onSuccess: async (updated) => {
      queryClient.setQueryData(queryKey, updated);
      pendingUpload.current = undefined;
      setFile(undefined);
      setNote('');
      await onPaymentChanged();
    },
  });

  if (paymentQuery.isLoading) {
    return <section className="grid min-h-40 place-items-center rounded-3xl border border-slate-200 bg-white"><LoaderCircle className="size-7 animate-spin text-emerald-600" /></section>;
  }
  if (paymentQuery.isError || !payment) {
    return <section className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">{errorMessage(paymentQuery.error)}</section>;
  }

  const canSubmit = payment.method === 'BANK_TRANSFER'
    && ['PENDING', 'FAILED', 'NEED_REVIEW'].includes(payment.status);
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Thanh toán</p>
          <h2 className="mt-1 text-lg font-black">{payment.paymentRef}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{payment.status}</span>
      </div>
      <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">
        <div className="flex items-center gap-2 text-emerald-300"><Banknote className="size-4" /><strong>{payment.instruction.provider}</strong></div>
        <p className="mt-2 text-sm leading-6 text-slate-200">{payment.instruction.customerMessage}</p>
        <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-sm"><span>Số tiền</span><strong className="text-emerald-300">{vndMoney.format(Number(payment.expectedAmount))}</strong></div>
      </div>
      {payment.expiresAt && payment.status === 'PENDING' && (
        <p className="mt-3 flex items-center gap-2 text-xs text-amber-700"><Clock3 className="size-4" />Gửi bằng chứng trước {new Date(payment.expiresAt).toLocaleString('vi-VN')}.</p>
      )}
      {payment.status === 'SUCCESS' && <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800"><CheckCircle2 className="size-5" />Đã xác nhận thanh toán đủ tiền.</p>}
      {payment.failureReason && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{payment.failureReason}</p>}

      {payment.evidences.length > 0 && (
        <div className="mt-5 space-y-2">
          <h3 className="text-sm font-black">Bằng chứng đã gửi</h3>
          {payment.evidences.map((evidence) => (
            <a key={evidence.id} href={evidence.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm hover:border-emerald-300">
              <span>Ảnh #{evidence.id}</span><strong>{evidence.status}</strong>
            </a>
          ))}
        </div>
      )}

      {canSubmit && (
        <div className="mt-5 border-t border-slate-100 pt-5">
          <label className="block text-sm font-bold">Ảnh bằng chứng <span className="text-rose-600">*</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { setFile(event.target.files?.[0]); submit.reset(); pendingUpload.current = undefined; }} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 text-sm" /></label>
          <label className="mt-3 block text-sm font-bold">Ghi chú<textarea value={note} onChange={(event) => { setNote(event.target.value); pendingUpload.current = undefined; }} rows={2} maxLength={1000} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 font-normal" /></label>
          {submit.isError && <p className="mt-3 text-sm font-semibold text-rose-700">{errorMessage(submit.error)}</p>}
          <button type="button" disabled={!file || submit.isPending} onClick={() => submit.mutate()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><ImageUp className="size-4" />{submit.isPending ? 'Đang tải và gửi...' : 'Gửi bằng chứng'}</button>
        </div>
      )}
    </section>
  );
}
