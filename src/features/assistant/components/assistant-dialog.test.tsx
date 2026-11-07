// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import type { AssistantChatState } from '../hooks/use-assistant-chat';
import { ASSISTANT_COPY, ASSISTANT_SUGGESTIONS } from '../model/assistant.constants';
import type { AssistantMessageView } from '../model/assistant.types';
import { AssistantDialog } from './assistant-dialog';

afterEach(cleanup);
// jsdom không có `scrollIntoView` (dialog cuộn tới tin cuối mỗi khi danh sách đổi).
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

const ORDER_SUGGESTION = ASSISTANT_SUGGESTIONS.find((suggestion) => 'orderLookup' in suggestion)!;
const SEND_SUGGESTIONS = ASSISTANT_SUGGESTIONS.filter((suggestion) => !('orderLookup' in suggestion));

function chatState(overrides: Partial<AssistantChatState> = {}): AssistantChatState {
  return {
    isAuthenticated: true,
    conversationId: undefined,
    messages: [],
    isHistoryLoading: false,
    historyError: null,
    pending: null,
    isSending: false,
    isUnavailable: false,
    handoffSuggested: false,
    suggestOrderLookup: false,
    canAskOrderStatus: true,
    isHandedOff: false,
    send: vi.fn().mockResolvedValue(true),
    discardPending: vi.fn(),
    submitFeedback: vi.fn(),
    feedbackPendingId: null,
    feedbackError: null,
    ...overrides,
  };
}

function suggestionList() {
  return screen.queryByRole('list', { name: ASSISTANT_COPY.suggestionsLabel });
}

describe('AssistantDialog — gợi ý câu hỏi', () => {
  it('hội thoại chưa có tin của khách: hiện đủ chip gợi ý dưới lời chào', () => {
    render(<AssistantDialog chat={chatState()} onClose={vi.fn()} />);
    const list = suggestionList();
    expect(list).not.toBeNull();
    for (const suggestion of ASSISTANT_SUGGESTIONS) {
      expect(within(list!).getByRole('button', { name: `Hỏi trợ lý: ${suggestion.content}` })).toBeTruthy();
    }
  });

  it('bấm chip: gửi đúng nội dung qua hàm send của hook', () => {
    const chat = chatState();
    render(<AssistantDialog chat={chat} onClose={vi.fn()} />);
    const target = SEND_SUGGESTIONS[1];
    fireEvent.click(screen.getByRole('button', { name: `Hỏi trợ lý: ${target.content}` }));
    expect(chat.send).toHaveBeenCalledTimes(1);
    expect(chat.send).toHaveBeenCalledWith(target.content);
  });

  it('đang gửi: chip bị khoá, bấm không gửi', () => {
    const chat = chatState({ isSending: true });
    render(<AssistantDialog chat={chat} onClose={vi.fn()} />);
    const chip = screen.getByRole('button', { name: `Hỏi trợ lý: ${SEND_SUGGESTIONS[0].content}` }) as HTMLButtonElement;
    expect(chip.disabled).toBe(true);
    fireEvent.click(chip);
    expect(chat.send).not.toHaveBeenCalled();
  });

  it('ẩn khi có tin đang gửi, khi đã có tin của khách, hoặc khi lịch sử đang tải', () => {
    const { rerender } = render(
      <AssistantDialog chat={chatState({ pending: { content: 'Xin chào', error: null }, isSending: true })} onClose={vi.fn()} />,
    );
    expect(suggestionList()).toBeNull();

    const userMessage: AssistantMessageView = {
      id: '1',
      role: 'USER',
      content: 'Xin chào',
      createdAt: '2026-11-07T00:00:00.000Z',
      feedback: null,
      cards: [],
      sources: [],
    };
    rerender(<AssistantDialog chat={chatState({ messages: [userMessage] })} onClose={vi.fn()} />);
    expect(suggestionList()).toBeNull();

    rerender(<AssistantDialog chat={chatState({ isHistoryLoading: true })} onClose={vi.fn()} />);
    expect(suggestionList()).toBeNull();
  });

  it('khách ẩn danh chưa có grant tra đơn: chip đơn hàng dẫn tới trang tra cứu, không gửi', () => {
    const chat = chatState({ isAuthenticated: false, canAskOrderStatus: false });
    const onClose = vi.fn();
    render(<AssistantDialog chat={chat} onClose={onClose} />);
    const link = screen.getByRole('link', { name: `${ORDER_SUGGESTION.content}: ${ASSISTANT_COPY.orderLookupLink}` });
    expect(link.getAttribute('href')).toBe('/orders/lookup');
    // jsdom không điều hướng được; chặn để test không in lỗi "navigation not implemented".
    link.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(link);
    expect(chat.send).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
