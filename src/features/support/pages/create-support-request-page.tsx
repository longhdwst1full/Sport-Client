'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SendHorizontal } from 'lucide-react';
import { useCustomerAuth } from '@/features/auth';
import { Button } from '@/foundation/components/buttons';
import { Skeleton, Spinner } from '@/foundation/components/feedback';
import { SupportLoginPrompt } from '../components/support-login-prompt';
import {
  SUPPORT_FIELD_LABELS,
  SUPPORT_MESSAGE_MAX_LENGTH,
  SUPPORT_ROUTES,
  SUPPORT_SUBJECT_MAX_LENGTH,
  SUPPORT_SUBJECT_MIN_LENGTH,
} from '../model/support-ticket.constants';
import { useCreateSupportRequest } from '../hooks/use-create-support-request';

export function CreateSupportRequestPage() {
  const router = useRouter();
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const create = useCreateSupportRequest({
    onCreated: (ticket) => router.push(SUPPORT_ROUTES.detail(ticket.ticketNo)),
  });

  const trimmedSubject = subject.trim();
  const trimmedMessage = message.trim();
  const canSubmit = trimmedSubject.length >= SUPPORT_SUBJECT_MIN_LENGTH && trimmedMessage.length > 0 && !create.isPending;

  return (
    <main className="mx-auto min-h-[60vh] max-w-3xl px-4 py-10 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500" aria-label="Breadcrumb">
        <Link href="/profile" className="hover:text-brand-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Tài khoản</Link>
        <span aria-hidden>/</span>
        <Link href={SUPPORT_ROUTES.list} className="hover:text-brand-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Hỗ trợ của tôi</Link>
      </nav>
      <h1 className="text-3xl font-black text-slate-950">Tạo yêu cầu hỗ trợ</h1>
      <p className="mt-2 text-sm text-slate-600">Mô tả vấn đề của bạn, nhân viên Bảo An Sport sẽ phản hồi trong mục Hỗ trợ của tôi.</p>

      {!isLoaded && (
        <div className="mt-7 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" aria-busy="true" aria-label="Đang tải biểu mẫu">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-11 w-full rounded-2xl" />
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      )}
      {isLoaded && !isAuthenticated && (
        <div className="mt-7"><SupportLoginPrompt title="Đăng nhập để gửi yêu cầu hỗ trợ" /></div>
      )}
      {isAuthenticated && (
        <form
          className="mt-7 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            if (canSubmit) create.submit({ subject: trimmedSubject, message: trimmedMessage });
          }}
        >
          <div>
            <label htmlFor="support-subject" className="block text-xs font-bold text-slate-800">
              {SUPPORT_FIELD_LABELS.subject} <span className="text-rose-600">*</span>
            </label>
            <input
              id="support-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              maxLength={SUPPORT_SUBJECT_MAX_LENGTH}
              required
              disabled={create.isPending}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-base sm:text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            <div className="mt-1 text-right text-[11px] text-slate-500">{subject.length}/{SUPPORT_SUBJECT_MAX_LENGTH}</div>
          </div>
          <div>
            <label htmlFor="support-message" className="block text-xs font-bold text-slate-800">
              {SUPPORT_FIELD_LABELS.message} <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="support-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={SUPPORT_MESSAGE_MAX_LENGTH}
              rows={6}
              required
              disabled={create.isPending}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3 text-base sm:text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            <div className="mt-1 text-right text-[11px] text-slate-500">{message.length}/{SUPPORT_MESSAGE_MAX_LENGTH}</div>
          </div>
          {create.errorMessage && (
            <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">{create.errorMessage}</p>
          )}
          <div className="flex justify-end gap-3">
            <Link href={SUPPORT_ROUTES.list} className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Huỷ</Link>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="flex min-h-11 items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              {create.isPending ? <Spinner className="size-4 animate-spin" /> : <SendHorizontal className="size-4" aria-hidden />}
              {create.isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>
          </div>
        </form>
      )}
    </main>
  );
}
