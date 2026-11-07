'use client';

import { createContext, useContext, type ReactNode } from 'react';

/** 0 = chưa biết hoặc Admin tắt luật → mọi nhắc miễn phí giao đều ẩn. */
const FreeShippingThresholdContext = createContext<number>(0);

/**
 * Route ghép ngưỡng miễn phí giao (`SHIPPING_FREE_ORDER_MIN_AMOUNT`, đọc ở `site-config`) vào giỏ/checkout:
 * `cart` là kernel nên không import `site-config` (xem ma trận feature trong CLAUDE.md).
 */
export function FreeShippingThresholdProvider({ threshold, children }: { threshold: number; children: ReactNode }) {
  return <FreeShippingThresholdContext.Provider value={threshold}>{children}</FreeShippingThresholdContext.Provider>;
}

export function useFreeShippingThreshold(): number {
  return useContext(FreeShippingThresholdContext);
}
