'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomerAuth } from '@/features/auth';
import {
  createChatConversation,
  getListChatMessagesQueryKey,
  sendChatMessage,
  submitChatMessageFeedback,
  useListChatMessages,
} from '@/generated/api/assistant/assistant';
import type {
  ChatConversationStatus,
  ChatMessageDto,
  ChatMessageListDto,
  ListChatMessagesParams,
  SendChatMessageResponseDto,
} from '@/generated/api/assistant/assistant.schemas';
import { ASSISTANT_HISTORY_PAGE_SIZE, ASSISTANT_MESSAGE_MAX_LENGTH } from '../model/assistant.constants';
import { toAssistantMessageView } from '../model/assistant.mapper';
import {
  anonymousAssistantSessionStore,
  type AnonymousAssistantSession,
} from '../model/assistant-session.store';
import {
  assistantRequestHeaders,
  isAssistantConversationGone,
  isAssistantUnavailable,
  requiresFreshIdempotencyKey,
} from '../model/assistant-error';
import { resolveIdempotencyEntry, type AssistantIdempotencyEntry } from '../model/assistant-idempotency';
import type { AssistantFeedback } from '../model/assistant.types';

/** Tin khách vừa gửi, hiển thị ngay trong lúc chờ trợ lý trả lời hoặc khi gửi lỗi. */
export type PendingAssistantMessage = { content: string; error: unknown | null };

const HISTORY_PARAMS: ListChatMessagesParams = { limit: ASSISTANT_HISTORY_PAGE_SIZE };

/** Ghép tin mới vào trang lịch sử trong cache; replay idempotent trả lại đúng id cũ nên phải khử trùng. */
function appendMessages(current: ChatMessageListDto | undefined, added: ChatMessageDto[]): ChatMessageListDto {
  const items = [...(current?.items ?? [])];
  for (const message of added) {
    if (!items.some((item) => item.id === message.id)) items.push(message);
  }
  return {
    items,
    meta: current?.meta ?? { limit: ASSISTANT_HISTORY_PAGE_SIZE, hasMore: false, nextCursor: null },
  };
}

/**
 * Hội thoại của trợ lý mua sắm: tạo hội thoại ở lần gửi đầu, gửi tin, lịch sử trang mới nhất, đánh giá câu trả lời.
 *
 * Nguồn sự thật của tin nhắn là cache TanStack Query theo key Orval `listChatMessages`; hook chỉ giữ tin đang gửi.
 * Khách ẩn danh: `conversationId` + `sessionKey` ở localStorage. Khách đăng nhập: `conversationId` chỉ ở bộ nhớ và bị
 * bỏ khi phiên đổi, để tài khoản khác trên cùng máy không mở hội thoại của người trước.
 */
export function useAssistantChat({ enabled }: { enabled: boolean }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const [anonymousSession, setAnonymousSession] = useState<AnonymousAssistantSession | undefined>(() =>
    anonymousAssistantSessionStore.read(),
  );
  const [accountConversationId, setAccountConversationId] = useState<string | undefined>(undefined);
  const [pending, setPending] = useState<PendingAssistantMessage | null>(null);
  const [lastTurn, setLastTurn] = useState<{ handoffSuggested: boolean; status: ChatConversationStatus } | null>(null);
  const idempotencyRef = useRef<AssistantIdempotencyEntry | undefined>(undefined);

  useEffect(() => {
    // SECURITY: đăng nhập/đăng xuất/đổi tài khoản thì bỏ hội thoại của tài khoản trước khỏi bộ nhớ widget.
    const dropAccountConversation = () => {
      setAccountConversationId(undefined);
      setPending(null);
      setLastTurn(null);
      idempotencyRef.current = undefined;
    };
    window.addEventListener('dctd:auth-change', dropAccountConversation);
    return () => window.removeEventListener('dctd:auth-change', dropAccountConversation);
  }, []);

  const sessionKey = isAuthenticated ? null : anonymousSession?.sessionKey ?? null;
  const conversationId = isAuthenticated ? accountConversationId : anonymousSession?.conversationId;

  const forgetConversation = useCallback(() => {
    if (isAuthenticated) {
      setAccountConversationId(undefined);
    } else {
      anonymousAssistantSessionStore.clear();
      setAnonymousSession(undefined);
    }
    setLastTurn(null);
    idempotencyRef.current = undefined;
  }, [isAuthenticated]);

  const history = useListChatMessages(conversationId ?? '', HISTORY_PARAMS, {
    query: { enabled: enabled && isLoaded && Boolean(conversationId), retry: false },
    request: { headers: assistantRequestHeaders(sessionKey) },
  });

  const historyGone = history.isError && isAssistantConversationGone(history.error);
  useEffect(() => {
    // Hội thoại đã lưu không còn dùng được (hết hạn/đã đóng/không thuộc actor): dọn localStorage — hệ thống
    // ngoài React — để lần gửi sau tạo hội thoại mới thay vì kẹt ở lỗi lịch sử.
    if (historyGone) forgetConversation();
  }, [historyGone, forgetConversation]);

  const messages = useMemo(() => history.data?.items.map(toAssistantMessageView) ?? [], [history.data]);

  const sendTurn = useMutation<SendChatMessageResponseDto, unknown, string>({
    retry: false,
    mutationFn: async (content) => {
      let targetId = conversationId;
      let targetSessionKey = sessionKey;
      if (!targetId) {
        // Tạo hội thoại không nhận Idempotency-Key; nếu bước gửi sau đó lỗi, hội thoại vẫn được giữ để thử lại.
        const created = await createChatConversation({});
        targetId = created.id;
        if (isAuthenticated) {
          setAccountConversationId(created.id);
        } else if (created.sessionKey) {
          // SECURITY: sessionKey chỉ trả một lần (server chỉ lưu hash); mất nó là mất quyền đọc hội thoại.
          const session = { conversationId: created.id, sessionKey: created.sessionKey };
          anonymousAssistantSessionStore.write(session);
          setAnonymousSession(session);
          targetSessionKey = created.sessionKey;
        }
      }

      // IDEMPOTENCY: "Thử lại" cùng nội dung trên cùng hội thoại dùng lại khoá cũ để server trả lại lượt gốc thay vì
      // sinh lượt thứ hai sau timeout; nội dung mới (hoặc server yêu cầu đổi khoá) thì sinh khoá mới.
      idempotencyRef.current = resolveIdempotencyEntry(idempotencyRef.current, targetId, content, () =>
        crypto.randomUUID(),
      );
      return sendChatMessage(targetId, { content }, {
        headers: assistantRequestHeaders(targetSessionKey, idempotencyRef.current.key),
      });
    },
    onSuccess: (response) => {
      idempotencyRef.current = undefined;
      queryClient.setQueryData<ChatMessageListDto>(
        getListChatMessagesQueryKey(response.conversation.id, HISTORY_PARAMS),
        (current) => appendMessages(current, [response.userMessage, response.assistantMessage]),
      );
      setLastTurn({ handoffSuggested: response.handoffSuggested, status: response.conversation.status });
      setPending(null);
    },
    onError: (error, content) => {
      if (requiresFreshIdempotencyKey(error)) idempotencyRef.current = undefined;
      if (isAssistantConversationGone(error)) forgetConversation();
      setPending({ content, error });
    },
  });

  const send = useCallback(
    async (rawContent: string): Promise<boolean> => {
      const content = rawContent.trim();
      if (!content || content.length > ASSISTANT_MESSAGE_MAX_LENGTH || sendTurn.isPending) return false;
      setPending({ content, error: null });
      try {
        await sendTurn.mutateAsync(content);
        return true;
      } catch {
        return false;
      }
    },
    [sendTurn],
  );

  const feedback = useMutation<ChatMessageDto, unknown, { conversationId: string; messageId: string; value: AssistantFeedback }>({
    retry: false,
    mutationFn: ({ conversationId: id, messageId, value }) =>
      submitChatMessageFeedback(id, messageId, { feedback: value }, { headers: assistantRequestHeaders(sessionKey) }),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData<ChatMessageListDto>(
        getListChatMessagesQueryKey(variables.conversationId, HISTORY_PARAMS),
        (current) =>
          current && { ...current, items: current.items.map((message) => (message.id === updated.id ? updated : message)) },
      );
    },
  });

  const submitFeedback = useCallback(
    (messageId: string, value: AssistantFeedback) => {
      if (!conversationId || feedback.isPending) return;
      feedback.mutate({ conversationId, messageId, value });
    },
    [conversationId, feedback],
  );

  const isUnavailable =
    isAssistantUnavailable(history.error) || (pending?.error != null && isAssistantUnavailable(pending.error));

  return {
    isAuthenticated,
    conversationId,
    messages,
    isHistoryLoading: history.isLoading,
    historyError: history.isError && !isAssistantUnavailable(history.error) && !historyGone ? history.error : null,
    pending,
    isSending: sendTurn.isPending,
    isUnavailable,
    handoffSuggested: lastTurn?.handoffSuggested ?? false,
    isHandedOff: lastTurn?.status === 'HANDED_OFF',
    send,
    discardPending: () => {
      idempotencyRef.current = undefined;
      setPending(null);
    },
    submitFeedback,
    feedbackPendingId: feedback.isPending ? feedback.variables?.messageId ?? null : null,
    feedbackError: feedback.isError && !isAssistantUnavailable(feedback.error) ? feedback.error : null,
  };
}

export type AssistantChatState = ReturnType<typeof useAssistantChat>;
