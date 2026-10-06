'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Circle, CircleDot } from 'lucide-react';
import { Button, buttonVariants } from '@/foundation/components/buttons';
import { EmptyState, InlineAlert } from '@/foundation/components/feedback';
import { Field, Textarea } from '@/foundation/components/field-system';
import { OrderItemType, RefundStatus, ReturnStatus } from '@/generated/api/returns/returns.schemas';
import { ReturnDetailSkeleton } from '../components/return-skeletons';
import { formatDateTime } from '@/shared/format/date-time';
import { formatVnd } from '@/shared/format/money';
import {
  RETURN_ESTIMATE_NOTE,
  RETURN_FIELD_LABELS,
  refundMethodLabels,
  returnConditionLabels,
  returnReasonLabels,
  returnStatusLabels,
  returnStatusTone,
} from '../model/return.constants';
import { returnErrorMessage } from '../model/return-error';
import { useReturnDetail } from '../hooks/use-return-detail';

const money = (value: string | number) => formatVnd(Number(value));

export function ReturnDetailPage({ returnNo }: { returnNo: string }) {
  const {
    isAuthenticated,
    isLoaded,
    query,
    detail,
    progress,
    showCancel,
    setShowCancel,
    reason,
    setReason,
    cancel,
    canCustomerCancel: canCancel,
  } = useReturnDetail(returnNo);

  return (
      <main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-10 sm:px-6">
        {(!isLoaded || (isAuthenticated && query.isLoading)) && (
          <ReturnDetailSkeleton />
        )}
        {isLoaded && !isAuthenticated && (
          <EmptyState
            as="section"
            className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm"
            titleAs="h1"
            titleClassName="text-xl font-black"
            title="Đăng nhập để xem yêu cầu đổi trả"
            actions={<Link href="/login" className={buttonVariants({ variant: 'primary', className: 'mt-5 px-5 font-bold' })}>Đăng nhập</Link>}
          />
        )}
        {query.isError && (
          <InlineAlert as="section" role="alert" className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-800">
            {returnErrorMessage(query.error, 'Không tìm thấy yêu cầu đổi trả.')}
          </InlineAlert>
        )}

        {detail && (
          <>
            <div className="rounded-[30px] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 p-5 text-white shadow-xl sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-300">{RETURN_FIELD_LABELS.returnNo}</p>
                  <h1 className="mt-2 break-all font-mono text-xl font-black sm:text-2xl">{detail.returnNo}</h1>
                  <p className="mt-2 text-sm text-slate-300">
                    {RETURN_FIELD_LABELS.orderNo}{' '}
                    <Link href={`/orders/${encodeURIComponent(detail.orderNo)}`} className="font-bold underline underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{detail.orderNo}</Link>
                    {' · '}{formatDateTime(detail.createdAt)}
                  </p>
                </div>
                <span className={`rounded-full px-4 py-2 text-sm font-bold ${returnStatusTone[detail.status]}`}>{returnStatusLabels[detail.status]}</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div><span className="text-xs text-slate-400">{RETURN_FIELD_LABELS.reason}</span><strong className="block">{returnReasonLabels[detail.reasonCode]}</strong></div>
                <div>
                  <span className="text-xs text-slate-400">{detail.refundCap ? 'Số tiền được hoàn' : RETURN_FIELD_LABELS.estimatedRefund}</span>
                  <strong className="block text-brand-300">{money(detail.estimatedRefundAmount)}</strong>
                </div>
                <div><span className="text-xs text-slate-400">{RETURN_FIELD_LABELS.refunded}</span><strong className="block">{money(detail.refundedAmount)}</strong></div>
              </div>
              {!detail.refundCap && <p className="mt-3 text-xs text-slate-400">{RETURN_ESTIMATE_NOTE}</p>}
            </div>

            {progress.length > 0 && (
              <ol className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-5">
                {progress.map((step) => (
                  <li key={step.key} aria-current={step.state === 'current' ? 'step' : undefined} className="flex items-center gap-2 text-sm">
                    {step.state === 'done' ? <CheckCircle2 aria-hidden className="size-5 shrink-0 text-success-600" /> : step.state === 'current' ? <CircleDot aria-hidden className="size-5 shrink-0 text-amber-500" /> : <Circle aria-hidden className="size-5 shrink-0 text-slate-300" />}
                    <span className={step.state === 'upcoming' ? 'text-slate-400' : 'font-bold'}>{step.label}</span>
                  </li>
                ))}
              </ol>
            )}
            {detail.status === ReturnStatus.APPROVED && (
              <InlineAlert as="p" className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
                Yêu cầu đã được duyệt. Vui lòng gửi hoặc mang sản phẩm về cửa hàng; tiền được hoàn sau khi cửa hàng nhận và kiểm hàng.
              </InlineAlert>
            )}
            {detail.decisionNote && (
              <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Phản hồi của cửa hàng: {detail.decisionNote}</p>
            )}

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-lg font-black">{RETURN_FIELD_LABELS.product}</h2>
                <div className="mt-4 divide-y divide-slate-100">
                  {detail.items.map((item) => (
                    <div key={item.id} className="flex flex-wrap justify-between gap-4 py-4">
                      <div>
                        <strong>{item.productName}</strong>
                        <p className="text-xs text-slate-500">{item.variantName} · {item.sku} · {RETURN_FIELD_LABELS.quantity} {item.quantity}</p>
                        {item.itemType === OrderItemType.BUNDLE && <p className="text-xs text-amber-700">Combo nguyên bộ</p>}
                      </div>
                      {item.condition && (
                        <div className="text-sm sm:text-right">
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
                        {/* SECURITY: ảnh minh chứng riêng tư, không qua bộ tối ưu ảnh/cache SW. */}
                        <Image src={image.thumbnailUrl} alt="Ảnh minh chứng" fill sizes="96px" unoptimized className="object-cover" />
                      </a>
                    ))}
                  </div>
                )}
              </section>

              <aside className="space-y-5">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="font-black">{RETURN_FIELD_LABELS.refunds}</h2>
                  {detail.refunds.filter((refund) => refund.status === RefundStatus.SUCCEEDED).length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">Chưa hoàn tiền.</p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {detail.refunds.filter((refund) => refund.status === RefundStatus.SUCCEEDED).map((refund) => (
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
              <Link href="/returns" className={buttonVariants({ variant: 'outline', className: 'border-slate-200 font-bold text-slate-700' })}>Danh sách yêu cầu</Link>
              {canCancel(detail.status) && (
                <Button variant="dangerOutline" onClick={() => setShowCancel(true)} aria-expanded={showCancel} className="font-bold focus-visible:ring-rose-500">Huỷ yêu cầu</Button>
              )}
            </div>
            {showCancel && (
              <section className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-4 sm:p-6">
                <Field label={<>Lý do huỷ <span className="text-rose-600">*</span></>} labelClassName="font-black text-rose-950">
                <Textarea
                  id="return-cancel-reason"
                  styled
                  value={reason}
                  maxLength={500}
                  rows={3}
                  onChange={(event) => setReason(event.target.value)}
                  aria-describedby="return-cancel-reason-hint"
                  className="mt-3 min-h-0 border-rose-200 focus-visible:border-rose-400 focus-visible:ring-rose-200"
                />
                </Field>
                {cancel.isError && <InlineAlert as="p" role="alert" className="mt-2 text-sm font-semibold text-rose-700">{returnErrorMessage(cancel.error, 'Không huỷ được yêu cầu.')}</InlineAlert>}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="danger" disabled={cancel.isPending || reason.trim().length < 5} onClick={() => cancel.mutate()} className="font-bold focus-visible:ring-rose-500">
                    {cancel.isPending ? 'Đang huỷ...' : 'Xác nhận huỷ'}
                  </Button>
                  <Button variant="outline" disabled={cancel.isPending} onClick={() => { cancel.reset(); setShowCancel(false); }} className="border-slate-200 font-bold text-slate-700">Đóng</Button>
                </div>
                <p id="return-cancel-reason-hint" className="mt-2 text-xs text-rose-800">Lý do ít nhất 5 ký tự.</p>
              </section>
            )}
          </>
        )}
      </main>
  );
}
