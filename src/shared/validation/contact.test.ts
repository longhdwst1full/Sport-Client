import { describe, expect, it } from 'vitest';
import { emailError, isEmail, isVietnamesePhone, phoneError, toLocalVietnamesePhone } from './contact';

describe('isVietnamesePhone', () => {
  it.each(['0912345678', '0912 345 678', '091.234.5678', '+84912345678', '84912345678', '0084 912 345 678', '+84 0912345678', '0398765432', '02438251234'])(
    'chấp nhận %s',
    (value) => expect(isVietnamesePhone(value)).toBe(true),
  );

  it.each(['', '091234567', '09123456789', '0112345678', '0612345678', '1234567890', 'abc0912345678', '+1 415 555 0100'])(
    'từ chối %s',
    (value) => expect(isVietnamesePhone(value)).toBe(false),
  );

  it('chuẩn hoá về dạng 0xxxxxxxxx', () => {
    expect(toLocalVietnamesePhone('+84 912-345-678')).toBe('0912345678');
  });
});

describe('isEmail', () => {
  it.each(['an@example.com', ' an.nguyen+shop@mail.co.vn '])('chấp nhận %s', (v) => expect(isEmail(v)).toBe(true));
  it.each(['an@', 'an@example', 'an example@x.com', '@x.com', 'an@@x.com'])('từ chối %s', (v) => expect(isEmail(v)).toBe(false));
});

describe('thông báo lỗi', () => {
  it('SĐT bắt buộc, email tuỳ chọn', () => {
    expect(phoneError('')).toMatch(/nhập số điện thoại/);
    expect(phoneError('0912345678')).toBeUndefined();
    expect(emailError('')).toBeUndefined();
    expect(emailError('sai')).toMatch(/Email/);
  });
});
