'use client';

import Link from 'next/link';
import { PackageX } from 'lucide-react';
import { Button, buttonVariants } from '@/foundation/components/buttons';
import { EmptyState, InlineAlert, Skeleton } from '@/foundation/components/feedback';
import { Checkbox, Field, Select, Textarea, TextInput } from '@/foundation/components/field-system';
import { formatVnd } from '@/shared/format/money';
import { formatDate } from '@/shared/format/date-time';
import { EvidencePicker } from '../components/evidence-picker';
import type { CreateReturnFormState } from '../model/return.mapper';
import {
  RETURN_ESTIMATE_NOTE,
  RETURN_FIELD_LABELS,
  returnEligibilityReasonLabels,
  returnReasonLabels,
} from '../model/return.constants';
import { apiErrorMessage } from '@/lib/api/error-message';
import { useCreateReturn } from '../hooks/use-create-return';

const reasonOptions = Object.entries(returnReasonLabels) as [CreateReturnFormState['reasonCode'], string][];

/**
 * Khách tạo yêu cầu trả hàng cho một đơn đã giao. Luật (hạn trả, số lượng, combo, danh mục) lấy từ
 * API eligibility; form chỉ giới hạn theo đó và API vẫn kiểm lại khi gửi.
 */
export function CreateReturnPage({ orderNo }: { orderNo: string }) {
  const {
    isAuthenticated,
    isLoaded,
    eligibility,
    data,
    lines,
    estimate,
    form,
    setForm,
    setQuantity,
    images,
    setImages,
    uploading,
    setUploading,
    submit,
    canSubmit,
  } = useCreateReturn(orderNo);

  return (
      <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-10 sm:px-6">
        <p className="eyebrow text-neutral-900">Đổi trả</p>
        <h1 className="mt-2 text-2xl font-black text-neutral-950 sm:text-3xl">Yêu cầu trả hàng · <span className="break-all font-mono">{orderNo}</span></h1>

        {(!isLoaded || eligibility.isLoading) && (
          <div className="mt-6 space-y-6" role="status" aria-label="Đang tải thông tin đơn hàng">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-56 w-full rounded-3xl" />
          </div>
        )}
        {isLoaded && !isAuthenticated && (
          <EmptyState
            as="section"
            className="mt-6 surface-card p-8 text-center shadow-sm"
            titleClassName="text-lg font-black"
            title="Đăng nhập để yêu cầu trả hàng"
            descriptionClassName="mt-2 text-sm text-neutral-600"
            description="Nếu đặt hàng không đăng nhập, vui lòng gọi hotline để nhân viên tạo yêu cầu giúp bạn."
            actions={<Link href="/login" className={buttonVariants({ variant: 'primary', className: 'mt-5 px-5 font-bold' })}>Đăng nhập</Link>}
          />
        )}
        {eligibility.isError && (
          <InlineAlert role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            {apiErrorMessage(eligibility.error, 'Không tải được thông tin đơn hàng.', { includeClientErrors: true })}
          </InlineAlert>
        )}

        {data && !data.eligible && (
          <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
            <PackageX aria-hidden className="mx-auto size-11 text-amber-600" />
            <p className="mt-3 font-bold text-amber-900">{data.reason ? returnEligibilityReasonLabels[data.reason] : 'Đơn không thể trả hàng.'}</p>
            {data.openReturnNo && (
              <Link href={`/returns/${encodeURIComponent(data.openReturnNo)}`} className="mt-4 inline-flex min-h-11 items-center font-bold text-neutral-900 hover:underline">
                Xem yêu cầu {data.openReturnNo}
              </Link>
            )}
          </section>
        )}

        {data?.eligible && (
          <form
            className="mt-6 space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              if (canSubmit) submit.mutate();
            }}
          >
            {data.returnDeadline && (
              <p className="text-sm text-neutral-600">{RETURN_FIELD_LABELS.deadline}: <strong>{formatDate(data.returnDeadline)}</strong></p>
            )}

            <section className="surface-card p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-black">Chọn sản phẩm muốn trả <span className="text-red-600">*</span></h2>
              <div className="mt-4 divide-y divide-neutral-100">
                {lines.map((line) => {
                  const quantity = form.quantities[line.orderItemId] ?? 0;
                  const disabled = line.returnableQuantity <= 0;
                  return (
                    <div key={line.orderItemId} className={`flex flex-wrap items-center justify-between gap-4 py-4 ${disabled ? 'opacity-50' : ''}`}>
                      <div className="min-w-0">
                        <strong>{line.productName}</strong>
                        <p className="text-xs text-neutral-500">{line.variantName} · {line.sku} · {RETURN_FIELD_LABELS.purchased} {line.purchasedQuantity}</p>
                        {line.isBundle && <p className="text-xs font-semibold text-amber-700">Combo chỉ trả được nguyên bộ</p>}
                        {line.blockedByCategory && <p className="text-xs font-semibold text-red-700">Sản phẩm không áp dụng đổi trả</p>}
                        {!line.blockedByCategory && line.returnableQuantity === 0 && <p className="text-xs text-neutral-500">Đã trả hết</p>}
                      </div>
                      {!disabled && (line.isBundle ? (
                        // UX: combo là một khối — tick để trả toàn bộ phần còn lại, không cho nhập số lẻ.
                        <Checkbox
                          checked={quantity > 0}
                          disabled={submit.isPending}
                          onChange={(event) => setQuantity(line.orderItemId, event.target.checked ? line.returnableQuantity : 0)}
                          wrapperClassName="items-center gap-2 py-0 font-bold"
                          label={`Trả ${line.returnableQuantity} bộ`}
                        />
                      ) : (
                        <label className="flex items-center gap-2 text-sm">
                          <span className="text-neutral-500">{RETURN_FIELD_LABELS.requested}</span>
                          <TextInput
                            size="md"
                            type="number"
                            min={0}
                            max={line.returnableQuantity}
                            value={quantity}
                            disabled={submit.isPending}
                            onChange={(event) => {
                              const next = Math.trunc(Number(event.target.value) || 0);
                              setQuantity(line.orderItemId, Math.min(Math.max(next, 0), line.returnableQuantity));
                            }}
                            className="w-20 rounded-lg px-2 text-right"
                            aria-label={`Số lượng trả ${line.productName}`}
                          />
                          <span className="text-xs text-neutral-500">/ {line.returnableQuantity}</span>
                        </label>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="surface-card p-4 shadow-sm sm:p-6">
              <Field
                htmlFor="return-reason"
                labelClassName="text-lg font-black"
                label={<>{RETURN_FIELD_LABELS.reason} <span className="text-red-600">*</span></>}
              >
              <Select
                id="return-reason"
                size="md"
                wrapperClassName="mt-3"
                value={form.reasonCode}
                disabled={submit.isPending}
                onChange={(event) => setForm((current) => ({ ...current, reasonCode: event.target.value as CreateReturnFormState['reasonCode'] }))}
              >
                <option value="" disabled>Chọn lý do</option>
                {reasonOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </Select>
              </Field>

              <Field label={RETURN_FIELD_LABELS.description} labelClassName="mt-5 block font-black">
              <Textarea
                styled
                id="return-description"
                value={form.description}
                maxLength={2000}
                rows={3}
                disabled={submit.isPending}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Mô tả tình trạng sản phẩm (không bắt buộc)"
                className="mt-2 min-h-0"
              />
              </Field>

              <p className="mt-5 font-black">{RETURN_FIELD_LABELS.evidence}</p>
              <p className="mb-3 text-xs text-neutral-500">Không bắt buộc. Ảnh giúp cửa hàng duyệt nhanh hơn, nhất là khi hàng lỗi.</p>
              <EvidencePicker orderNo={orderNo} value={images} onChange={setImages} onUploadingChange={setUploading} disabled={submit.isPending} />
            </section>

            <section aria-live="polite" className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-6">
              <p className="text-sm text-neutral-600">{RETURN_FIELD_LABELS.estimatedRefund}</p>
              <p className="text-2xl font-black text-neutral-950">{formatVnd(estimate)}</p>
              <p className="mt-1 text-xs text-neutral-600">{RETURN_ESTIMATE_NOTE} Chưa gồm phí giao hàng.</p>
            </section>

            {submit.isError && (
              <InlineAlert as="p" role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
                {apiErrorMessage(submit.error, 'Không gửi được yêu cầu. Vui lòng thử lại.', { includeClientErrors: true })}
              </InlineAlert>
            )}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-between">
              <Link href={`/orders/${encodeURIComponent(orderNo)}`} className={buttonVariants({ variant: 'outline', className: 'border-neutral-200 font-bold text-neutral-700' })}>Quay lại đơn</Link>
              <Button type="submit" variant="primary" disabled={!canSubmit} className="px-5 font-bold">
                {submit.isPending ? 'Đang gửi...' : uploading ? 'Đang tải ảnh...' : 'Gửi yêu cầu'}
              </Button>
            </div>
          </form>
        )}
      </main>
  );
}
