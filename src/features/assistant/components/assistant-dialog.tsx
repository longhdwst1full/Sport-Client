'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { AlertTriangle, Bot, RotateCw, SendHorizontal, X } from 'lucide-react';
import { GUEST_LOOKUP_ROUTE } from '@/features/orders';
import { Modal } from '@/foundation/components/overlay';
import { Button } from '@/foundation/components/buttons';
import { InlineAlert, Skeleton, Spinner } from '@/foundation/components/feedback';
import { Field, Textarea } from '@/foundation/components/field-system';
import { STORE_CONTACT } from '@/shared/constants';
import type { AssistantChatState } from '../hooks/use-assistant-chat';
import {
  ASSISTANT_COPY,
  ASSISTANT_DIALOG_ID,
  ASSISTANT_MESSAGE_MAX_LENGTH,
  ASSISTANT_TITLE,
} from '../model/assistant.constants';
import { assistantErrorMessage, isAssistantQuotaExceeded } from '../model/assistant-error';
import { AssistantHandoff } from './assistant-handoff';
import { AssistantMessage } from './assistant-message';

/** Nút dạng link nằm trong dòng thông báo: kế thừa màu chữ của dòng, luôn gạch chân. */
const INLINE_LINK_BUTTON = 'gap-1 rounded font-bold text-inherit underline focus-visible:ring-offset-0';

const TITLE_ID = 'assistant-chat-title';
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Panel chat. Dùng `Modal` của foundation (role=dialog, aria-modal, Esc để đóng, đưa focus vào và trả focus
 * về launcher khi đóng) và thêm vòng Tab trong panel vì trên mobile panel phủ toàn màn hình.
 */
export function AssistantDialog({ chat, onClose }: { chat: AssistantChatState; onClose: () => void }) {
  const [draft, setDraft] = useState('');
  const [showHandoff, setShowHandoff] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listEndRef = useRef<HTMLLIElement | null>(null);
  // Trạng thái tạm ngưng không khoá ô nhập: 503 có thể hết sau vài phút, khách thử lại được mà không phải tải lại trang.
  const inputDisabled = chat.isSending;

  const messageCount = chat.messages.length + (chat.pending ? 1 : 0);
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messageCount, chat.isSending]);

  const trapTab = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !containerRef.current) return;
    const nodes = Array.from(containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const submit = async () => {
    if (inputDisabled || !draft.trim()) return;
    const sent = await chat.send(draft);
    if (sent) setDraft('');
  };

  return (
    <Modal
      onClose={onClose}
      labelledBy={TITLE_ID}
      backdropClassName="fixed inset-0 z-[60] flex sm:inset-auto sm:bottom-20 sm:right-5"
      className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl outline-none sm:h-[min(620px,calc(100dvh-7rem))] sm:w-[380px] sm:rounded-3xl sm:border sm:border-slate-200 animate-fade-in-up"
    >
      <div ref={containerRef} id={ASSISTANT_DIALOG_ID} className="flex h-full min-h-0 flex-col" onKeyDown={trapTab}>
        <header className="flex items-center justify-between gap-2 bg-slate-800 px-4 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-white sm:py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-white/15" aria-hidden><Bot className="size-4.5" /></span>
            <h2 id={TITLE_ID} className="truncate text-sm font-black">{ASSISTANT_TITLE}</h2>
          </div>
          <div className="flex items-center gap-1">
            {/* Panel 380px: nút đóng thu về 32px trên desktop, giữ 44px trên mobile. */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-lg text-white hover:bg-white/15 focus-visible:ring-white focus-visible:ring-offset-0 sm:size-8"
              aria-label="Đóng trợ lý mua sắm"
            >
              <X className="size-4.5" aria-hidden />
            </Button>
          </div>
        </header>

        {chat.isUnavailable && (
          <div role="status" className="flex gap-2 border-b border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <p className="font-black">{ASSISTANT_COPY.unavailableTitle}</p>
              <p className="mt-0.5">
                {ASSISTANT_COPY.unavailableBody}{' '}
                <Link href="/contact" onClick={onClose} className="rounded font-bold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900">{ASSISTANT_COPY.contactLink}</Link>
                {' · '}
                <a href={`tel:${STORE_CONTACT.primaryHotlineRaw}`} className="rounded font-bold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900">{STORE_CONTACT.primaryHotline}</a>
              </p>
            </div>
          </div>
        )}

        <ol className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite" aria-relevant="additions" aria-label="Tin nhắn">
          <li className="flex gap-2">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-900" aria-hidden><Bot className="size-4" /></span>
            <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-slate-100 px-3.5 py-2.5 text-sm text-slate-800">{ASSISTANT_COPY.greeting}</p>
          </li>
          {chat.isHistoryLoading && (
            <li className="space-y-3" aria-busy="true" aria-label="Đang tải lịch sử trò chuyện">
              <Skeleton className="ml-auto h-10 w-2/3 rounded-2xl" />
              <Skeleton className="h-14 w-4/5 rounded-2xl" />
            </li>
          )}
          {chat.historyError != null && (
            <InlineAlert as="li" role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-800">{ASSISTANT_COPY.historyError}</InlineAlert>
          )}
          {chat.messages.map((message) => (
            <AssistantMessage
              key={message.id}
              message={message}
              onFeedback={chat.submitFeedback}
              feedbackDisabled={chat.isUnavailable || chat.feedbackPendingId !== null}
              onNavigate={onClose}
            />
          ))}
          {chat.pending && (
            <li className="flex flex-col items-end gap-1">
              <p className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm text-white ${chat.pending.error ? 'bg-slate-900/60' : 'bg-slate-900'}`}>
                {chat.pending.content}
              </p>
              {chat.pending.error != null && (
                <InlineAlert role="alert" className="flex flex-wrap items-center gap-2 text-[11px] text-rose-700">
                  <span>{assistantErrorMessage(chat.pending.error, undefined, { isAuthenticated: chat.isAuthenticated })}</span>
                  {!chat.isAuthenticated && isAssistantQuotaExceeded(chat.pending.error) && (
                    <Link href="/login" onClick={onClose} className="rounded font-bold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900">Đăng nhập</Link>
                  )}
                  <Button variant="link" onClick={() => void chat.send(chat.pending?.content ?? '')} className={INLINE_LINK_BUTTON}>
                    <RotateCw className="size-3" aria-hidden />
                    Thử lại
                  </Button>
                  <Button variant="link" onClick={chat.discardPending} className={INLINE_LINK_BUTTON}>Bỏ</Button>
                </InlineAlert>
              )}
            </li>
          )}
          {chat.isSending && (
            <li className="flex items-center gap-2 text-xs text-slate-500" role="status">
              <Spinner className="size-4 animate-spin text-slate-900" />
              Trợ lý đang trả lời...
            </li>
          )}
          {chat.feedbackError != null && (
            <InlineAlert as="li" role="alert" className="text-center text-[11px] text-rose-700">
              {assistantErrorMessage(chat.feedbackError, ASSISTANT_COPY.feedbackError)}
            </InlineAlert>
          )}
          {chat.suggestOrderLookup && (
            <li className="flex flex-wrap items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-xs text-sky-900">
              <span>{ASSISTANT_COPY.orderLookupHint}</span>
              <Link href={GUEST_LOOKUP_ROUTE} onClick={onClose} className="rounded font-bold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900">{ASSISTANT_COPY.orderLookupLink}</Link>
            </li>
          )}
          {chat.isHandedOff && (
            <li role="status" className="rounded-xl bg-success-50 px-3 py-2 text-xs text-success-900">{ASSISTANT_COPY.handedOff}</li>
          )}
          {chat.handoffSuggested && !chat.isHandedOff && !showHandoff && (
            <li className="flex flex-wrap items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <span>{ASSISTANT_COPY.handoffSuggested}</span>
              <Button variant="link" onClick={() => setShowHandoff(true)} className={INLINE_LINK_BUTTON}>{ASSISTANT_COPY.handoff}</Button>
            </li>
          )}
          <li ref={listEndRef} aria-hidden className="h-px" />
        </ol>

        {showHandoff && (
          <AssistantHandoff
            isAuthenticated={chat.isAuthenticated}
            conversationId={chat.conversationId}
            onCancel={() => setShowHandoff(false)}
            onNavigate={onClose}
          />
        )}

        <form
          className="border-t border-slate-200 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-3 sm:pb-3"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <Field label={ASSISTANT_COPY.inputLabel} labelClassName="sr-only" htmlFor="assistant-chat-input">
          <div className="flex items-end gap-2">
            <Textarea
              styled
              id="assistant-chat-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  void submit();
                }
              }}
              maxLength={ASSISTANT_MESSAGE_MAX_LENGTH}
              rows={2}
              disabled={inputDisabled}
              placeholder={ASSISTANT_COPY.inputPlaceholder}
              aria-describedby="assistant-chat-counter"
              className="min-h-[44px] flex-1 resize-none rounded-2xl px-3 py-2 text-slate-800 placeholder:text-slate-500"
            />
            <Button
              type="submit"
              size="icon"
              disabled={inputDisabled || !draft.trim()}
              aria-label="Gửi tin nhắn"
              className="shrink-0 rounded-2xl disabled:opacity-40"
            >
              {chat.isSending ? <Spinner className="size-4.5 animate-spin" /> : <SendHorizontal className="size-4.5" aria-hidden />}
            </Button>
          </div>
          </Field>
          <p id="assistant-chat-counter" className="mt-1 text-right text-[11px] text-slate-500">
            {draft.length}/{ASSISTANT_MESSAGE_MAX_LENGTH}
          </p>
        </form>
      </div>
    </Modal>
  );
}
