'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, PackageCheck, XCircle } from 'lucide-react';
import { useCustomerAuth } from '@/features/auth/use-customer-auth';
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
import { vndMoney } from '@/shared/format/money';
import { orderStatusLabels, paymentStatusLabels } from '../order.constants';
import { readGuestOrderAccessToken, retireGuestOrderAccessToken } from '../guest-order-access.store';
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
    if (!isAuthenticated && order && ['COMPLETED', 'CANCELLED'].includes(order.status)) {
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

  const canCancel = order?.status === 'PENDING_CONFIRMATION'
    && ['PENDING', 'FAILED'].includes(order.paymentStatus)
    && order.fulfillmentStatus === 'PENDING';

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
                <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Đơn hàng</p><h1 className="mt-2 font-mono text-2xl font-black">{order.orderNo}</h1><p className="mt-2 text-sm text-slate-300">{new Date(order.placedAt).toLocaleString('vi-VN')} · {order.branchName}</p></div>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">{orderStatusLabels[order.status] ?? order.status}</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3"><div><span className="text-xs text-slate-400">Người nhận</span><strong className="block">{order.recipient.name}</strong></div><div><span className="text-xs text-slate-400">Thanh toán</span><strong className="block">{paymentStatusLabels[order.paymentStatus] ?? order.paymentStatus}</strong></div><div><span className="text-xs text-slate-400">Tổng tiền</span><strong className="block text-emerald-300">{vndMoney.format(Number(order.grandTotal))}</strong></div></div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black">Sản phẩm</h2>
                <div className="mt-4 divide-y divide-slate-100">{order.items.map((item) => <div key={item.id} className="flex justify-between gap-4 py-4"><div><strong>{item.productName}</strong><p className="text-xs text-slate-500">{item.variantName} · {item.sku} · SL {item.quantity}</p></div><strong>{vndMoney.format(Number(item.lineTotal))}</strong></div>)}</div>
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
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-black">Giao đến</h2><p className="mt-3 text-sm font-bold">{order.recipient.name} · {order.recipient.phone}</p><p className="mt-2 text-sm leading-6 text-slate-600">{[order.recipient.addressLine, order.recipient.ward, order.recipient.district, order.recipient.province].filter(Boolean).join(', ')}</p></section>
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-black">Tiến trình</h2><div className="mt-4 space-y-4">{order.statusHistory.map((history) => <div key={history.sequenceNo} className="flex gap-3"><PackageCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" /><div><strong className="text-sm">{orderStatusLabels[history.toStatus] ?? history.toStatus}</strong><p className="text-xs text-slate-500">{new Date(history.createdAt).toLocaleString('vi-VN')}</p>{history.reason && <p className="mt-1 text-xs text-slate-600">{history.reason}</p>}</div></div>)}</div></section>
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
