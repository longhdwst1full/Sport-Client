'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SendHorizontal } from 'lucide-react';
import { useCustomerAuth } from '@/features/auth';
import { Button, buttonVariants } from '@/foundation/components/buttons';
import { InlineAlert, Skeleton } from '@/foundation/components/feedback';
import { Field, Textarea, TextInput } from '@/foundation/components/field-system';
import { SupportLoginPrompt } from '../components/support-login-prompt';
import {
  SUPPORT_FIELD_LABELS,
  SUPPORT_MESSAGE_MAX_LENGTH,
  SUPPORT_ROUTES,
  SUPPORT_SUBJECT_MAX_LENGTH,
  SUPPORT_SUBJECT_MIN_LENGTH,
} from '../model/support-ticket.constants';
import { useCreateSupportRequest } from '../hooks/use-create-support-request';

const LABEL_CLASS = 'block text-xs font-bold text-neutral-800';

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
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-500" aria-label="Breadcrumb">
        <Link href="/profile" className="hover:text-neutral-900 rounded focus-ring-tight">Tài khoản</Link>
        <span aria-hidden>/</span>
        <Link href={SUPPORT_ROUTES.list} className="hover:text-neutral-900 rounded focus-ring-tight">Hỗ trợ của tôi</Link>
      </nav>
      <h1 className="text-3xl font-black text-neutral-950">Tạo yêu cầu hỗ trợ</h1>
      <p className="mt-2 text-sm text-neutral-600">Mô tả vấn đề của bạn, nhân viên Bảo An Sport sẽ phản hồi trong mục Hỗ trợ của tôi.</p>

      {!isLoaded && (
        <div className="mt-7 space-y-5 surface-card p-6 shadow-sm" aria-busy="true" aria-label="Đang tải biểu mẫu">
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
          className="mt-7 space-y-5 surface-card p-6 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            if (canSubmit) create.submit({ subject: trimmedSubject, message: trimmedMessage });
          }}
        >
          <div>
            <Field label={<>{SUPPORT_FIELD_LABELS.subject} <span className="text-red-600">*</span></>} labelClassName={LABEL_CLASS}>
              <TextInput
                size="md"
                id="support-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                maxLength={SUPPORT_SUBJECT_MAX_LENGTH}
                required
                disabled={create.isPending}
                className="mt-1.5"
              />
            </Field>
            <div className="mt-1 text-right text-2xs text-neutral-500">{subject.length}/{SUPPORT_SUBJECT_MAX_LENGTH}</div>
          </div>
          <div>
            <Field label={<>{SUPPORT_FIELD_LABELS.message} <span className="text-red-600">*</span></>} labelClassName={LABEL_CLASS}>
              <Textarea
                styled
                id="support-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={SUPPORT_MESSAGE_MAX_LENGTH}
                rows={6}
                required
                disabled={create.isPending}
                className="mt-1.5"
              />
            </Field>
            <div className="mt-1 text-right text-2xs text-neutral-500">{message.length}/{SUPPORT_MESSAGE_MAX_LENGTH}</div>
          </div>
          {create.errorMessage && (
            <InlineAlert as="p" role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-800">{create.errorMessage}</InlineAlert>
          )}
          <div className="flex justify-end gap-3">
            <Link href={SUPPORT_ROUTES.list} className={buttonVariants({ variant: 'outline', className: 'px-5 text-xs font-bold text-neutral-700' })}>Huỷ</Link>
            <Button
              type="submit"
              disabled={!canSubmit}
              loading={create.isPending}
              className="gap-1.5 px-5 text-xs font-bold shadow-sm"
              size="md"
            >
              {!create.isPending && <SendHorizontal className="size-4" aria-hidden />}
              {create.isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>
          </div>
        </form>
      )}
    </main>
  );
}
