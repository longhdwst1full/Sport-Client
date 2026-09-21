'use client';

import { useMemo } from 'react';
import { useFlashSale } from './use-flash-sale';

export interface FlashSaleAvailability {
  /** Có chiến dịch đang chạy theo giờ server hay không. */
  hasCampaign: boolean;
  /** Mức giảm sâu nhất trong các suất đang mở; null khi không có suất nào giảm giá. */
  maxDiscountPercent: number | null;
  /** Còn đang tải thì chưa kết luận được — dùng để không nháy lối vào rồi lại ẩn đi. */
  isPending: boolean;
}

/**
 * Cho phép các lối vào Flash Sale (menu, banner, popup) chỉ hiện khi thật sự có chương trình.
 *
 * Trước đây các nút này là chữ cứng kèm mức giảm bịa sẵn ("-45%"), nên ngoài cửa hàng vẫn mời
 * khách bấm vào một trang trống khi không có chiến dịch nào chạy, và con số hiển thị không liên
 * quan gì tới giá thật.
 *
 * Dùng chung query với `useFlashSale`, nên react-query gộp lời gọi: thêm lối vào không tạo thêm
 * request nào.
 */
export function useFlashSaleAvailability(): FlashSaleAvailability {
  const { campaigns, isPending } = useFlashSale();

  return useMemo(() => {
    const discounts = campaigns
      .flatMap((campaign) => campaign.deals)
      .map((deal) => deal.discountPercent)
      .filter((percent): percent is number => percent !== null);
    return {
      hasCampaign: campaigns.some((campaign) => campaign.deals.length > 0),
      maxDiscountPercent: discounts.length > 0 ? Math.max(...discounts) : null,
      isPending,
    };
  }, [campaigns, isPending]);
}
