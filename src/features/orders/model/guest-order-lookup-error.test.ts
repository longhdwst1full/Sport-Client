import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/api/fetcher';
import { GuestLookupErrorCode } from './guest-order-lookup.constants';
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

  it('LOCKED buộc gửi mã mới', () => {
    expect(isGuestLookupLocked(err(429, GuestLookupErrorCode.LOCKED))).toBe(true);
    expect(isGuestLookupLocked(err(400, GuestLookupErrorCode.INVALID))).toBe(false);
  });
});
