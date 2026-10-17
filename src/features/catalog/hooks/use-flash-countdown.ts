'use client';

import { useEffect, useState } from 'react';

export interface FlashCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function split(remainingMs: number): FlashCountdown {
  const total = Math.max(0, Math.floor(remainingMs / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/**
 * Đếm ngược tới `endsAtMs` theo đồng hồ máy, chỉ chạy sau khi mount: trả `null` lúc SSR/hydrate để
 * HTML server và client khớp (nơi gọi hiện giờ kết thúc tĩnh thay thế). Chỉ để hiển thị — giá flash
 * thật do checkout chốt theo giờ server.
 */
export function useFlashCountdown(endsAtMs: number | undefined): FlashCountdown | null {
  const [countdown, setCountdown] = useState<FlashCountdown | null>(null);

  useEffect(() => {
    if (!endsAtMs) {
      setCountdown(null);
      return;
    }
    const tick = () => setCountdown(split(endsAtMs - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endsAtMs]);

  return countdown;
}
