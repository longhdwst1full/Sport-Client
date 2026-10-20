'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { FlashSaleInitialData } from '@/features/promotions';

/**
 * Query flash sale (TanStack + SDK) và khối deal tách chunk riêng, không tính vào First Load JS của `/`.
 * Vẫn SSR nên khi có chiến dịch HTML đầu đã có khối flash sale (LCP); lúc hydrate React giữ HTML server
 * tới khi chunk về. `loading` null giống `FlashSaleSection` (không giữ chỗ bằng skeleton).
 */
const HomeFlashSaleSlot = dynamic(
  () => import('./home-flash-sale-slot').then((module) => module.HomeFlashSaleSlot),
  { loading: () => null },
);

/**
 * Đầu trang chủ: có flash sale đang chạy thì khối flash sale đứng đầu, banner (slider CMS + thẻ khuyến
 * mãi) ngay dưới; không có thì chỉ banner. Banner luôn ở cùng vị trí nên không bị dựng lại khi khối
 * flash sale xuất hiện/biến mất.
 */
export function HomeTopSection({
  initialFlashSales,
  banner,
}: {
  initialFlashSales?: FlashSaleInitialData;
  banner: ReactNode;
}) {
  return (
    <>
      <HomeFlashSaleSlot initialFlashSales={initialFlashSales} />
      {banner}
    </>
  );
}
