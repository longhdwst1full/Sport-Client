'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';
import { InlineAlert } from '@/foundation/components/feedback';
import { OrderListSkeleton } from '../components/order-skeletons';
import { useAccountOrders } from '../hooks/use-account-orders';
import { GUEST_LOOKUP_ROUTE } from '../model/guest-order-lookup.constants';

export function AccountOrdersPage() {
  const {
    page,
    setPage,
    isLoaded,
    isAuthenticated,
    isLoading,
    isError,
    errorMessage,
    isFetching,
    items,
    total,
    totalPages,
    hasData,
    limit,
  } = useAccountOrders();

  return (
      <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700">Tài khoản</p>
            <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Đơn hàng của tôi</h1>
            <p className="mt-2 text-sm text-slate-600">Theo dõi trạng thái thanh toán, xử lý và giao hàng từ dữ liệu thực.</p>
          </div>
          <Link href="/products" className="inline-flex min-h-11 items-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700">Tiếp tục mua sắm</Link>
        </div>

        {!isLoaded && <OrderListSkeleton />}
        {isLoaded && !isAuthenticated && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
            <PackageSearch aria-hidden className="mx-auto size-12 text-slate-400" />
            <h2 className="mt-4 text-xl font-black">Đăng nhập để xem toàn bộ đơn hàng</h2>
            <p className="mt-2 text-sm text-slate-600">Khách mua không đăng nhập có thể mở đơn trực tiếp từ trang đặt hàng thành công.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/login" className="inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-700">Đăng nhập</Link>
              <Link href={GUEST_LOOKUP_ROUTE} className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Tra cứu đơn bằng email</Link>
            </div>
          </section>
        )}
        {isAuthenticated && isLoading && <OrderListSkeleton />}
        {isAuthenticated && isError && (
          <InlineAlert role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">{errorMessage}</InlineAlert>
        )}
        {isAuthenticated && items.length === 0 && hasData && (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-10">
            <PackageSearch aria-hidden className="mx-auto size-12 text-slate-400" />
            <h2 className="mt-4 text-lg font-black">Chưa có đơn hàng</h2>
          </section>
        )}
        {isAuthenticated && <div aria-busy={isFetching} className={`grid gap-4 transition-opacity ${isFetching && !isLoading ? 'opacity-60' : ''}`}>
          {items.map((order) => (
            <Link key={order.id} href={`/orders/${order.orderNo}`} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-sm font-black text-brand-700">{order.orderNo}</div>
                  <div className="mt-1 text-xs text-slate-500">{order.placedAtLabel} · {order.branchName}</div>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${order.statusToneClass}`}>{order.statusLabel}</div>
              </div>
              <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3">
                <div><span className="block text-xs text-slate-500">Người nhận</span><strong>{order.recipientName}</strong></div>
                <div><span className="block text-xs text-slate-500">Thanh toán</span><strong>{order.paymentStatusLabel}</strong></div>
                <div className="sm:text-right"><span className="block text-xs text-slate-500">Tổng tiền</span><strong className="text-brand-700">{order.grandTotalLabel}</strong></div>
              </div>
            </Link>
          ))}
        </div>}
        {isAuthenticated && hasData && total > limit && (
          <nav className="mt-7 flex items-center justify-center gap-3" aria-label="Phân trang đơn hàng">
            <button type="button" disabled={page === 1 || isFetching} onClick={() => setPage((value) => Math.max(1, value - 1))} className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-40" aria-label="Trang trước"><ChevronLeft aria-hidden className="size-4" /></button>
            <span className="text-sm font-bold text-slate-700">Trang {page} / {totalPages}</span>
            <button type="button" disabled={page >= totalPages || isFetching} onClick={() => setPage((value) => value + 1)} className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-40" aria-label="Trang sau"><ChevronRight aria-hidden className="size-4" /></button>
          </nav>
        )}
      </main>
  );
}
