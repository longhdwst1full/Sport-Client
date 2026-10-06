'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, LifeBuoy } from 'lucide-react';
import { Skeleton } from '@/foundation/components/feedback';
import { formatDateTime } from '@/shared/format/date-time';
import { SupportLoginPrompt } from '../components/support-login-prompt';
import { SupportTicketStatusBadge } from '../components/support-ticket-status-badge';
import { SUPPORT_FIELD_LABELS, SUPPORT_ROUTES } from '../model/support-ticket.constants';
import { useAccountSupportTickets } from '../hooks/use-account-support-tickets';

export function AccountSupportTicketsPage() {
  const {
    page,
    setPage,
    isLoaded,
    isAuthenticated,
    isLoading,
    isFetching,
    isError,
    errorMessage,
    items,
    hasData,
    totalPages,
  } = useAccountSupportTickets();

  return (
    <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700">Tài khoản</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Hỗ trợ của tôi</h1>
          <p className="mt-2 text-sm text-slate-600">Theo dõi các yêu cầu hỗ trợ bạn đã gửi và phản hồi của nhân viên.</p>
        </div>
        {isAuthenticated && (
          <Link href={SUPPORT_ROUTES.create} className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
            Tạo yêu cầu hỗ trợ
          </Link>
        )}
      </div>

      {(!isLoaded || (isAuthenticated && isLoading)) && (
        <div className="grid gap-4" aria-busy="true" aria-label="Đang tải yêu cầu hỗ trợ">
          {[0, 1, 2].map((row) => (
            <div key={row} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="mt-2 h-4 w-2/3 rounded" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="mt-4 h-3 w-40 rounded" />
            </div>
          ))}
        </div>
      )}
      {isLoaded && !isAuthenticated && <SupportLoginPrompt title="Đăng nhập để xem yêu cầu hỗ trợ" />}
      {isAuthenticated && isError && (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">{errorMessage}</div>
      )}
      {isAuthenticated && hasData && items.length === 0 && (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <LifeBuoy className="mx-auto size-12 text-slate-400" aria-hidden />
          <h2 className="mt-4 text-lg font-black">Chưa có yêu cầu hỗ trợ</h2>
          <Link href={SUPPORT_ROUTES.create} className="mt-4 inline-flex text-sm font-bold text-brand-700 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Tạo yêu cầu hỗ trợ</Link>
        </section>
      )}
      {isAuthenticated && items.length > 0 && (
        <div className={`grid gap-4 transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
          {items.map((ticket) => (
            <Link
              key={ticket.ticketNo}
              href={SUPPORT_ROUTES.detail(ticket.ticketNo)}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-mono text-sm font-black text-brand-700">{ticket.ticketNo}</div>
                  <div className="mt-1 truncate text-sm font-bold text-slate-900">{ticket.subject}</div>
                </div>
                <SupportTicketStatusBadge status={ticket.status} />
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                {SUPPORT_FIELD_LABELS.updatedAt}: {formatDateTime(ticket.updatedAt)}
              </div>
            </Link>
          ))}
        </div>
      )}
      {isAuthenticated && hasData && totalPages > 1 && (
        <nav className="mt-7 flex items-center justify-center gap-3" aria-label="Phân trang yêu cầu hỗ trợ">
          <button type="button" disabled={page === 1 || isFetching} onClick={() => setPage((value) => Math.max(1, value - 1))} className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" aria-label="Trang trước"><ChevronLeft className="size-4" aria-hidden /></button>
          <span className="text-sm font-bold text-slate-700">Trang {page} / {totalPages}</span>
          <button type="button" disabled={page >= totalPages || isFetching} onClick={() => setPage((value) => value + 1)} className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" aria-label="Trang sau"><ChevronRight className="size-4" aria-hidden /></button>
        </nav>
      )}
    </main>
  );
}
