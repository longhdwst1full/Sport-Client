'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, LoaderCircle, RotateCcw } from 'lucide-react';
import { useCustomerAuth } from '@/features/auth';
import { useListAccountReturns } from '@/generated/api/returns/returns';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { formatDateTime } from '@/shared/format/date-time';
import {
  RETURN_FIELD_LABELS,
  RETURN_PAGE_SIZE,
  returnReasonLabels,
  returnStatusLabels,
  returnStatusTone,
} from '../model/return.constants';
import { returnErrorMessage } from '../model/return-error';

export function AccountReturnsPage() {
  const [page, setPage] = useState(1);
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const returns = useListAccountReturns(
    { page, limit: RETURN_PAGE_SIZE },
    { query: { enabled: isLoaded && isAuthenticated, retry: false } },
  );
  const totalPages = returns.data ? Math.ceil(returns.data.total / RETURN_PAGE_SIZE) : 1;

  return (
    <StorefrontLayout>
      <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Tài khoản</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Yêu cầu đổi trả</h1>
          <p className="mt-2 text-sm text-slate-600">Tạo yêu cầu từ trang chi tiết của đơn đã giao; theo dõi tiến độ tại đây.</p>
        </div>

        {(!isLoaded || (isAuthenticated && returns.isLoading)) && (
          <div className="grid min-h-56 place-items-center"><LoaderCircle className="size-8 animate-spin text-emerald-600" /></div>
        )}
        {isLoaded && !isAuthenticated && (
          <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-black">Đăng nhập để xem yêu cầu đổi trả</h2>
            <Link href="/login" className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Đăng nhập</Link>
          </section>
        )}
        {isAuthenticated && returns.isError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
            {returnErrorMessage(returns.error, 'Không tải được danh sách yêu cầu đổi trả.')}
          </div>
        )}
        {isAuthenticated && returns.data?.items.length === 0 && (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <RotateCcw className="mx-auto size-12 text-slate-400" />
            <h2 className="mt-4 text-lg font-black">Chưa có yêu cầu đổi trả</h2>
            <Link href="/orders" className="mt-4 inline-flex text-sm font-bold text-emerald-700">Xem đơn hàng</Link>
          </section>
        )}
        {isAuthenticated && (
          <div className="grid gap-4">
            {returns.data?.items.map((item) => (
              <Link
                key={item.id}
                href={`/returns/${encodeURIComponent(item.returnNo)}`}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-sm font-black text-emerald-700">{item.returnNo}</div>
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
        {isAuthenticated && returns.data && totalPages > 1 && (
          <nav className="mt-7 flex items-center justify-center gap-3" aria-label="Phân trang yêu cầu đổi trả">
            <button type="button" disabled={page === 1 || returns.isFetching} onClick={() => setPage((value) => Math.max(1, value - 1))} className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white disabled:opacity-40" aria-label="Trang trước"><ChevronLeft className="size-4" /></button>
            <span className="text-sm font-bold text-slate-700">Trang {page} / {totalPages}</span>
            <button type="button" disabled={page >= totalPages || returns.isFetching} onClick={() => setPage((value) => value + 1)} className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white disabled:opacity-40" aria-label="Trang sau"><ChevronRight className="size-4" /></button>
          </nav>
        )}
      </main>
    </StorefrontLayout>
  );
}
