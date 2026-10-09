'use client';

import { Bot, ThumbsDown, ThumbsUp } from 'lucide-react';
import { ChatMessageFeedback } from '@/generated/api/assistant/assistant.schemas';
import { Button } from '@/foundation/components/buttons';
import type { AssistantFeedback, AssistantMessageView } from '../model/assistant.types';
import { AssistantCardList } from './assistant-cards';

const ASSISTANT_FEEDBACK = ChatMessageFeedback;

export function AssistantMessage({
  message,
  onFeedback,
  feedbackDisabled,
  onNavigate,
}: {
  message: AssistantMessageView;
  onFeedback: (messageId: string, value: AssistantFeedback) => void;
  feedbackDisabled: boolean;
  onNavigate: () => void;
}) {
  if (message.role === 'USER') {
    return (
      <li className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-neutral-900 px-3.5 py-2.5 text-sm text-white">
          {message.content}
        </p>
      </li>
    );
  }

  // Feedback ghi một lần (API trả 409 nếu gửi lại) nên khoá nút sau khi đã đánh giá.
  const alreadyRated = message.feedback !== null;
  return (
    <li className="flex gap-2">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-neutral-50 text-neutral-900" aria-hidden>
        <Bot className="size-4" />
      </span>
      <div className="min-w-0 max-w-[85%] space-y-2">
        {/* Nội dung trợ lý render dạng văn bản thuần (không HTML) nên không cần sanitize. */}
        <p className="whitespace-pre-wrap break-words rounded-2xl rounded-tl-md bg-neutral-100 px-3.5 py-2.5 text-sm text-neutral-800">
          {message.content}
        </p>
        {message.cards.length > 0 && <AssistantCardList cards={message.cards} onNavigate={onNavigate} />}
        {message.sources.length > 0 && (
          <p className="text-2xs text-neutral-500">Nguồn: {message.sources.map((source) => source.title).join(', ')}</p>
        )}
        <div className="flex items-center gap-1" role="group" aria-label="Đánh giá câu trả lời">
            <Button
              variant="ghost"
              size="icon"
              disabled={feedbackDisabled || alreadyRated}
              onClick={() => onFeedback(message.id, ASSISTANT_FEEDBACK.HELPFUL)}
              aria-pressed={message.feedback === ASSISTANT_FEEDBACK.HELPFUL}
              aria-label="Câu trả lời hữu ích"
              className={`size-9 rounded-lg disabled:cursor-default focus-visible:ring-offset-0 ${
                message.feedback === ASSISTANT_FEEDBACK.HELPFUL ? 'bg-neutral-50 text-neutral-900 disabled:opacity-100' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-40'
              }`}
            >
              <ThumbsUp className="size-3.5" aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={feedbackDisabled || alreadyRated}
              onClick={() => onFeedback(message.id, ASSISTANT_FEEDBACK.NOT_HELPFUL)}
              aria-pressed={message.feedback === ASSISTANT_FEEDBACK.NOT_HELPFUL}
              aria-label="Câu trả lời chưa hữu ích"
              className={`size-9 rounded-lg disabled:cursor-default focus-visible:ring-offset-0 ${
                message.feedback === ASSISTANT_FEEDBACK.NOT_HELPFUL ? 'bg-red-50 text-red-700 disabled:opacity-100' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-40'
              }`}
            >
              <ThumbsDown className="size-3.5" aria-hidden />
            </Button>
        </div>
      </div>
    </li>
  );
}
