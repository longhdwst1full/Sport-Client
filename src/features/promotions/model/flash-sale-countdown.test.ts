import { describe, expect, it } from 'vitest';
import { FLASH_SALE_COUNTDOWN_ZERO, padTimeUnit, splitRemaining, toCountdownLabel } from './flash-sale-countdown';

const HOUR = 3_600_000;

describe('splitRemaining', () => {
  it('tách ngày khi còn từ 24 giờ (tạo hôm nay, kết thúc ngày mai)', () => {
    // 32 giờ 26 phút 15 giây
    const result = splitRemaining(32 * HOUR + 26 * 60_000 + 15_000);
    expect(result).toEqual({ days: 1, hours: 8, minutes: 26, seconds: 15, finished: false });
  });

  it('dưới 24 giờ thì không có ngày', () => {
    expect(splitRemaining(5 * HOUR + 1_500)).toEqual({ days: 0, hours: 5, minutes: 0, seconds: 1, finished: false });
  });

  it('hết giờ, âm hoặc NaN ⇒ đã kết thúc', () => {
    expect(splitRemaining(0)).toBe(FLASH_SALE_COUNTDOWN_ZERO);
    expect(splitRemaining(-1_000)).toBe(FLASH_SALE_COUNTDOWN_ZERO);
    expect(splitRemaining(999)).toBe(FLASH_SALE_COUNTDOWN_ZERO);
    expect(splitRemaining(Number.NaN)).toBe(FLASH_SALE_COUNTDOWN_ZERO);
  });

  it('khớp mốc ISO UTC của server bất kể múi giờ máy', () => {
    // Admin (UTC+7) chọn 17/10 15:30 → 18/10 23:59 giờ VN, gửi ISO UTC.
    const startsAt = new Date('2026-10-17T08:30:00.000Z').getTime();
    const endsAt = new Date('2026-10-18T16:59:00.000Z').getTime();
    expect(splitRemaining(endsAt - startsAt)).toMatchObject({ days: 1, hours: 8, minutes: 29, seconds: 0 });
  });
});

describe('format', () => {
  it('luôn 2 chữ số', () => {
    expect(padTimeUnit(0)).toBe('00');
    expect(padTimeUnit(7)).toBe('07');
    expect(padTimeUnit(59)).toBe('59');
  });

  it('nhãn đọc màn hình có ngày khi cần', () => {
    expect(toCountdownLabel(splitRemaining(32 * HOUR))).toBe('Còn 1 ngày 8 giờ 0 phút 0 giây');
    expect(toCountdownLabel(splitRemaining(HOUR))).toBe('Còn 1 giờ 0 phút 0 giây');
  });
});
