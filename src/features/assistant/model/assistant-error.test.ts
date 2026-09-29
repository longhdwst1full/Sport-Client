import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/api/fetcher';
import { ASSISTANT_COPY, ASSISTANT_HEADERS, AssistantErrorCode } from './assistant.constants';
import {
  assistantErrorCode,
  assistantErrorMessage,
  assistantRequestHeaders,
  isAssistantConversationGone,
  isAssistantQuotaExceeded,
  isAssistantUnavailable,
  requiresFreshIdempotencyKey,
} from './assistant-error';

const err = (status: number, code?: string, message?: string) => new ApiError(status, { code, message });

describe('assistantErrorCode', () => {
  it('đọc code từ payload ApiError; lỗi khác hoặc payload thiếu code là undefined', () => {
    expect(assistantErrorCode(err(400, 'X'))).toBe('X');
    expect(assistantErrorCode(new ApiError(500, undefined))).toBeUndefined();
    expect(assistantErrorCode(new ApiError(500, { code: 5 }))).toBeUndefined();
    expect(assistantErrorCode(new Error('x'))).toBeUndefined();
  });
});

describe('isAssistantUnavailable', () => {
  it('503 ASSISTANT_UNAVAILABLE là trạng thái tạm ngưng', () => {
    expect(isAssistantUnavailable(err(503, AssistantErrorCode.UNAVAILABLE))).toBe(true);
    expect(assistantErrorMessage(err(503, AssistantErrorCode.UNAVAILABLE))).toBe(ASSISTANT_COPY.unavailableTitle);
  });

  it('503 khác mã, hoặc đúng mã nhưng status khác, không phải tạm ngưng', () => {
    expect(isAssistantUnavailable(err(503, 'OTHER'))).toBe(false);
    expect(isAssistantUnavailable(err(500, AssistantErrorCode.UNAVAILABLE))).toBe(false);
    expect(isAssistantUnavailable(null)).toBe(false);
  });
});

describe('assistantErrorMessage', () => {
  it('quota: theo mã và theo HTTP 429 đều ra thông điệp hết lượt', () => {
    const byCode = assistantErrorMessage(err(429, AssistantErrorCode.QUOTA_EXCEEDED));
    expect(byCode).toContain('hết lượt');
    expect(assistantErrorMessage(new ApiError(429, {}))).toBe(byCode);
  });

  it('CUSTOMER_PROFILE_REQUIRED (không phải khách hoặc khách bị khoá) có thông điệp riêng', () => {
    expect(assistantErrorMessage(err(403, AssistantErrorCode.CUSTOMER_PROFILE_REQUIRED))).toContain('chưa dùng được trợ lý');
  });

  it('quota với khách ẩn danh mời đăng nhập; khách đăng nhập giữ thông điệp hết lượt', () => {
    const quota = err(429, AssistantErrorCode.QUOTA_EXCEEDED);
    expect(isAssistantQuotaExceeded(quota)).toBe(true);
    expect(assistantErrorMessage(quota, undefined, { isAuthenticated: false })).toContain('Đăng nhập');
    expect(assistantErrorMessage(quota, undefined, { isAuthenticated: true })).toContain('hết lượt');
    expect(assistantErrorMessage(quota, undefined, { isAuthenticated: true })).not.toContain('Đăng nhập');
    expect(isAssistantQuotaExceeded(err(400, 'OTHER'))).toBe(false);
  });

  it.each([
    [AssistantErrorCode.CONTENT_INVALID, 'ký tự không hợp lệ'],
    [AssistantErrorCode.INVALID_BRANCH, 'Chi nhánh'],
  ])('%s (400) có thông điệp tiếng Việt riêng', (code, fragment) => {
    expect(assistantErrorMessage(err(400, code, 'english backend message'))).toContain(fragment);
  });

  it('mã lạ dùng message của backend, không có thì dùng fallback', () => {
    expect(assistantErrorMessage(err(400, 'LA', 'từ backend'))).toBe('từ backend');
    expect(assistantErrorMessage(new Error('x'))).toBe(ASSISTANT_COPY.sendError);
    expect(assistantErrorMessage(new Error('x'), 'fb')).toBe('fb');
  });
});

describe('isAssistantConversationGone', () => {
  it.each([
    AssistantErrorCode.CONVERSATION_NOT_FOUND,
    AssistantErrorCode.SESSION_REQUIRED,
    AssistantErrorCode.CONVERSATION_CLOSED,
  ])('%s làm mất hội thoại đang nhớ', (code) => {
    expect(isAssistantConversationGone(err(404, code))).toBe(true);
  });

  it.each([AssistantErrorCode.QUOTA_EXCEEDED, AssistantErrorCode.TURN_IN_PROGRESS, AssistantErrorCode.UNAVAILABLE])(
    '%s không xoá hội thoại',
    (code) => {
      expect(isAssistantConversationGone(err(409, code))).toBe(false);
    },
  );
});

describe('requiresFreshIdempotencyKey', () => {
  it('TURN_IN_PROGRESS và IDEMPOTENCY_KEY_REUSED cần khoá mới', () => {
    expect(requiresFreshIdempotencyKey(err(409, AssistantErrorCode.TURN_IN_PROGRESS))).toBe(true);
    expect(requiresFreshIdempotencyKey(err(409, AssistantErrorCode.IDEMPOTENCY_KEY_REUSED))).toBe(true);
    expect(requiresFreshIdempotencyKey(err(500, 'OTHER'))).toBe(false);
  });
});

describe('assistantRequestHeaders', () => {
  it('chỉ gắn header khi có giá trị', () => {
    expect(assistantRequestHeaders(null)).toEqual({});
    expect(assistantRequestHeaders('sk', 'ik')).toEqual({
      [ASSISTANT_HEADERS.SESSION]: 'sk',
      [ASSISTANT_HEADERS.IDEMPOTENCY]: 'ik',
    });
    expect(assistantRequestHeaders(undefined, 'ik')).toEqual({ [ASSISTANT_HEADERS.IDEMPOTENCY]: 'ik' });
  });
});
