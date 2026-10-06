'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { InlineAlert } from '@/foundation/components/feedback';
import { ReturnListSkeleton } from '../components/return-skeletons';
import { formatDateTime } from '@/shared/format/date-time';
import {
  RETURN_FIELD_LABELS,
  returnReasonLabels,
  returnStatusLabels,
  returnStatusTone,
} from '../model/return.constants';
import { useAccountReturns } from '../hooks/use-account-returns';

export function AccountReturnsPage() {
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
    hasData,
    totalPages,
  } = useAccountReturns();

  return (
      <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700">Tài khoản</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Yêu cầu đổi trả</h1>
          <p className="mt-2 text-sm text-slate-600">Tạo yêu cầu từ trang chi tiết của đơn đã giao; theo dõi tiến độ tại đây.</p>
        </div>

        {(!isLoaded || (isAuthenticated && isLoading)) && (
          <ReturnListSkeleton />
        )}
        {isLoaded && !isAuthenticated && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
            <h2 className="text-xl font-black">Đăng nhập để xem yêu cầu đổi trả</h2>
            <Link href="/login" className="mt-5 inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-700">Đăng nhập</Link>
          </section>
        )}
        {isAuthenticated && isError && (
          <InlineAlert role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
            {errorMessage}
          </InlineAlert>
        )}
        {isAuthenticated && hasData && items.length === 0 && (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-10">
            <RotateCcw aria-hidden className="mx-auto size-12 text-slate-400" />
            <h2 className="mt-4 text-lg font-black">Chưa có yêu cầu đổi trả</h2>
            <Link href="/orders" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-brand-700 hover:underline">Xem đơn hàng</Link>
          </section>
        )}
        {isAuthenticated && (
          <div aria-busy={isFetching} className={`grid gap-4 transition-opacity ${isFetching && !isLoading ? 'opacity-60' : ''}`}>
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/returns/${encodeURIComponent(item.returnNo)}`}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-sm font-black text-brand-700">{item.returnNo}</div>
                    <div className="mt-1 text-xs text-slate-500">{RETURN_FIELD_LABELS.orderNo} {item.orderNo} · {formatDateTime(item.createdAt)}</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${returnStatusTone[item.status]}`}>{returnStatusLabels[item.status]}</span>
                </div>
                <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2">
                  <div><span className="block text-xs text-slate-500">{RETURN_FIELD_LABELS.reason}</span><strong>{returnReasonLabels[item.reasonCode]}</strong></div>
                  <div><span className="block text-xs text-slate-500">{RETURN_FIELD_LABELS.itemCount}</span><strong>{item.itemCount}</strong></div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {isAuthenticated && hasData && totalPages > 1 && (
          <nav className="mt-7 flex items-center justify-center gap-3" aria-label="Phân trang yêu cầu đổi trả">
            <button type="button" disabled={page === 1 || isFetching} onClick={() => setPage((value) => Math.max(1, value - 1))} className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-40" aria-label="Trang trước"><ChevronLeft aria-hidden className="size-4" /></button>
            <span className="text-sm font-bold text-slate-700">Trang {page} / {totalPages}</span>
            <button type="button" disabled={page >= totalPages || isFetching} onClick={() => setPage((value) => value + 1)} className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-40" aria-label="Trang sau"><ChevronRight aria-hidden className="size-4" /></button>
          </nav>
        )}
      </main>
  );
}
