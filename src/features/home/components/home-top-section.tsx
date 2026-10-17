'use client';

import type { ReactNode } from 'react';
import { FlashSaleSection, useFlashSaleCampaigns, type FlashSaleInitialData } from '@/features/promotions';

/**
 * Đầu trang chủ: có flash sale đang chạy thì khối flash sale thay hẳn banner, không thì hiện `banner`.
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

  return hasFlashSale ? <FlashSaleSection initialData={initialFlashSales} aboveTheFold /> : banner;
}
