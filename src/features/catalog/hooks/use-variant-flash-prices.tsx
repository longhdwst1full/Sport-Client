'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { VariantFlashPrice, VariantFlashPrices } from '../model/variant-flash-price';

/**
 * Giá flash đang mở theo `variantId`, cập nhật theo query flash sale phía client. Route group storefront
 * cấp dữ liệu (map từ `promotions`, vì `catalog` không import `promotions`).
 * `null` = chưa biết (SSR, chưa mount, query lỗi): nơi dùng giữ dữ liệu server hoặc giá niêm yết.
 */
const VariantFlashPriceContext = createContext<VariantFlashPrices | null>(null);

export function VariantFlashPriceProvider({ prices, children }: { prices: VariantFlashPrices | null; children: ReactNode }) {
  return <VariantFlashPriceContext.Provider value={prices}>{children}</VariantFlashPriceContext.Provider>;
}

export function useLiveVariantFlashPrices(): VariantFlashPrices | null {
  return useContext(VariantFlashPriceContext);
}

/** Giá flash còn hiệu lực của một biến thể (bỏ suất đã qua giờ kết thúc theo đồng hồ máy). */
export function activeFlashPrice(prices: VariantFlashPrices | null | undefined, variantId: string | null | undefined) {
  const flash: VariantFlashPrice | undefined = variantId ? prices?.[variantId] : undefined;
  return flash && flash.endsAtMs > Date.now() ? flash : undefined;
}
