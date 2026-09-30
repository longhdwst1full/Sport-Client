import { GUEST_LOOKUP_CODE_LENGTH } from './guest-order-lookup.constants';

/** Chuẩn hoá mã OTP người dùng gõ/dán: chỉ giữ chữ số, tối đa 6 ký tự. */
export function normalizeLookupCode(value: string): string {
  return value.replace(/\D/g, '').slice(0, GUEST_LOOKUP_CODE_LENGTH);
}

/** Số giây còn phải chờ trước khi được gửi lại mã; 0 khi đã được gửi lại. */
export function resendSecondsLeft(cooldownUntil: number | null, now: number): number {
  if (cooldownUntil === null) return 0;
  return Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
}

