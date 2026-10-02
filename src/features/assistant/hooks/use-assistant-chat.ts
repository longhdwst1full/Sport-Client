'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomerAuth } from '@/features/auth';
import { clearGuestOrderLookupGrant, readLatestGuestOrderLookupGrant } from '@/features/orders';
import {
  createChatConversation,
  getListChatMessagesQueryKey,
  listChatMessages,
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
import {
  ASSISTANT_HISTORY_PAGE_SIZE,
  ASSISTANT_MESSAGE_MAX_LENGTH,
  ASSISTANT_SEND_TIMEOUT_MS,
  ASSISTANT_TURN_POLL,
} from '../model/assistant.constants';
import { toAssistantMessageView } from '../model/assistant.mapper';
import {
  anonymousAssistantSessionStore,
  type AnonymousAssistantSession,
} from '../model/assistant-session.store';
import {
  assistantRequestHeaders,
  isAssistantConversationGone,
  isAssistantOrderLookupTokenInvalid,
  isAssistantTurnInProgress,
  isAssistantUnavailable,
  requiresFreshIdempotencyKey,
} from '../model/assistant-error';
import { resolveIdempotencyEntry, type AssistantIdempotencyEntry } from '../model/assistant-idempotency';
import type { AssistantFeedback } from '../model/assistant.types';
import { mentionsOrder } from '../model/assistant-order-intent';

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

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Trang mới nhất đã có câu trả lời cho tin USER cuối cùng (tin vừa gửi — widget chỉ gửi tuần tự từng tin). */
function lastUserMessageAnswered(page: ChatMessageListDto): boolean {
  const lastUser = page.items.map((item) => item.role).lastIndexOf('USER');
  return lastUser >= 0 && page.items.slice(lastUser + 1).some((item) => item.role === 'ASSISTANT');
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

  // Grant tra đơn OTP của tab (sessionStorage). Đọc lại mỗi khi mở panel/đổi phiên/sau lỗi token.
  const [grantRevision, setGrantRevision] = useState(0);
  const orderLookupGrant = useMemo(
    () => (isAuthenticated ? null : readLatestGuestOrderLookupGrant()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, enabled, grantRevision],
  );

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
      // SECURITY: grant tra đơn chỉ gửi qua header `x-order-lookup-token`, chỉ khi khách ẩn danh; đọc tại thời điểm
      // gửi để lấy grant mới nhất (khách có thể vừa xác thực đơn ở tab này). Không bao giờ chèn vào `content`.
      const lookupToken = isAuthenticated ? null : readLatestGuestOrderLookupGrant()?.lookupToken ?? null;
      const headers = assistantRequestHeaders(targetSessionKey, idempotencyRef.current.key, lookupToken);
      // Lượt chat (LLM + tool) dài hơn timeout 10 giây mặc định của transport; chỉ lời gọi này nới trần.
      const submit = () => sendChatMessage(targetId, { content }, { headers, timeout: ASSISTANT_SEND_TIMEOUT_MS });
      try {
        return await submit();
      } catch (error) {
        if (!isAssistantTurnInProgress(error)) throw error;
      }
      // IDEMPOTENCY: lượt cùng khoá đang chạy (thường do lần gửi trước bị timeout phía client). Giữ khoá, hỏi lại lịch
      // sử tới khi tin USER cuối đã có câu trả lời (hoặc hết trần chờ), rồi gửi lại CÙNG khoá: API replay lượt gốc,
      // hoặc chạy lại lượt kẹt — không sinh lượt thứ hai, không trừ quota lần nữa.
      const deadline = Date.now() + ASSISTANT_TURN_POLL.MAX_WAIT_MS;
      while (Date.now() < deadline) {
        await wait(ASSISTANT_TURN_POLL.INTERVAL_MS);
        try {
          const page = await listChatMessages(targetId, HISTORY_PARAMS, {
            headers: assistantRequestHeaders(targetSessionKey),
          });
          if (lastUserMessageAnswered(page)) break;
        } catch {
          // Lỗi tạm thời khi hỏi lịch sử: thử lại ở vòng sau, trần chờ vẫn giữ nguyên.
        }
      }
      return submit();
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
      if (isAssistantOrderLookupTokenInvalid(error)) {
        // Grant sai định dạng: bỏ để lần "Thử lại" không gửi lại token hỏng.
        const grant = readLatestGuestOrderLookupGrant();
        if (grant) clearGuestOrderLookupGrant(grant.orderNo);
        setGrantRevision((value) => value + 1);
      }
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
    /** Khách ẩn danh hỏi về đơn mà tab chưa có grant tra cứu: mời xác thực đơn bằng email. */
    suggestOrderLookup:
      !isAuthenticated &&
      !orderLookupGrant &&
      mentionsOrder(pending?.content ?? [...messages].reverse().find((message) => message.role === 'USER')?.content),
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
