'use client';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

/**
 * SECURITY/PRIVACY: query string có thể mang bí mật — `?token=` của email đặt lại mật khẩu, `vnp_*` (mã giao
 * dịch, số tiền, chữ ký) ở `/checkout/vnpay-return`. Vercel Analytics/Speed Insights ghi URL của mọi
 * pageview, nên chỉ gửi origin + path. `beforeSend` là hàm nên phải nằm trong client component.
 */
export function withoutQuery<T extends { url: string }>(event: T): T {
  try {
    const url = new URL(event.url);
    url.search = '';
    url.hash = '';
    return { ...event, url: url.toString() };
  } catch {
    return event;
  }
}

export function VercelInsights() {
  return (
    <>
      <Analytics beforeSend={withoutQuery} />
      <SpeedInsights beforeSend={withoutQuery} />
    </>
  );
}
