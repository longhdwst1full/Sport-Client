// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalStorageKey } from '@/core/storage';
import { anonymousAssistantSessionStore } from './assistant-session.store';

const session = { conversationId: '12', sessionKey: 'abc' };

describe('anonymousAssistantSessionStore', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('ghi rồi đọc lại và xoá được', () => {
    expect(anonymousAssistantSessionStore.write(session)).toBe(true);
    expect(anonymousAssistantSessionStore.read()).toEqual(session);
    anonymousAssistantSessionStore.clear();
    expect(anonymousAssistantSessionStore.read()).toBeUndefined();
  });

  it('bản ghi hỏng hoặc thiếu field bị bỏ qua', () => {
    window.localStorage.setItem(LocalStorageKey.ASSISTANT_SESSION, '{not json');
    expect(anonymousAssistantSessionStore.read()).toBeUndefined();
    window.localStorage.setItem(LocalStorageKey.ASSISTANT_SESSION, JSON.stringify({ conversationId: '1' }));
    expect(anonymousAssistantSessionStore.read()).toBeUndefined();
    window.localStorage.setItem(LocalStorageKey.ASSISTANT_SESSION, JSON.stringify({ conversationId: '', sessionKey: 'k' }));
    expect(anonymousAssistantSessionStore.read()).toBeUndefined();
  });

  it('storage ném lỗi (quota/private mode) không làm crash', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('denied');
    });
    expect(anonymousAssistantSessionStore.write(session)).toBe(false);
    expect(() => anonymousAssistantSessionStore.read()).not.toThrow();
    expect(() => anonymousAssistantSessionStore.clear()).not.toThrow();
  });

  it('truy cập window.localStorage ném lỗi thì read/write/clear vẫn an toàn', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(anonymousAssistantSessionStore.read()).toBeUndefined();
    expect(anonymousAssistantSessionStore.write(session)).toBe(false);
    expect(() => anonymousAssistantSessionStore.clear()).not.toThrow();
  });
});
