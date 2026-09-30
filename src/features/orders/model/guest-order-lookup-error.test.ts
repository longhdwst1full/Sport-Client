import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/api/fetcher';
import { GUEST_LOOKUP_INVALID_MESSAGE, GuestLookupErrorCode } from './guest-order-lookup.constants';
import {
  guestLookupErrorCode,
  guestLookupErrorMessage,
  isGuestLookupLocked,
  isGuestLookupTokenInvalid,
} from './guest-order-lookup-error';

const err = (status: number, code?: string, message?: string) => new ApiError(status, { code, message });

describe('guestLookupErrorMessage', () => {
  it.each(Object.values(GuestLookupErrorCode))('%s có thông điệp tiếng Việt, không dùng message backend', (code) => {
    const text = guestLookupErrorMessage(err(400, code, 'backend'), 'fb');
    expect(text).not.toBe('backend');
    expect(text).not.toBe('fb');
  });

  it('429 không mã (throttle IP) là "thử lại sau"', () => {
    expect(guestLookupErrorMessage(new ApiError(429, {}), 'fb')).toContain('thử lại');
  });

  it('503 không mã là "tạm ngưng"', () => {
    expect(guestLookupErrorMessage(new ApiError(503, {}), 'fb')).toContain('tạm ngưng');
  });

  // SECURITY: đây là bất biến chính của luồng tra cứu. Sai mã, mã hết hạn, hết lượt thử và cặp (mã đơn, email)
  // không tồn tại đều phải ra đúng một câu; nếu không, kẻ tấn công dò được đơn nào có thật.
  it('mọi thất bại verify — sai mã, hết hạn, hết lượt, backend cũ — cùng một câu duy nhất', () => {
    const messages = [
      guestLookupErrorMessage(err(400, GuestLookupErrorCode.INVALID, 'wrong code'), 'fb'),
      guestLookupErrorMessage(err(400, GuestLookupErrorCode.INVALID, 'challenge expired'), 'fb'),
      guestLookupErrorMessage(err(400, GuestLookupErrorCode.INVALID, 'no such order'), 'fb'),
      guestLookupErrorMessage(err(429, GuestLookupErrorCode.LOCKED_LEGACY, 'too many attempts'), 'fb'),
    ];
    expect(new Set(messages).size).toBe(1);
    expect(messages[0]).toBe(GUEST_LOOKUP_INVALID_MESSAGE);
  });

  it('câu chung không khẳng định mã sai cũng không khẳng định đơn tồn tại', () => {
    expect(GUEST_LOOKUP_INVALID_MESSAGE).toContain('gửi mã mới');
    expect(GUEST_LOOKUP_INVALID_MESSAGE).not.toMatch(/không tồn tại|không tìm thấy đơn|sai quá số lần/i);
  });

  it('lỗi lạ dùng message backend hoặc fallback', () => {
    expect(guestLookupErrorMessage(err(400, 'X', 'từ backend'), 'fb')).toBe('từ backend');
    expect(guestLookupErrorMessage(new Error('network'), 'fb')).toBe('fb');
  });
});

describe('phân loại lỗi', () => {
  it('đọc code; lỗi không phải ApiError là undefined', () => {
    expect(guestLookupErrorCode(err(400, GuestLookupErrorCode.INVALID))).toBe('GUEST_LOOKUP_INVALID');
    expect(guestLookupErrorCode(new Error('x'))).toBeUndefined();
  });

  it('TOKEN_INVALID hoặc 401 là grant hết hạn', () => {
    expect(isGuestLookupTokenInvalid(err(401, GuestLookupErrorCode.TOKEN_INVALID))).toBe(true);
    expect(isGuestLookupTokenInvalid(new ApiError(401, {}))).toBe(true);
    expect(isGuestLookupTokenInvalid(err(400, GuestLookupErrorCode.INVALID))).toBe(false);
  });

  it('LOCKED của backend cũ buộc gửi mã mới; backend mới (INVALID) cho nhập lại', () => {
    expect(isGuestLookupLocked(err(429, GuestLookupErrorCode.LOCKED_LEGACY))).toBe(true);
    // API đã hardening gộp "hết lượt" vào INVALID ⇒ không còn khoá ô nhập phía client.
    expect(isGuestLookupLocked(err(400, GuestLookupErrorCode.INVALID))).toBe(false);
  });
});
