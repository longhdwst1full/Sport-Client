import { describe, expect, it } from 'vitest';
import { CONTACT_ERROR } from '@/shared/validation';
import { validateLogin, validateRegister } from './auth-form.validation';

const messages = (errors: Record<string, { message?: string } | undefined>) =>
  Object.fromEntries(Object.entries(errors).map(([field, error]) => [field, error?.message]));

describe('validateLogin', () => {
  it('trim định danh và trả giá trị đã chuẩn hoá khi hợp lệ', () => {
    expect(validateLogin({ identifier: '  a@b.vn ', password: '12345678', rememberMe: true })).toEqual({
      values: { identifier: 'a@b.vn', password: '12345678', rememberMe: true },
      errors: {},
    });
  });

  it('báo lỗi từng ô: thiếu định danh (chỉ khoảng trắng), mật khẩu ngắn/dài', () => {
    expect(messages(validateLogin({ identifier: '   ', password: '' }).errors)).toEqual({
      identifier: 'Vui lòng nhập email hoặc số điện thoại',
      password: 'Vui lòng nhập mật khẩu',
    });
    expect(messages(validateLogin({ identifier: 'x', password: '1234567' }).errors)).toEqual({
      password: 'Mật khẩu tối thiểu 8 ký tự',
    });
    expect(messages(validateLogin({ identifier: 'x'.repeat(256), password: 'p'.repeat(129) }).errors)).toEqual({
      identifier: 'Tối đa 255 ký tự',
      password: 'Mật khẩu tối đa 128 ký tự',
    });
  });
});

describe('validateRegister', () => {
  const base = { displayName: ' Nguyễn A ', email: '', phone: '', password: '12345678' };

  it('email/SĐT rỗng → undefined (không gửi), trim họ tên', () => {
    expect(validateRegister({ ...base, phone: ' 0912345678 ' })).toEqual({
      values: { displayName: 'Nguyễn A', email: undefined, phone: '0912345678', password: '12345678' },
      errors: {},
    });
  });

  it('thiếu cả email lẫn SĐT: báo ở ô email', () => {
    expect(messages(validateRegister(base).errors)).toEqual({ email: 'Vui lòng cung cấp email hoặc số điện thoại' });
  });

  it('email/SĐT sai định dạng và thiếu họ tên', () => {
    expect(messages(validateRegister({ ...base, displayName: '  ', email: 'abc', phone: '123' }).errors)).toEqual({
      displayName: 'Vui lòng nhập họ và tên của bạn',
      email: CONTACT_ERROR.EMAIL_INVALID,
      phone: CONTACT_ERROR.PHONE_INVALID,
    });
  });

  it('chỉ có email hợp lệ là đủ', () => {
    expect(validateRegister({ ...base, email: 'a@b.vn' }).errors).toEqual({});
  });
});
