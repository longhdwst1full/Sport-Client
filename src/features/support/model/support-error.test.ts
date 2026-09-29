import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/api/fetcher';
import { isSupportConflict, SupportErrorCode, supportErrorCode, supportErrorMessage } from './support-error';

const err = (status: number, code?: string, message?: string) => new ApiError(status, { code, message });

describe('supportErrorMessage', () => {
  it.each(Object.values(SupportErrorCode))('%s có thông điệp riêng, bỏ qua message backend', (code) => {
    const text = supportErrorMessage(err(400, code, 'backend'), 'fb');
    expect(text).not.toBe('backend');
    expect(text).not.toBe('fb');
  });

  it('VERSION_CONFLICT và CONCURRENT_UPDATE cùng thông điệp', () => {
    expect(supportErrorMessage(err(409, SupportErrorCode.VERSION_CONFLICT), 'fb')).toBe(
      supportErrorMessage(err(409, SupportErrorCode.CONCURRENT_UPDATE), 'fb'),
    );
  });

  it('400 SUPPORT_BRANCH_INVALID có thông điệp tiếng Việt, không dùng message backend', () => {
    expect(supportErrorMessage(err(400, SupportErrorCode.BRANCH_INVALID), 'fb')).toContain('Chi nhánh');
  });

  it('503 không mã dùng thông điệp persistence tắt', () => {
    expect(supportErrorMessage(new ApiError(503, {}), 'fb')).toBe(
      supportErrorMessage(err(503, SupportErrorCode.PERSISTENCE_DISABLED), 'fb'),
    );
  });

  it('mã lạ dùng message backend, không có thì fallback', () => {
    expect(supportErrorMessage(err(400, 'LA', 'từ backend'), 'fb')).toBe('từ backend');
    expect(supportErrorMessage(new Error('x'), 'fb')).toBe('fb');
  });
});

describe('supportErrorCode / isSupportConflict', () => {
  it('đọc code; lỗi không phải ApiError là undefined', () => {
    expect(supportErrorCode(err(404, SupportErrorCode.TICKET_NOT_FOUND))).toBe('SUPPORT_TICKET_NOT_FOUND');
    expect(supportErrorCode(new Error('x'))).toBeUndefined();
  });

  it('conflict gồm VERSION_CONFLICT, CONCURRENT_UPDATE, TICKET_CLOSED', () => {
    expect(isSupportConflict(err(409, SupportErrorCode.VERSION_CONFLICT))).toBe(true);
    expect(isSupportConflict(err(409, SupportErrorCode.CONCURRENT_UPDATE))).toBe(true);
    expect(isSupportConflict(err(409, SupportErrorCode.TICKET_CLOSED))).toBe(true);
    expect(isSupportConflict(err(404, SupportErrorCode.TICKET_NOT_FOUND))).toBe(false);
  });
});
