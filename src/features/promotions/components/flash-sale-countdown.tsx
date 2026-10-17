import { Fragment } from 'react';
import { padTimeUnit, toCountdownLabel, type FlashSaleCountdown } from '../model/flash-sale-countdown';

type Tone = 'onBrand' | 'light';

const TONE: Record<Tone, { box: string; unit: string; sep: string }> = {
  // Trên dải đỏ thương hiệu (khối trang chủ).
  onBrand: {
    box: 'bg-white text-brand-700 ring-1 ring-black/5 shadow-sm',
    unit: 'text-white/75',
    sep: 'text-white/60',
  },
  // Trên nền trắng (trang /flash-sale).
  light: {
    box: 'bg-ink text-white shadow-sm',
    unit: 'text-neutral-500',
    sep: 'text-neutral-300',
  },
};

/**
 * Đồng hồ đếm ngược dạng ô số. Còn >= 24 giờ thì tách ô "Ngày" để không hiện "32 giờ"; mọi ô luôn
 * 2 chữ số và `tabular-nums` để không giật bề ngang khi số đổi mỗi giây.
 */
export function FlashSaleCountdownTimer({
  countdown,
  tone,
  className = '',
}: {
  countdown: FlashSaleCountdown;
  tone: Tone;
  className?: string;
}) {
  const styles = TONE[tone];
  const segments = [
    ...(countdown.days > 0 ? [{ key: 'd', value: String(countdown.days), unit: 'Ngày' }] : []),
    { key: 'h', value: padTimeUnit(countdown.hours), unit: 'Giờ' },
    { key: 'm', value: padTimeUnit(countdown.minutes), unit: 'Phút' },
    { key: 's', value: padTimeUnit(countdown.seconds), unit: 'Giây' },
  ];

  return (
    <div role="timer" aria-label={toCountdownLabel(countdown)} className={`flex items-start gap-1 sm:gap-1.5 ${className}`}>
      {segments.map((segment, index) => (
        <Fragment key={segment.key}>
          {index > 0 ? (
            <span aria-hidden="true" className={`pt-1.5 text-base font-bold leading-none sm:pt-2 sm:text-lg ${styles.sep}`}>
              :
            </span>
          ) : null}
          <span aria-hidden="true" className="flex flex-col items-center gap-1">
            <span
              className={`grid h-9 min-w-9 place-items-center rounded-lg px-1.5 text-base font-bold tabular-nums leading-none sm:h-10 sm:min-w-10 sm:text-lg ${styles.box}`}
            >
              {segment.value}
            </span>
            <span className={`text-3xs font-semibold uppercase ${styles.unit}`}>{segment.unit}</span>
          </span>
        </Fragment>
      ))}
    </div>
  );
}
