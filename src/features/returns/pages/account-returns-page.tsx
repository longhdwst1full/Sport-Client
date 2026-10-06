'use client';

import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
import { EmptyState, InlineAlert } from '@/foundation/components/feedback';
import { PaginationControls } from '@/shared/components/pagination-controls';
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
          <EmptyState
            as="section"
            className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10"
            titleClassName="text-xl font-black"
            title="Đăng nhập để xem yêu cầu đổi trả"
            actions={<Link href="/login" className={buttonVariants({ variant: 'primary', className: 'mt-5 px-5 font-bold' })}>Đăng nhập</Link>}
          />
        )}
        {isAuthenticated && isError && (
          <InlineAlert role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
            {errorMessage}
          </InlineAlert>
        )}
        {isAuthenticated && hasData && items.length === 0 && (
          <EmptyState
            as="section"
            className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-10"
            iconWrapClassName="flex justify-center"
            icon={<RotateCcw aria-hidden className="size-12 text-slate-400" />}
            titleClassName="mt-4 text-lg font-black"
            title="Chưa có yêu cầu đổi trả"
            actions={<Link href="/orders" className={buttonVariants({ variant: 'link', className: 'mt-4 min-h-11 font-bold' })}>Xem đơn hàng</Link>}
          />
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
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isFetching}
            ariaLabel="Phân trang yêu cầu đổi trả"
          />
        )}
      </main>
  );
}
