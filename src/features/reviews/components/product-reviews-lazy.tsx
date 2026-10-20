'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/foundation/components/feedback';

/**
 * Khối trích dẫn đánh giá trang chủ nằm gần cuối trang: tách chunk riêng để không tính vào First Load
 * JS của `/`. Vẫn SSR như trước (server render khung chờ vì đánh giá chỉ tải ở client); khung chờ khi
 * chunk chưa về giống hệt khung chờ lúc `isPending` của `ProductReviews` nên không nhảy layout.
 */
export const ProductReviewsLazy = dynamic(
  () => import('./product-reviews').then((module) => module.ProductReviews),
  { loading: () => <Skeleton className="h-64 rounded-2xl" /> },
);
