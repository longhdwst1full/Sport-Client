'use client';

import type { ReactNode } from 'react';
import { FreeShippingThresholdProvider } from '@/features/cart';
import { useFreeShippingMinAmount } from '@/features/site-config';

/** Nối tham số công khai `SHIPPING_FREE_ORDER_MIN_AMOUNT` (`site-config`) vào giỏ/checkout (`cart`). */
export function FreeShippingBridge({ children }: { children: ReactNode }) {
  const threshold = useFreeShippingMinAmount();
  return <FreeShippingThresholdProvider threshold={threshold}>{children}</FreeShippingThresholdProvider>;
}
