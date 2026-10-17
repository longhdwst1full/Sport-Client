'use client';

import type { ReactNode } from 'react';
import { FlashSaleSection, useFlashSaleCampaigns, type FlashSaleInitialData } from '@/features/promotions';

/**
 * Đầu trang chủ: có flash sale đang chạy thì khối flash sale đứng đầu, banner (slider CMS + thẻ khuyến
 * mãi) ngay dưới; không có thì chỉ banner.
 *
 * Server (ISR) quyết định lần render đầu từ `initialFlashSales` để HTML SSR đúng khối, không nháy
 * banner rồi đổi. Khi query client về thì theo dữ liệu mới nhất: chiến dịch đã đóng trong cửa sổ ISR
 * → trả lại banner, chiến dịch vừa mở → đưa flash sale lên.
 */
export function HomeTopSection({
  initialFlashSales,
  banner,
}: {
  initialFlashSales?: FlashSaleInitialData;
  banner: ReactNode;
}) {
  const { campaigns } = useFlashSaleCampaigns({ initialData: initialFlashSales });
  const hasFlashSale = campaigns.some((campaign) => campaign.deals.length > 0);

  if (!hasFlashSale) return banner;
  return (
    <>
      <FlashSaleSection initialData={initialFlashSales} aboveTheFold />
      {banner}
    </>
  );
}
