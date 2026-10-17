'use client';

import { useMemo, type ReactNode } from 'react';
import { CartPromoPriceProvider } from '@/features/cart';
import { VariantFlashPriceProvider } from '@/features/catalog';
import { toVariantFlashPriceMap, toVariantFlashQuotaMap, useFlashSaleCampaigns } from '@/features/promotions';

/**
 * Nối giá flash (`promotions`) vào thẻ sản phẩm/trang chi tiết (`catalog`) và giỏ/checkout (`cart`) — các
 * feature không import nhau nên route group ghép. Dùng chung query flash sale với header, không thêm request.
 * Chưa có dữ liệu hoặc query lỗi → `null` để nơi dùng giữ dữ liệu server/giá niêm yết.
 */
export function FlashPriceBridge({ children }: { children: ReactNode }) {
  const { campaigns, isPending, isError } = useFlashSaleCampaigns();
  const unknown = isPending || isError;
  const prices = useMemo(() => (unknown ? null : toVariantFlashPriceMap(campaigns)), [campaigns, unknown]);
  const quotas = useMemo(() => (unknown ? null : toVariantFlashQuotaMap(campaigns)), [campaigns, unknown]);
  return (
    <VariantFlashPriceProvider prices={prices}>
      <CartPromoPriceProvider prices={quotas}>{children}</CartPromoPriceProvider>
    </VariantFlashPriceProvider>
  );
}
