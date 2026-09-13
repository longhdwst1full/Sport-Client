'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, LoaderCircle, PackageSearch } from 'lucide-react';
import { useState } from 'react';
import { useCustomerAuth } from '@/features/auth';
import { useListAccountOrders } from '@/generated/api/orders/orders';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { ApiError } from '@/lib/api/fetcher';
import { vndMoney } from '@/shared/format/money';
import { orderStatusLabels, paymentStatusLabels } from '../model/order.constants';

function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.payload && typeof error.payload === 'object' && 'message' in error.payload) {
    const value = (error.payload as { message?: unknown }).message;
    if (typeof value === 'string') return value;
  }
  return 'Không tải được danh sách đơn hàng. Vui lòng thử lại.';
}

export function AccountOrdersPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const orders = useListAccountOrders(
    { page, limit },
    { query: { enabled: isLoaded && isAuthenticated, retry: false } },
  );

  return (
    <StorefrontLayout>
      <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Tài khoản</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Đơn hàng của tôi</h1>
            <p className="mt-2 text-sm text-slate-600">Theo dõi trạng thái thanh toán, xử lý và giao hàng từ dữ liệu thực.</p>
          </div>
          <Link href="/products" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white">Tiếp tục mua sắm</Link>
        </div>

        {!isLoaded && <div className="grid min-h-56 place-items-center"><LoaderCircle className="size-8 animate-spin text-emerald-600" /></div>}
        {isLoaded && !isAuthenticated && (
          <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <PackageSearch className="mx-auto size-12 text-slate-400" />
            <h2 className="mt-4 text-xl font-black">Đăng nhập để xem toàn bộ đơn hàng</h2>
            <p className="mt-2 text-sm text-slate-600">Khách mua không đăng nhập có thể mở đơn trực tiếp từ trang đặt hàng thành công.</p>
            <Link href="/login" className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Đăng nhập</Link>
          </section>
        )}
        {isAuthenticated && orders.isLoading && <div className="grid min-h-56 place-items-center"><LoaderCircle className="size-8 animate-spin text-emerald-600" /></div>}
        {isAuthenticated && orders.isError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">{errorMessage(orders.error)}</div>
        )}
        {isAuthenticated && orders.data?.items.length === 0 && (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <PackageSearch className="mx-auto size-12 text-slate-400" />
            <h2 className="mt-4 text-lg font-black">Chưa có đơn hàng</h2>
          </section>
        )}
        {isAuthenticated && <div className="grid gap-4">
          {orders.data?.items.map((order) => (
            <Link key={order.id} href={`/orders/${order.orderNo}`} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-sm font-black text-emerald-700">{order.orderNo}</div>
                  <div className="mt-1 text-xs text-slate-500">{new Date(order.placedAt).toLocaleString('vi-VN')} · {order.branchName}</div>
                </div>
                <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">{orderStatusLabels[order.status] ?? order.status}</div>
              </div>
              <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3">
                <div><span className="block text-xs text-slate-500">Người nhận</span><strong>{order.recipient.name}</strong></div>
                <div><span className="block text-xs text-slate-500">Thanh toán</span><strong>{paymentStatusLabels[order.paymentStatus] ?? order.paymentStatus}</strong></div>
                <div className="sm:text-right"><span className="block text-xs text-slate-500">Tổng tiền</span><strong className="text-emerald-700">{vndMoney.format(Number(order.grandTotal))}</strong></div>
              </div>
            </Link>
          ))}
        </div>}
        {isAuthenticated && orders.data && orders.data.total > limit && (
          <nav className="mt-7 flex items-center justify-center gap-3" aria-label="Phân trang đơn hàng">
            <button type="button" disabled={page === 1 || orders.isFetching} onClick={() => setPage((value) => Math.max(1, value - 1))} className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white disabled:opacity-40" aria-label="Trang trước"><ChevronLeft className="size-4" /></button>
            <span className="text-sm font-bold text-slate-700">Trang {page} / {Math.ceil(orders.data.total / limit)}</span>
            <button type="button" disabled={page >= Math.ceil(orders.data.total / limit) || orders.isFetching} onClick={() => setPage((value) => value + 1)} className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white disabled:opacity-40" aria-label="Trang sau"><ChevronRight className="size-4" /></button>
          </nav>
        )}
      </main>
    </StorefrontLayout>
  );
}
