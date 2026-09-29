'use client';

import Link from 'next/link';
import { Headset, SendHorizontal, UserRound } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { Spinner } from '@/foundation/components/feedback';
import { formatDateTime } from '@/shared/format/date-time';
import { SupportLoginPrompt } from '../components/support-login-prompt';
import { SupportTicketStatusBadge } from '../components/support-ticket-status-badge';
import {
  SUPPORT_AUTHOR_LABELS,
  SUPPORT_FIELD_LABELS,
  SUPPORT_MESSAGE_MAX_LENGTH,
  SUPPORT_ROUTES,
} from '../model/support-ticket.constants';
import { useAccountSupportTicket } from '../hooks/use-account-support-ticket';

export function AccountSupportTicketDetailPage({ ticketNo }: { ticketNo: string }) {
  const {
    isLoaded,
    isAuthenticated,
    isLoading,
    isError,
    errorMessage,
    detail,
    canReply,
    reply,
    setReply,
    submitReply,
    isReplying,
    replyErrorMessage,
  } = useAccountSupportTicket(ticketNo);

  return (
    <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-10 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500" aria-label="Breadcrumb">
        <Link href="/profile" className="hover:text-emerald-700">Tài khoản</Link>
        <span>/</span>
        <Link href={SUPPORT_ROUTES.list} className="hover:text-emerald-700">Hỗ trợ của tôi</Link>
        <span>/</span>
        <span className="font-mono font-bold text-slate-900">{ticketNo}</span>
      </nav>

      {(!isLoaded || (isAuthenticated && isLoading)) && (
        <div className="grid min-h-72 place-items-center"><Spinner className="size-9 animate-spin text-emerald-600" /></div>
      )}
      {isLoaded && !isAuthenticated && <SupportLoginPrompt title="Đăng nhập để xem yêu cầu hỗ trợ" />}
      {isAuthenticated && isError && (
        <section role="alert" className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-800">{errorMessage}</section>
      )}

      {detail && (
        <>
          <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{SUPPORT_FIELD_LABELS.ticketNo}</p>
                <h1 className="mt-1 font-mono text-xl font-black text-slate-950">{detail.ticketNo}</h1>
                <p className="mt-2 text-sm font-bold text-slate-800">{detail.subject}</p>
              </div>
              <SupportTicketStatusBadge status={detail.status} />
            </div>
            <dl className="mt-4 grid gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:grid-cols-2">
              <div><dt>{SUPPORT_FIELD_LABELS.createdAt}</dt><dd className="font-bold text-slate-800">{formatDateTime(detail.createdAt)}</dd></div>
              <div><dt>{SUPPORT_FIELD_LABELS.updatedAt}</dt><dd className="font-bold text-slate-800">{formatDateTime(detail.updatedAt)}</dd></div>
            </dl>
            {detail.resolutionNote && (
              <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-900">
                <strong className="block text-xs font-bold uppercase tracking-wider">Kết quả xử lý</strong>
                {detail.resolutionNote}
              </p>
            )}
          </header>

          <section className="mt-6" aria-labelledby="support-thread-title">
            <h2 id="support-thread-title" className="text-sm font-black uppercase tracking-wider text-slate-700">Trao đổi</h2>
            {/* SECURITY: chỉ render tin khách thấy được; view model không mang ghi chú nội bộ. */}
            <ol className="mt-3 space-y-3">
              {detail.messages.map((message) => {
                const isCustomer = message.author === 'CUSTOMER';
                return (
                  <li key={message.id} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                    <article
                      className={`max-w-[85%] rounded-2xl border p-4 text-sm ${
                        isCustomer ? 'border-emerald-200 bg-emerald-50 text-slate-900' : 'border-slate-200 bg-white text-slate-800'
                      }`}
                    >
                      <header className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        {isCustomer ? <UserRound className="size-3.5" aria-hidden /> : <Headset className="size-3.5 text-emerald-600" aria-hidden />}
                        <span>{SUPPORT_AUTHOR_LABELS[message.author]}</span>
                        <span aria-hidden>·</span>
                        <time dateTime={message.createdAt}>{formatDateTime(message.createdAt)}</time>
                      </header>
                      <p className="mt-2 whitespace-pre-wrap break-words">{message.body}</p>
                    </article>
                  </li>
                );
              })}
            </ol>
          </section>

          <form
            className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            onSubmit={(event) => {
              event.preventDefault();
              submitReply();
            }}
          >
            <label htmlFor="support-reply" className="block text-xs font-bold text-slate-800">{SUPPORT_FIELD_LABELS.reply}</label>
            <textarea
              id="support-reply"
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              maxLength={SUPPORT_MESSAGE_MAX_LENGTH}
              rows={4}
              disabled={!canReply || isReplying}
              aria-describedby="support-reply-hint"
              placeholder={canReply ? 'Nhập nội dung trả lời...' : 'Yêu cầu đã đóng, không thể trả lời.'}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 disabled:bg-slate-50"
            />
            <div id="support-reply-hint" className="mt-1 flex justify-between text-[11px] text-slate-400">
              <span>{canReply ? '' : 'Yêu cầu đã đóng. Vui lòng tạo yêu cầu mới nếu cần hỗ trợ thêm.'}</span>
              <span>{reply.length}/{SUPPORT_MESSAGE_MAX_LENGTH}</span>
            </div>
            {replyErrorMessage && <p role="alert" className="mt-2 text-xs font-semibold text-rose-700">{replyErrorMessage}</p>}
            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                disabled={!canReply || isReplying || !reply.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isReplying ? <Spinner className="size-4 animate-spin" /> : <SendHorizontal className="size-4" aria-hidden />}
                {isReplying ? 'Đang gửi...' : 'Gửi trả lời'}
              </Button>
            </div>
          </form>
        </>
      )}
    </main>
  );
}
