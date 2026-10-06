'use client';

import Link from 'next/link';
import { PackageSearch } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { EmptyState, InlineAlert } from '@/foundation/components/feedback';
import { PaginationControls } from '@/shared/components/pagination-controls';
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
          <Link href="/products" className={buttonVariants({ variant: 'primary', className: 'font-bold' })}>Tiếp tục mua sắm</Link>
        </div>

        {!isLoaded && <OrderListSkeleton />}
        {isLoaded && !isAuthenticated && (
          <EmptyState
            as="section"
            className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10"
            iconWrapClassName="flex justify-center"
            icon={<PackageSearch aria-hidden className="size-12 text-slate-400" />}
            titleClassName="mt-4 text-xl font-black"
            title="Đăng nhập để xem toàn bộ đơn hàng"
            descriptionClassName="mt-2 text-sm text-slate-600"
            description="Khách mua không đăng nhập có thể mở đơn trực tiếp từ trang đặt hàng thành công."
            actions={
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/login" className={buttonVariants({ variant: 'primary', className: 'px-5 font-bold' })}>Đăng nhập</Link>
                <Link href={GUEST_LOOKUP_ROUTE} className={buttonVariants({ variant: 'outline', className: 'border-slate-200 px-5 font-bold text-slate-700' })}>Tra cứu đơn bằng email</Link>
              </div>
            }
          />
        )}
        {isAuthenticated && isLoading && <OrderListSkeleton />}
        {isAuthenticated && isError && (
          <InlineAlert role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">{errorMessage}</InlineAlert>
        )}
        {isAuthenticated && items.length === 0 && hasData && (
          <EmptyState
            as="section"
            className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-10"
            iconWrapClassName="flex justify-center"
            icon={<PackageSearch aria-hidden className="size-12 text-slate-400" />}
            titleClassName="mt-4 text-lg font-black"
            title="Chưa có đơn hàng"
          />
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
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isFetching}
            ariaLabel="Phân trang đơn hàng"
          />
        )}
      </main>
  );
}
