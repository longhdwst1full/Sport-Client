import { createBrowserStore, LocalStorageKey } from '@/core/storage';

/** Hội thoại của khách ẩn danh; khách đăng nhập không lưu gì vào storage. */
export type AnonymousAssistantSession = { conversationId: string; sessionKey: string };

function parseSession(raw: unknown): AnonymousAssistantSession | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const { conversationId, sessionKey } = raw as Record<string, unknown>;
  return typeof conversationId === 'string' && conversationId && typeof sessionKey === 'string' && sessionKey
    ? { conversationId, sessionKey }
    : undefined;
}

/**
 * SECURITY: `sessionKey` là bằng chứng sở hữu hội thoại ẩn danh (server cấp một lần). Chỉ lưu localStorage
 * theo yêu cầu V1.0; `createBrowserStore` bọc mọi truy cập trong try/catch (private mode, quota, bản ghi hỏng).
 */
export const anonymousAssistantSessionStore = createBrowserStore<AnonymousAssistantSession>(
  LocalStorageKey.ASSISTANT_SESSION,
  { parse: parseSession },
);
