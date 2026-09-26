'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, LoaderCircle, PackageCheck, Truck, X, XCircle } from 'lucide-react';
import { useCustomerAuth } from '@/features/auth';
import {
  cancelAccountOrder,
  cancelGuestOrder,
  getAccountOrder,
  getGetAccountOrderQueryKey,
  getGetGuestOrderQueryKey,
  getListAccountOrdersQueryKey,
  getGuestOrder,
} from '@/generated/api/orders/orders';
import type { OrderDetailDto } from '@/generated/api/orders/models';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ApiError } from '@/lib/api/fetcher';
import { toOrderDetailView } from '../model/order.mapper';
import {
  CANCELLABLE_PAYMENT_STATUSES,
  FULFILLMENT_STATUS,
  GUEST_ACCESS_RETIRED_ORDER_STATUSES,
  statusIn,
} from '../model/order.constants';
import { readGuestOrderAccessToken, retireGuestOrderAccessToken } from '../model/guest-order-access.store';
import { OrderReturnCta } from '@/features/returns';
import { OrderPaymentPanel } from '../components/order-payment-panel';

function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.payload && typeof error.payload === 'object' && 'message' in error.payload) {
    const value = (error.payload as { message?: unknown }).message;
    if (typeof value === 'string') return value;
  }
  return 'Không tải được đơn hàng. Vui lòng kiểm tra tài khoản hoặc đường dẫn truy cập.';
}

export function OrderDetailPage({ orderNo }: { orderNo: string }) {
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const idempotencyRef = useRef<{ signature: string; key: string } | undefined>(undefined);
  const guestToken = useMemo(
    () => isLoaded && !isAuthenticated ? readGuestOrderAccessToken(orderNo) : null,
    [isAuthenticated, isLoaded, orderNo],
  );
  const orderQuery = useQuery({
    queryKey: isAuthenticated ? getGetAccountOrderQueryKey(orderNo) : getGetGuestOrderQueryKey(orderNo),
    enabled: isLoaded && (isAuthenticated || Boolean(guestToken)),
    retry: false,
    queryFn: ({ signal }) => isAuthenticated
      ? getAccountOrder(orderNo, undefined, signal)
      : getGuestOrder(orderNo, { headers: { 'x-cart-token': guestToken } }, signal),
  });
  const order = orderQuery.data;
  useEffect(() => {
    if (!isAuthenticated && order && statusIn(GUEST_ACCESS_RETIRED_ORDER_STATUSES, order.status)) {
      retireGuestOrderAccessToken(order.orderNo);
    }
  }, [isAuthenticated, order]);
  const cancel = useMutation({
    mutationFn: async (): Promise<OrderDetailDto> => {
      if (!order) throw new Error('Chưa tải được đơn hàng');
      const normalizedReason = reason.trim();
      const signature = `${order.id}:${order.version}:${normalizedReason}`;
      if (idempotencyRef.current?.signature !== signature) {
        idempotencyRef.current = { signature, key: crypto.randomUUID() };
      }
      const headers = { 'idempotency-key': idempotencyRef.current.key };
      return isAuthenticated
        ? cancelAccountOrder(orderNo, { expectedVersion: order.version, reason: normalizedReason }, { headers })
        : cancelGuestOrder(orderNo, { expectedVersion: order.version, reason: normalizedReason }, { headers: { ...headers, 'x-cart-token': guestToken } });
    },
    retry: false,
    onSuccess: async (updated) => {
      const key = isAuthenticated ? getGetAccountOrderQueryKey(orderNo) : getGetGuestOrderQueryKey(orderNo);
      queryClient.setQueryData(key, updated);
      if (isAuthenticated) {
        // CACHE: Hủy đơn có thể thay đổi dữ liệu mọi trang list Account.
        await queryClient.invalidateQueries({ queryKey: getListAccountOrdersQueryKey() });
      }
      idempotencyRef.current = undefined;
      cancel.reset();
      setShowCancel(false);
      setReason('');
    },
  });

  // Hiển thị dùng view model; DTO giữ lại cho lệnh huỷ vì cần id và version thô.
  const view = useMemo(() => (order ? toOrderDetailView(order) : undefined), [order]);

  const canCancel = order?.status === 'PENDING_CONFIRMATION'
    && statusIn(CANCELLABLE_PAYMENT_STATUSES, order.paymentStatus)
    && order.fulfillmentStatus === FULFILLMENT_STATUS.PENDING;

  const closeCancel = () => {
    if (cancel.isPending) return;
    cancel.reset();
    idempotencyRef.current = undefined;
    setReason('');
    setShowCancel(false);
  };

  return (
    <StorefrontLayout>
      <main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-10 sm:px-6">
        {!isLoaded || orderQuery.isLoading ? (
          <div className="grid min-h-72 place-items-center"><LoaderCircle className="size-9 animate-spin text-emerald-600" /></div>
        ) : !isAuthenticated && !guestToken ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
            <XCircle className="mx-auto size-11 text-amber-600" />
            <h1 className="mt-4 text-xl font-black">Không tìm thấy token truy cập đơn</h1>
            <p className="mt-2 text-sm text-amber-900">Hãy mở đơn trên trình duyệt đã dùng để đặt hàng hoặc đăng nhập tài khoản.</p>
          </section>
        ) : orderQuery.isError ? (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-800">{errorMessage(orderQuery.error)}</section>
        ) : order ? (
          <>
            <div className="rounded-[30px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-7 text-white shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Đơn hàng</p><h1 className="mt-2 font-mono text-2xl font-black">{order.orderNo}</h1><p className="mt-2 text-sm text-slate-300">{view?.placedLabel} · {view?.branchName}</p></div>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">{view?.statusLabel}</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3"><div><span className="text-xs text-slate-400">Người nhận</span><strong className="block">{view?.recipientName}</strong></div><div><span className="text-xs text-slate-400">Thanh toán</span><strong className="block">{view?.paymentStatusLabel}</strong></div><div><span className="text-xs text-slate-400">Tổng tiền</span><strong className="block text-emerald-300">{view?.grandTotalLabel}</strong></div></div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black">Sản phẩm</h2>
                <div className="mt-4 divide-y divide-slate-100">{(view?.items ?? []).map((item) => <div key={item.id} className="flex justify-between gap-4 py-4"><div><strong>{item.productName}</strong><p className="text-xs text-slate-500">{item.variantName} · {item.sku} · SL {item.quantity}</p></div><strong>{item.lineTotalLabel}</strong></div>)}</div>
              </section>
              <aside className="space-y-5">
                <OrderPaymentPanel
                  orderNo={orderNo}
                  authenticated={isAuthenticated}
                  guestToken={guestToken}
                  onPaymentChanged={async () => {
                    await queryClient.invalidateQueries({ queryKey: isAuthenticated ? getGetAccountOrderQueryKey(orderNo) : getGetGuestOrderQueryKey(orderNo) });
                    if (isAuthenticated) {
                      await queryClient.invalidateQueries({ queryKey: getListAccountOrdersQueryKey() });
                    }
                  }}
                />
                <OrderReturnCta orderNo={orderNo} authenticated={isAuthenticated} />
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-black">Giao đến</h2><p className="mt-3 text-sm font-bold">{view?.recipientName} · {view?.recipientPhone}</p><p className="mt-2 text-sm leading-6 text-slate-600">{view?.recipientAddress}</p></section>
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="font-black">Tiến trình</h2>
                  {/* Mốc chính cho khách; lịch sử chi tiết từng lần đổi trạng thái nằm trong phần mở rộng. */}
                  <ol className="mt-4 space-y-0">
                    {(view?.milestones ?? []).map((milestone, index, list) => (
                      <li key={milestone.key} className="relative flex gap-3 pb-5 last:pb-0">
                        {index < list.length - 1 && <span aria-hidden className={`absolute left-[11px] top-6 h-[calc(100%-1rem)] w-0.5 ${milestone.state === 'done' ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                        <span className={`relative grid size-6 shrink-0 place-items-center rounded-full ${milestone.state === 'done' ? 'bg-emerald-600 text-white' : milestone.state === 'current' ? 'border-2 border-emerald-600 bg-white text-emerald-600' : milestone.state === 'failed' ? 'bg-rose-600 text-white' : 'border-2 border-slate-200 bg-white text-slate-300'}`}>
                          {milestone.state === 'done' ? <Check className="size-3.5" /> : milestone.state === 'failed' ? <X className="size-3.5" /> : <span className={`size-2 rounded-full ${milestone.state === 'current' ? 'bg-emerald-600' : 'bg-slate-200'}`} />}
                        </span>
                        <div className="min-w-0">
                          <strong className={`text-sm ${milestone.state === 'todo' ? 'text-slate-400' : milestone.state === 'failed' ? 'text-rose-700' : 'text-slate-900'}`}>{milestone.label}</strong>
                          {milestone.occurredLabel && <p className="text-xs text-slate-500">{milestone.occurredLabel}</p>}
                        </div>
                      </li>
                    ))}
                  </ol>
                  {view?.shipment && (
                    <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{view.shipment.carrierLabel}</p>
                      {view.shipment.trackingNo && <p className="mt-1 font-mono font-bold text-slate-900">{view.shipment.trackingNo}</p>}
                      {view.shipment.trackingUrl && (
                        <a href={view.shipment.trackingUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white">
                          <Truck className="size-3.5" /> Theo dõi vận đơn
                        </a>
                      )}
                    </div>
                  )}
                  {(view?.timeline ?? []).length > 0 && (
                    <details className="mt-5 text-sm">
                      <summary className="cursor-pointer text-xs font-bold text-emerald-700">Lịch sử chi tiết</summary>
                      <div className="mt-3 space-y-3">
                        {(view?.timeline ?? []).map((entry) => (
                          <div key={entry.key} className="flex gap-3">
                            <PackageCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                            <div><strong className="text-xs">{entry.statusLabel}</strong><p className="text-xs text-slate-500">{entry.occurredLabel}</p>{entry.note && <p className="mt-1 text-xs text-slate-600">{entry.note}</p>}</div>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </section>
              </aside>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3"><Link href="/orders" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold">Danh sách đơn</Link>{canCancel && <button type="button" onClick={() => setShowCancel(true)} className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700">Hủy đơn</button>}</div>
            {showCancel && <section className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-6"><h2 className="font-black text-rose-950">Lý do hủy <span className="text-rose-600">*</span></h2><p className="mt-1 text-sm text-rose-800">Sau khi hủy, hệ thống giải phóng toàn bộ hàng đang giữ cho đơn này.</p><label htmlFor="customer-cancel-reason" className="sr-only">Lý do hủy đơn</label><textarea id="customer-cancel-reason" value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} rows={3} className="mt-4 w-full rounded-xl border border-rose-200 bg-white p-3 text-sm" />{cancel.isError && <p className="mt-2 text-sm font-semibold text-rose-700">{errorMessage(cancel.error)}</p>}<div className="mt-4 flex gap-3"><button type="button" disabled={cancel.isPending || reason.trim().length < 3} onClick={() => cancel.mutate()} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{cancel.isPending ? 'Đang hủy...' : 'Xác nhận hủy'}</button><button type="button" disabled={cancel.isPending} onClick={closeCancel} className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold">Đóng</button></div></section>}
          </>
        ) : null}
      </main>
    </StorefrontLayout>
  );
}
