import { describe, expect, it } from 'vitest';
import { normalizeLookupCode, resendSecondsLeft } from './guest-order-lookup';

describe('normalizeLookupCode', () => {
  it('chỉ giữ chữ số, tối đa 6 ký tự (dán kèm khoảng trắng/gạch)', () => {
    expect(normalizeLookupCode(' 04-29 13 ')).toBe('042913');
    expect(normalizeLookupCode('1234567')).toBe('123456');
    expect(normalizeLookupCode('abc')).toBe('');
  });
});

describe('resendSecondsLeft', () => {
  it('đếm ngược theo giây, làm tròn lên, không âm', () => {
    expect(resendSecondsLeft(null, 1000)).toBe(0);
    expect(resendSecondsLeft(61_000, 1_000)).toBe(60);
    expect(resendSecondsLeft(61_000, 60_500)).toBe(1);
    expect(resendSecondsLeft(61_000, 61_000)).toBe(0);
    expect(resendSecondsLeft(61_000, 99_000)).toBe(0);
  });
});
