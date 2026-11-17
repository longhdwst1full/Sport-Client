'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { FlashSaleInitialData } from '@/features/promotions';
import { FlashSaleSlotPlaceholder } from './flash-sale-slot-placeholder';

/**
 * Query flash sale (TanStack + SDK) và khối deal tách chunk riêng, không tính vào First Load JS của `/`.
 * Vẫn SSR nên khi có chiến dịch HTML đầu đã có khối flash sale (LCP).
 *
 * Hai bản chỉ khác `loading`, vì không biết trước lúc render:
 * - Server đã thấy chiến dịch → `loading` giữ chỗ đúng chiều cao khối, hero không nhảy khi chunk về.
 * - Không có chiến dịch (đa số thời gian) → `loading` null: không chừa khoảng trống nào.
 */
// `import()` viết thẳng trong từng `dynamic` (Next cần thấy nó để preload chunk cho SSR).
const HomeFlashSaleSlotWithPlaceholder = dynamic(
  () => import('./home-flash-sale-slot').then((module) => module.HomeFlashSaleSlot),
  { loading: () => <FlashSaleSlotPlaceholder /> },
);
const HomeFlashSaleSlotQuiet = dynamic(
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
  const hasInitialCampaign = initialFlashSales?.items.some((campaign) => campaign.items.length > 0) ?? false;
  const Slot = hasInitialCampaign ? HomeFlashSaleSlotWithPlaceholder : HomeFlashSaleSlotQuiet;
  return (
    <>
      <Slot initialFlashSales={initialFlashSales} />
      {banner}
    </>
  );
}
