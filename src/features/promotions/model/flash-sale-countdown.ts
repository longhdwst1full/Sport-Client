/** Thời gian còn lại của chiến dịch, tách sẵn để hiển thị (ngày tách riêng khi còn >= 24 giờ). */
export interface FlashSaleCountdown {
  days: number;
  /** 0–23: phần giờ sau khi đã tách ngày. */
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
}

export const FLASH_SALE_COUNTDOWN_ZERO: FlashSaleCountdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  finished: true,
};

const SECONDS_PER_DAY = 86_400;

/** `remainingMs` = endsAt − giờ server hiện tại. Âm/0/không hợp lệ ⇒ đã kết thúc. */
export function splitRemaining(remainingMs: number): FlashSaleCountdown {
  if (!Number.isFinite(remainingMs) || remainingMs <= 0) return FLASH_SALE_COUNTDOWN_ZERO;
  const totalSeconds = Math.floor(remainingMs / 1000);
  if (totalSeconds <= 0) return FLASH_SALE_COUNTDOWN_ZERO;
  return {
    days: Math.floor(totalSeconds / SECONDS_PER_DAY),
    hours: Math.floor((totalSeconds % SECONDS_PER_DAY) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    finished: false,
  };
}

export function padTimeUnit(value: number): string {
  return String(value).padStart(2, '0');
}

/** Nhãn đọc màn hình, ví dụ "Còn 1 ngày 8 giờ 26 phút 15 giây". */
export function toCountdownLabel({ days, hours, minutes, seconds }: FlashSaleCountdown): string {
  const parts = [
    days > 0 ? `${days} ngày` : null,
    `${hours} giờ`,
    `${minutes} phút`,
    `${seconds} giây`,
  ].filter(Boolean);
  return `Còn ${parts.join(' ')}`;
}
