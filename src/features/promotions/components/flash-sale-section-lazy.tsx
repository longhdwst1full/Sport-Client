'use client';

import dynamic from 'next/dynamic';

/**
 * `FlashSaleSection` cho trang chủ: phần lớn thời gian không có chiến dịch nên khối không render; tách
 * chunk để thẻ deal, đồng hồ và luồng giỏ flash chỉ tải khi thật sự có chiến dịch. Vẫn SSR nên khi có
 * chiến dịch HTML đầu đã có khối (LCP), lúc hydrate React giữ HTML server tới khi chunk về.
 * `loading` trả null như chính `FlashSaleSection` (không giữ chỗ bằng skeleton — xem comment ở đó).
 */
export const FlashSaleSectionLazy = dynamic(
  () => import('./flash-sale-section').then((module) => module.FlashSaleSection),
  { loading: () => null },
);
