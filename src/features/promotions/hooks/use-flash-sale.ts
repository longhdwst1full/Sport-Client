'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
 * Nguồn dữ liệu flash sale cho Storefront.
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
} {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const query = useListPublicFlashSales({
    query: { enabled: isMounted },
  });
  const clockOffsetRef = useRef(0);
  const [countdown, setCountdown] = useState<FlashSaleCountdown>(ZERO);

  const campaigns = useMemo(
    () => (query.data?.items ?? []).map(toFlashSaleCampaignView),
    [query.data],
  );
  // Đồng hồ đếm ngược bám chiến dịch kết thúc sớm nhất (API đã sắp theo endsAt).
  const campaign = campaigns[0];

  useEffect(() => {
    if (!query.data?.serverTime) return;
    clockOffsetRef.current = new Date(query.data.serverTime).getTime() - Date.now();
  }, [query.data?.serverTime]);

  const endsAtMs = campaign?.endsAtMs;
  const refetch = query.refetch;

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

  return {
    campaign,
    campaigns,
    countdown,
    isPending: query.isPending,
    isError: query.isError,
  };
}
