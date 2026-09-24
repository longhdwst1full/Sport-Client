'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, PackageX } from 'lucide-react';
import { useCustomerAuth } from '@/features/auth';
import {
  createAccountReturn,
  getGetAccountReturnEligibilityQueryKey,
  getListAccountReturnsQueryKey,
  useGetAccountReturnEligibility,
} from '@/generated/api/returns/returns';
import type { ReturnDetailDto } from '@/generated/api/returns/models';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { vndMoney } from '@/shared/format/money';
import { formatDate } from '@/shared/format/date-time';
import { EvidencePicker } from '../components/evidence-picker';
import {
  estimateSelection,
  toCreateReturnPayload,
  type CreateReturnFormState,
  type UploadedEvidence,
} from '../model/return.mapper';
import {
  RETURN_ESTIMATE_NOTE,
  RETURN_FIELD_LABELS,
  returnEligibilityReasonLabels,
  returnReasonLabels,
} from '../model/return.constants';
import { returnErrorMessage } from '../model/return-error';

const reasonOptions = Object.entries(returnReasonLabels) as [CreateReturnFormState['reasonCode'], string][];

/**
 * Khách tạo yêu cầu trả hàng cho một đơn đã giao. Luật (hạn trả, số lượng, combo, danh mục) lấy từ
 * API eligibility; form chỉ giới hạn theo đó và API vẫn kiểm lại khi gửi.
 */
export function CreateReturnPage({ orderNo }: { orderNo: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const [form, setForm] = useState<CreateReturnFormState>({ reasonCode: '', description: '', quantities: {} });
  const [images, setImages] = useState<UploadedEvidence[]>([]);
  const [uploading, setUploading] = useState(false);
  const idempotencyRef = useRef<{ signature: string; key: string } | undefined>(undefined);
  const eligibility = useGetAccountReturnEligibility(orderNo, { query: { enabled: isLoaded && isAuthenticated, retry: false } });
  const data = eligibility.data;
  const lines = data?.items ?? [];
  const estimate = estimateSelection(lines, form.quantities);
  const selectedCount = lines.filter((line) => (form.quantities[line.orderItemId] ?? 0) > 0 && line.returnableQuantity > 0).length;

  const submit = useMutation<ReturnDetailDto>({
    retry: false,
    mutationFn: () => {
      const payload = toCreateReturnPayload(orderNo, lines, form, images);
      // Bấm lại (hoặc thử lại sau lỗi mạng) cùng nội dung thì giữ key để API trả đúng phiếu cũ.
      const signature = JSON.stringify(payload);
      if (idempotencyRef.current?.signature !== signature) {
        idempotencyRef.current = { signature, key: crypto.randomUUID() };
      }
      return createAccountReturn(payload, { headers: { 'idempotency-key': idempotencyRef.current.key } });
    },
    onSuccess: async (created) => {
      idempotencyRef.current = undefined;
      // CACHE: phiếu mới đổi danh sách phiếu và điều kiện trả của chính đơn này.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getListAccountReturnsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetAccountReturnEligibilityQueryKey(orderNo) }),
      ]);
      router.push(`/returns/${encodeURIComponent(created.returnNo)}`);
    },
  });

  const setQuantity = (orderItemId: string, quantity: number) =>
    setForm((current) => ({ ...current, quantities: { ...current.quantities, [orderItemId]: quantity } }));

  const canSubmit = Boolean(form.reasonCode) && selectedCount > 0 && !uploading && !submit.isPending;

  return (
    <StorefrontLayout>
      <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Đổi trả</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Yêu cầu trả hàng · <span className="font-mono">{orderNo}</span></h1>

        {(!isLoaded || eligibility.isLoading) && (
          <div className="grid min-h-56 place-items-center"><LoaderCircle className="size-8 animate-spin text-emerald-600" /></div>
        )}
        {isLoaded && !isAuthenticated && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-black">Đăng nhập để yêu cầu trả hàng</h2>
            <p className="mt-2 text-sm text-slate-600">Nếu đặt hàng không đăng nhập, vui lòng gọi hotline để nhân viên tạo yêu cầu giúp bạn.</p>
            <Link href="/login" className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Đăng nhập</Link>
          </section>
        )}
        {eligibility.isError && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
            {returnErrorMessage(eligibility.error, 'Không tải được thông tin đơn hàng.')}
          </div>
        )}

        {data && !data.eligible && (
          <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
            <PackageX className="mx-auto size-11 text-amber-600" />
            <p className="mt-3 font-bold text-amber-900">{data.reason ? returnEligibilityReasonLabels[data.reason] : 'Đơn không thể trả hàng.'}</p>
            {data.openReturnNo && (
              <Link href={`/returns/${encodeURIComponent(data.openReturnNo)}`} className="mt-4 inline-flex font-bold text-emerald-700">
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
              <p className="text-sm text-slate-600">{RETURN_FIELD_LABELS.deadline}: <strong>{formatDate(data.returnDeadline)}</strong></p>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black">Chọn sản phẩm muốn trả <span className="text-rose-600">*</span></h2>
              <div className="mt-4 divide-y divide-slate-100">
                {lines.map((line) => {
                  const quantity = form.quantities[line.orderItemId] ?? 0;
                  const disabled = line.returnableQuantity <= 0;
                  return (
                    <div key={line.orderItemId} className={`flex flex-wrap items-center justify-between gap-4 py-4 ${disabled ? 'opacity-50' : ''}`}>
                      <div>
                        <strong>{line.productName}</strong>
                        <p className="text-xs text-slate-500">{line.variantName} · {line.sku} · {RETURN_FIELD_LABELS.purchased} {line.purchasedQuantity}</p>
                        {line.isBundle && <p className="text-xs font-semibold text-amber-700">Combo chỉ trả được nguyên bộ</p>}
                        {line.blockedByCategory && <p className="text-xs font-semibold text-rose-700">Sản phẩm không áp dụng đổi trả</p>}
                        {!line.blockedByCategory && line.returnableQuantity === 0 && <p className="text-xs text-slate-500">Đã trả hết</p>}
                      </div>
                      {!disabled && (line.isBundle ? (
                        // UX: combo là một khối — tick để trả toàn bộ phần còn lại, không cho nhập số lẻ.
                        <label className="flex items-center gap-2 text-sm font-bold">
                          <input
                            type="checkbox"
                            checked={quantity > 0}
                            disabled={submit.isPending}
                            onChange={(event) => setQuantity(line.orderItemId, event.target.checked ? line.returnableQuantity : 0)}
                            className="size-4 accent-emerald-600"
                          />
                          Trả {line.returnableQuantity} bộ
                        </label>
                      ) : (
                        <label className="flex items-center gap-2 text-sm">
                          <span className="text-slate-500">{RETURN_FIELD_LABELS.requested}</span>
                          <input
                            type="number"
                            min={0}
                            max={line.returnableQuantity}
                            value={quantity}
                            disabled={submit.isPending}
                            onChange={(event) => {
                              const next = Math.trunc(Number(event.target.value) || 0);
                              setQuantity(line.orderItemId, Math.min(Math.max(next, 0), line.returnableQuantity));
                            }}
                            className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-right"
                            aria-label={`Số lượng trả ${line.productName}`}
                          />
                          <span className="text-xs text-slate-500">/ {line.returnableQuantity}</span>
                        </label>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <label htmlFor="return-reason" className="text-lg font-black">{RETURN_FIELD_LABELS.reason} <span className="text-rose-600">*</span></label>
              <select
                id="return-reason"
                value={form.reasonCode}
                disabled={submit.isPending}
                onChange={(event) => setForm((current) => ({ ...current, reasonCode: event.target.value as CreateReturnFormState['reasonCode'] }))}
                className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
              >
                <option value="" disabled>Chọn lý do</option>
                {reasonOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>

              <label htmlFor="return-description" className="mt-5 block font-black">{RETURN_FIELD_LABELS.description}</label>
              <textarea
                id="return-description"
                value={form.description}
                maxLength={2000}
                rows={3}
                disabled={submit.isPending}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Mô tả tình trạng sản phẩm (không bắt buộc)"
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
              />

              <p className="mt-5 font-black">{RETURN_FIELD_LABELS.evidence}</p>
              <p className="mb-3 text-xs text-slate-500">Không bắt buộc. Ảnh giúp cửa hàng duyệt nhanh hơn, nhất là khi hàng lỗi.</p>
              <EvidencePicker orderNo={orderNo} value={images} onChange={setImages} onUploadingChange={setUploading} disabled={submit.isPending} />
            </section>

            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-sm text-emerald-900">{RETURN_FIELD_LABELS.estimatedRefund}</p>
              <p className="text-2xl font-black text-emerald-800">{vndMoney.format(estimate)}</p>
              <p className="mt-1 text-xs text-emerald-900">{RETURN_ESTIMATE_NOTE} Chưa gồm phí giao hàng.</p>
            </section>

            {submit.isError && (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
                {returnErrorMessage(submit.error, 'Không gửi được yêu cầu. Vui lòng thử lại.')}
              </p>
            )}
            <div className="flex flex-wrap justify-between gap-3">
              <Link href={`/orders/${encodeURIComponent(orderNo)}`} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold">Quay lại đơn</Link>
              <button type="submit" disabled={!canSubmit} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {submit.isPending ? 'Đang gửi...' : uploading ? 'Đang tải ảnh...' : 'Gửi yêu cầu'}
              </button>
            </div>
          </form>
        )}
      </main>
    </StorefrontLayout>
  );
}
