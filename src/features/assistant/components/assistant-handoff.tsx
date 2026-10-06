'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogIn, SendHorizontal, X } from 'lucide-react';
import { useCreateSupportRequest } from '@/features/support';
import { Button, buttonVariants } from '@/foundation/components/buttons';
import { InlineAlert, Spinner } from '@/foundation/components/feedback';
import { Field, Textarea } from '@/foundation/components/field-system';
import { ASSISTANT_COPY, ASSISTANT_HANDOFF_SUBJECT } from '../model/assistant.constants';
import { AssistantTicketCard } from './assistant-cards';

const HANDOFF_MESSAGE_MAX_LENGTH = 2000;

/**
 * "Chuyển nhân viên": tạo phiếu hỗ trợ gắn `conversationId`. V1.0 phiếu bắt buộc có tài khoản, nên khách
 * ẩn danh chỉ thấy lời mời đăng nhập — không có đường tạo phiếu ẩn danh.
 */
export function AssistantHandoff({
  isAuthenticated,
  conversationId,
  onCancel,
  onNavigate,
}: {
  isAuthenticated: boolean;
  conversationId: string | undefined;
  onCancel: () => void;
  onNavigate: () => void;
}) {
  const [message, setMessage] = useState('');
  const create = useCreateSupportRequest();
  const trimmed = message.trim();

  return (
    <section aria-labelledby="assistant-handoff-title" className="border-t border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 id="assistant-handoff-title" className="text-xs font-black text-slate-900">{ASSISTANT_COPY.handoff}</h3>
        {/* 36px: khung handoff nằm trong panel 380px nên dùng nút gọn. */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="size-9 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-700 focus-visible:ring-offset-0"
          aria-label="Đóng chuyển nhân viên"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>

      {!isAuthenticated && (
        <div className="mt-2 space-y-2 text-xs text-slate-600">
          <p>{ASSISTANT_COPY.handoffLoginRequired}</p>
          <Link href="/login" onClick={onNavigate} className={buttonVariants({ size: 'sm', className: 'gap-1.5 rounded-lg px-3 text-xs font-bold' })}>
            <LogIn className="size-3.5" aria-hidden />
            Đăng nhập
          </Link>
        </div>
      )}

      {isAuthenticated && create.created && (
        <div className="mt-2 space-y-2 text-xs text-slate-600" role="status">
          <p>Đã tạo yêu cầu hỗ trợ. Nhân viên sẽ phản hồi trong mục Hỗ trợ của tôi.</p>
          <AssistantTicketCard card={create.created} onNavigate={onNavigate} />
        </div>
      )}

      {isAuthenticated && !create.created && (
        <form
          className="mt-2 space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!trimmed) return;
            create.submit({ subject: ASSISTANT_HANDOFF_SUBJECT, message: trimmed, conversationId });
          }}
        >
          <Field label="Mô tả vấn đề cho nhân viên" labelClassName="block text-[11px] font-bold text-slate-700">
            <Textarea
              styled
              id="assistant-handoff-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={HANDOFF_MESSAGE_MAX_LENGTH}
              rows={2}
              disabled={create.isPending}
              className="min-h-0 resize-none p-2 text-slate-800 sm:text-xs"
            />
          </Field>
          {create.errorMessage && <InlineAlert as="p" role="alert" className="text-[11px] font-semibold text-rose-700">{create.errorMessage}</InlineAlert>}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={!trimmed || create.isPending}
              className="gap-1.5 rounded-lg px-3 text-xs font-bold"
            >
              {create.isPending ? <Spinner className="size-3.5 animate-spin" /> : <SendHorizontal className="size-3.5" aria-hidden />}
              Gửi cho nhân viên
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
