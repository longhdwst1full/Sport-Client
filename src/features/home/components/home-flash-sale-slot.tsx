'use client';

import { FlashSaleSectionLazy, useFlashSaleCampaigns, type FlashSaleInitialData } from '@/features/promotions';

/**
 * Khối flash sale đầu trang chủ. Server (ISR) quyết định lần render đầu từ `initialFlashSales` để HTML
 * SSR đúng khối, không nháy banner rồi đổi. Khi query client về thì theo dữ liệu mới nhất: chiến dịch
 * đã đóng trong cửa sổ ISR → ẩn khối, chiến dịch vừa mở → hiện khối.
 */
export function HomeFlashSaleSlot({ initialFlashSales }: { initialFlashSales?: FlashSaleInitialData }) {
  const { campaigns } = useFlashSaleCampaigns({ initialData: initialFlashSales });
  const hasFlashSale = campaigns.some((campaign) => campaign.deals.length > 0);

  return hasFlashSale ? <FlashSaleSectionLazy initialData={initialFlashSales} aboveTheFold /> : null;
}
