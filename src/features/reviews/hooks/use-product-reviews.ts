'use client';

import { useMemo } from 'react';
import { useListProductReviews } from '@/generated/api/reviews/reviews';
import { CACHE_POLICY } from '@/app/config/query-cache-policy';
import {
  toRatingBreakdown,
  toReviewView,
  type RatingBreakdownRow,
  type ReviewView,
} from '../model/review.mapper';

export function useProductReviews(productSlug: string): {
  reviews: ReviewView[];
  total: number;
  averageRating: number;
  breakdown: RatingBreakdownRow[];
  isPending: boolean;
  isError: boolean;
} {
  const query = useListProductReviews(productSlug, {
    // Đánh giá chỉ hiện sau khi Admin duyệt nên không cần tươi từng giây; dùng mức CATALOG như
    // chi tiết sản phẩm để khách đi qua lại giữa các sản phẩm không gọi lại mỗi lần.
    query: { enabled: Boolean(productSlug), ...CACHE_POLICY.CATALOG },
  });

  const reviews = useMemo(
    () => (query.data?.items ?? []).map(toReviewView),
    [query.data?.items],
  );

  return {
    reviews,
    total: query.data?.total ?? 0,
    // Điểm trung bình do server tính trên toàn bộ đánh giá đã duyệt,
    // không tính lại từ trang hiện tại.
    averageRating: query.data?.averageRating ?? 0,
    breakdown: useMemo(() => toRatingBreakdown(reviews), [reviews]),
    isPending: query.isPending,
    isError: query.isError,
  };
}
