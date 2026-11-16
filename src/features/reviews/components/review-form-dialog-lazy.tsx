'use client';

import dynamic from 'next/dynamic';

/**
 * Form đánh giá (có upload ảnh) chỉ mở khi khách bấm "Đánh giá" ở trang đơn: tách chunk để không tính vào
 * First Load JS của `/orders/[orderNo]`. Dialog chỉ được render sau thao tác của khách nên `loading` null
 * không gây nhảy layout.
 */
export const ReviewFormDialogLazy = dynamic(
  () => import('./review-form-dialog').then((module) => module.ReviewFormDialog),
  { loading: () => null },
);
