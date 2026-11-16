'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsMounted } from '@/shared/hooks';
import { useListPublicFlashSales } from '@/generated/api/promotions/promotions';
import type { PublicFlashSaleListDto } from '@/generated/api/promotions/promotions.schemas';
import {
  toFlashSaleCampaignView,
  type FlashSaleCampaignView,
} from '../model/flash-sale.mapper';
import {
  FLASH_SALE_COUNTDOWN_ZERO,
  splitRemaining,
  type FlashSaleCountdown,
} from '../model/flash-sale-countdown';

export type { FlashSaleCountdown } from '../model/flash-sale-countdown';

/**
 * Dữ liệu chiến dịch, KHÔNG có đồng hồ — cho lối vào (header, menu, banner) chỉ cần biết có chương
 * trình hay không. Tách khỏi đồng hồ để header không render lại mỗi giây.
 *
 * Mọi component dùng chung một query key nên react-query chỉ gọi mạng một lần cho cả trang.
 * `staleTime` 60 giây + không refetch khi quay lại tab: header có mặt ở mọi trang, nên mặc định
 * (30 giây, refetch khi focus) làm mỗi lần chuyển trang/chuyển tab là một lượt gọi. Số suất còn lại
 * không cần chính xác từng giây ở đây — giá và suất luôn được server chốt lại ở bước báo giá checkout;
 * hết giờ thì `useFlashSale` chủ động refetch.
 */
export function useFlashSaleCampaigns({
  live = false,
  initialData,
}: {
  live?: boolean;
  /**
   * Danh sách server lấy sẵn (trang chủ, ISR) để HTML SSR có khối flash sale thay vì trống tới khi
   * query client chạy. Chỉ dùng tới khi query có dữ liệu thật; không ghi vào cache vì header đã tạo
   * query trước. `serverTime` của nó có thể cũ theo ISR nên không dùng chỉnh đồng hồ.
   */
  initialData?: PublicFlashSaleListDto;
} = {}): {
  campaigns: FlashSaleCampaignView[];
  serverTime: string | undefined;
  refetch: () => Promise<unknown>;
  isPending: boolean;
  isError: boolean;
} {
  const isMounted = useIsMounted();

  const query = useListPublicFlashSales({
    // `live`: nơi hiển thị suất/đồng hồ (khối và trang flash sale) vẫn cập nhật khi khách quay lại tab.
    query: { enabled: isMounted, staleTime: live ? 30_000 : 60_000, refetchOnWindowFocus: live },
  });
  const source = query.data ?? initialData;
  const campaigns = useMemo(() => (source?.items ?? []).map(toFlashSaleCampaignView), [source]);
  const { refetch } = query;
  // `cancelRefetch: false`: nhiều đồng hồ cùng chạm 0 trong một giây thì dùng chung lượt đang bay,
  // không huỷ lượt kia rồi gọi lại (mặc định của react-query sinh ra N request cho N component).
  const refetchShared = useCallback(() => refetch({ cancelRefetch: false }), [refetch]);

  return {
    campaigns,
    serverTime: query.data?.serverTime,
    refetch: refetchShared,
    isPending: query.isPending,
    isError: query.isError,
  };
}

/**
 * Chiến dịch flash sale cho nơi HIỂN THỊ (khối flash sale, trang flash sale). KHÔNG giữ đồng hồ: state đổi
 * mỗi giây làm render lại cả khối và mọi thẻ deal; đồng hồ nằm ở `FlashSaleLiveCountdown` (chỉ nó render
 * lại mỗi giây, xem `useFlashSaleCountdown`). Hết giờ thì đồng hồ gọi `retry` để server xác nhận lại.
 */
export function useFlashSale({ initialData }: { initialData?: PublicFlashSaleListDto } = {}): {
  campaign: FlashSaleCampaignView | undefined;
  campaigns: FlashSaleCampaignView[];
  /** Thời gian server trả kèm danh sách; đồng hồ dùng để lệch giờ máy khách. */
  serverTime: string | undefined;
  isPending: boolean;
  isError: boolean;
  /** Tải lại thủ công (nút "Thử lại") và khi đồng hồ đếm về 0. */
  retry: () => Promise<unknown>;
} {
  const { campaigns, serverTime, refetch, isPending, isError } = useFlashSaleCampaigns({ live: true, initialData });
  // Đồng hồ bám chiến dịch kết thúc sớm nhất (API đã sắp theo endsAt).
  return { campaign: campaigns[0], campaigns, serverTime, isPending, isError, retry: refetch };
}

/**
 * Đồng hồ đếm ngược theo **giờ server**: `serverTime` cho biết độ lệch giữa máy khách và server nên chỉnh
 * đồng hồ máy không kéo dài được chương trình. Về 0 thì gọi `onExpired` một lần (refetch) thay vì tự quyết
 * định đã hết hạn. Chỉ component dùng hook này render lại mỗi giây.
 */
export function useFlashSaleCountdown({
  endsAtMs,
  serverTime,
  onExpired,
}: {
  endsAtMs: number | undefined;
  serverTime: string | undefined;
  onExpired: () => unknown;
}): FlashSaleCountdown {
  const [countdown, setCountdown] = useState<FlashSaleCountdown>(FLASH_SALE_COUNTDOWN_ZERO);
  const clockOffsetRef = useRef(0);
  const onExpiredRef = useRef(onExpired);
  useEffect(() => {
    onExpiredRef.current = onExpired;
  }, [onExpired]);

  useEffect(() => {
    if (!serverTime) return;
    clockOffsetRef.current = new Date(serverTime).getTime() - Date.now();
  }, [serverTime]);

  useEffect(() => {
    if (!endsAtMs) {
      setCountdown(FLASH_SALE_COUNTDOWN_ZERO);
      return;
    }
    let expiredHandled = false;
    const tick = () => {
      const next = splitRemaining(endsAtMs - (Date.now() + clockOffsetRef.current));
      setCountdown(next);
      if (next.finished && !expiredHandled) {
        expiredHandled = true;
        void onExpiredRef.current();
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endsAtMs]);

  return countdown;
}
