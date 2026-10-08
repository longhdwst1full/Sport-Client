'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsMounted } from '@/shared/hooks';
import { useListPublicFlashSales } from '@/generated/api/promotions/promotions';
import {
  toFlashSaleCampaignView,
  type FlashSaleCampaignView,
} from '../model/flash-sale.mapper';

export interface FlashSaleCountdown {
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
}

const ZERO: FlashSaleCountdown = { hours: 0, minutes: 0, seconds: 0, finished: true };

function splitRemaining(remainingMs: number): FlashSaleCountdown {
  if (remainingMs <= 0) return ZERO;
  const totalSeconds = Math.floor(remainingMs / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    finished: false,
  };
}

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
export function useFlashSaleCampaigns({ live = false }: { live?: boolean } = {}): {
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
  const campaigns = useMemo(
    () => (query.data?.items ?? []).map(toFlashSaleCampaignView),
    [query.data],
  );
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
 * Chiến dịch + đồng hồ đếm ngược — chỉ dùng ở nơi HIỂN THỊ đồng hồ (khối flash sale, trang flash sale).
 *
 * Đồng hồ đếm ngược chạy theo **giờ server**: `serverTime` trong response cho
 * biết độ lệch giữa máy khách và server, nên người dùng chỉnh đồng hồ máy cũng
 * không kéo dài được chương trình. Khi đếm về 0, hook refetch để server xác nhận
 * lại thay vì client tự quyết định đã hết hạn.
 */
export function useFlashSale(): {
  campaign: FlashSaleCampaignView | undefined;
  campaigns: FlashSaleCampaignView[];
  countdown: FlashSaleCountdown;
  isPending: boolean;
  isError: boolean;
  /** Tải lại thủ công (nút "Thử lại" ở trạng thái lỗi). */
  retry: () => Promise<unknown>;
} {
  const { campaigns, serverTime, refetch, isPending, isError } = useFlashSaleCampaigns({ live: true });
  const clockOffsetRef = useRef(0);
  const [countdown, setCountdown] = useState<FlashSaleCountdown>(ZERO);

  // Đồng hồ đếm ngược bám chiến dịch kết thúc sớm nhất (API đã sắp theo endsAt).
  const campaign = campaigns[0];

  useEffect(() => {
    if (!serverTime) return;
    clockOffsetRef.current = new Date(serverTime).getTime() - Date.now();
  }, [serverTime]);

  const endsAtMs = campaign?.endsAtMs;

  useEffect(() => {
    if (!endsAtMs) {
      setCountdown(ZERO);
      return;
    }
    let expiredHandled = false;
    const tick = () => {
      const serverNow = Date.now() + clockOffsetRef.current;
      const next = splitRemaining(endsAtMs - serverNow);
      setCountdown(next);
      if (next.finished && !expiredHandled) {
        expiredHandled = true;
        void refetch();
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endsAtMs, refetch]);

  return { campaign, campaigns, countdown, isPending, isError, retry: refetch };
}
