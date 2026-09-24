'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Circle, CircleDot, LoaderCircle } from 'lucide-react';
import { useCustomerAuth } from '@/features/auth';
import {
  cancelAccountReturn,
  getGetAccountReturnQueryKey,
  getListAccountReturnsQueryKey,
  useGetAccountReturn,
} from '@/generated/api/returns/returns';
import type { ReturnDetailDto } from '@/generated/api/returns/models';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { formatDateTime } from '@/shared/format/date-time';
import { vndMoney } from '@/shared/format/money';
import {
  RETURN_ESTIMATE_NOTE,
  RETURN_FIELD_LABELS,
  refundMethodLabels,
  returnConditionLabels,
  returnReasonLabels,
  returnStatusLabels,
  returnStatusTone,
} from '../model/return.constants';
import { canCustomerCancel, toReturnProgress } from '../model/return.mapper';
import { returnErrorMessage } from '../model/return-error';

const money = (value: string | number) => vndMoney.format(Number(value));

export function ReturnDetailPage({ returnNo }: { returnNo: string }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState('');
  const idempotencyRef = useRef<{ signature: string; key: string } | undefined>(undefined);
  const query = useGetAccountReturn(returnNo, { query: { enabled: isLoaded && isAuthenticated, retry: false } });
  const detail = query.data;

  const cancel = useMutation<ReturnDetailDto>({
    retry: false,
    mutationFn: () => {
      if (!detail) throw new Error('Chưa tải được yêu cầu');
      const body = { expectedVersion: detail.version, reason: reason.trim() };
      const signature = JSON.stringify({ returnNo, ...body });
      if (idempotencyRef.current?.signature !== signature) {
        idempotencyRef.current = { signature, key: crypto.randomUUID() };
      }
      return cancelAccountReturn(returnNo, body, { headers: { 'idempotency-key': idempotencyRef.current.key } });
    },
    onSuccess: async (updated) => {
      idempotencyRef.current = undefined;
      queryClient.setQueryData(getGetAccountReturnQueryKey(returnNo), updated);
      // CACHE: trạng thái đổi làm đổi nhãn trên danh sách phiếu.
      await queryClient.invalidateQueries({ queryKey: getListAccountReturnsQueryKey() });
      setShowCancel(false);
      setReason('');
    },
  });

  const progress = detail ? toReturnProgress(detail) : [];

  return (
    <StorefrontLayout>
      <main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-10 sm:px-6">
        {(!isLoaded || (isAuthenticated && query.isLoading)) && (
          <div className="grid min-h-72 place-items-center"><LoaderCircle className="size-9 animate-spin text-emerald-600" /></div>
        )}
        {isLoaded && !isAuthenticated && (
          <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-xl font-black">Đăng nhập để xem yêu cầu đổi trả</h1>
            <Link href="/login" className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Đăng nhập</Link>
          </section>
        )}
        {query.isError && (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-800">
            {returnErrorMessage(query.error, 'Không tìm thấy yêu cầu đổi trả.')}
          </section>
        )}

        {detail && (
          <>
            <div className="rounded-[30px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-7 text-white shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">{RETURN_FIELD_LABELS.returnNo}</p>
                  <h1 className="mt-2 font-mono text-2xl font-black">{detail.returnNo}</h1>
                  <p className="mt-2 text-sm text-slate-300">
                    {RETURN_FIELD_LABELS.orderNo}{' '}
                    <Link href={`/orders/${encodeURIComponent(detail.orderNo)}`} className="font-bold underline">{detail.orderNo}</Link>
                    {' · '}{formatDateTime(detail.createdAt)}
                  </p>
                </div>
                <span className={`rounded-full px-4 py-2 text-sm font-bold ${returnStatusTone[detail.status]}`}>{returnStatusLabels[detail.status]}</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div><span className="text-xs text-slate-400">{RETURN_FIELD_LABELS.reason}</span><strong className="block">{returnReasonLabels[detail.reasonCode]}</strong></div>
                <div>
                  <span className="text-xs text-slate-400">{detail.refundCap ? 'Số tiền được hoàn' : RETURN_FIELD_LABELS.estimatedRefund}</span>
                  <strong className="block text-emerald-300">{money(detail.estimatedRefundAmount)}</strong>
                </div>
                <div><span className="text-xs text-slate-400">{RETURN_FIELD_LABELS.refunded}</span><strong className="block">{money(detail.refundedAmount)}</strong></div>
              </div>
              {!detail.refundCap && <p className="mt-3 text-xs text-slate-400">{RETURN_ESTIMATE_NOTE}</p>}
            </div>

            {progress.length > 0 && (
              <ol className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-5">
                {progress.map((step) => (
                  <li key={step.key} className="flex items-center gap-2 text-sm">
                    {step.state === 'done' ? <CheckCircle2 className="size-5 text-emerald-600" /> : step.state === 'current' ? <CircleDot className="size-5 text-amber-500" /> : <Circle className="size-5 text-slate-300" />}
                    <span className={step.state === 'upcoming' ? 'text-slate-400' : 'font-bold'}>{step.label}</span>
                  </li>
                ))}
              </ol>
            )}
            {detail.status === 'APPROVED' && (
              <p className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
                Yêu cầu đã được duyệt. Vui lòng gửi hoặc mang sản phẩm về cửa hàng; tiền được hoàn sau khi cửa hàng nhận và kiểm hàng.
              </p>
            )}
            {detail.decisionNote && (
              <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Phản hồi của cửa hàng: {detail.decisionNote}</p>
            )}

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black">{RETURN_FIELD_LABELS.product}</h2>
                <div className="mt-4 divide-y divide-slate-100">
                  {detail.items.map((item) => (
                    <div key={item.id} className="flex flex-wrap justify-between gap-4 py-4">
                      <div>
                        <strong>{item.productName}</strong>
                        <p className="text-xs text-slate-500">{item.variantName} · {item.sku} · {RETURN_FIELD_LABELS.quantity} {item.quantity}</p>
                        {item.itemType === 'BUNDLE' && <p className="text-xs text-amber-700">Combo nguyên bộ</p>}
                      </div>
                      {item.condition && (
                        <div className="text-right text-sm">
                          <span className="block text-xs text-slate-500">{RETURN_FIELD_LABELS.inspection}</span>
                          <strong>{returnConditionLabels[item.condition]}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {detail.description && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-black">{RETURN_FIELD_LABELS.description}</h3>
                    <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{detail.description}</p>
                  </div>
                )}
                {detail.evidenceImages.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {detail.evidenceImages.map((image) => (
                      <a key={image.url} href={image.url} target="_blank" rel="noreferrer" className="relative block size-24 overflow-hidden rounded-xl border border-slate-200">
                        <Image src={image.thumbnailUrl} alt="Ảnh minh chứng" fill sizes="96px" className="object-cover" />
                      </a>
                    ))}
                  </div>
                )}
              </section>

              <aside className="space-y-5">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="font-black">{RETURN_FIELD_LABELS.refunds}</h2>
                  {detail.refunds.filter((refund) => refund.status === 'SUCCEEDED').length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">Chưa hoàn tiền.</p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {detail.refunds.filter((refund) => refund.status === 'SUCCEEDED').map((refund) => (
                        <div key={refund.id} className="text-sm">
                          <strong>{money(refund.amount)}</strong> · {refundMethodLabels[refund.method]}
                          <p className="text-xs text-slate-500">{formatDateTime(refund.processedAt)}{refund.externalRef ? ` · Mã GD ${refund.externalRef}` : ''}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="font-black">{RETURN_FIELD_LABELS.history}</h2>
                  <div className="mt-3 space-y-3">
                    {detail.history.map((entry) => (
                      <div key={entry.sequenceNo} className="text-sm">
                        <strong>{returnStatusLabels[entry.toStatus]}</strong>
                        <p className="text-xs text-slate-500">{formatDateTime(entry.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <Link href="/returns" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold">Danh sách yêu cầu</Link>
              {canCustomerCancel(detail.status) && (
                <button type="button" onClick={() => setShowCancel(true)} className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700">Huỷ yêu cầu</button>
              )}
            </div>
            {showCancel && (
              <section className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-6">
                <label htmlFor="return-cancel-reason" className="font-black text-rose-950">Lý do huỷ <span className="text-rose-600">*</span></label>
                <textarea
                  id="return-cancel-reason"
                  value={reason}
                  maxLength={500}
                  rows={3}
                  onChange={(event) => setReason(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-rose-200 bg-white p-3 text-sm"
                />
                {cancel.isError && <p className="mt-2 text-sm font-semibold text-rose-700">{returnErrorMessage(cancel.error, 'Không huỷ được yêu cầu.')}</p>}
                <div className="mt-4 flex gap-3">
                  <button type="button" disabled={cancel.isPending || reason.trim().length < 5} onClick={() => cancel.mutate()} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                    {cancel.isPending ? 'Đang huỷ...' : 'Xác nhận huỷ'}
                  </button>
                  <button type="button" disabled={cancel.isPending} onClick={() => { cancel.reset(); setShowCancel(false); }} className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold">Đóng</button>
                </div>
                <p className="mt-2 text-xs text-rose-800">Lý do ít nhất 5 ký tự.</p>
              </section>
            )}
          </>
        )}
      </main>
    </StorefrontLayout>
  );
}
