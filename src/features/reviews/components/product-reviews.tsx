'use client';

import { MessageCircle } from 'lucide-react';
import { RatingStars } from '@/foundation/components/indicators';
import { Skeleton } from '@/foundation/components/feedback';
import { useProductReviews } from '../hooks/use-product-reviews';
import { formatAverageRating } from '../model/review.mapper';

/**
 * Khối trích dẫn đánh giá trên trang chủ.
 *
 * API đánh giá công khai chỉ có theo từng sản phẩm, chưa có endpoint tổng hợp
 * toàn site; vì vậy slug được truyền từ ngoài vào thay vì hardcode một slug có
 * thể không tồn tại. Không có đánh giá thì ẩn hẳn, không dựng trích dẫn giả.
 */
export function ProductReviews({ productSlug }: { productSlug: string }) {
  const { reviews, averageRating, total, isPending } = useProductReviews(productSlug);

  if (isPending) return <Skeleton className="h-64 rounded-2xl" />;

  const highlight = reviews.find((review) => review.rating >= 4) ?? reviews[0];
  if (!highlight) return null;

  return (
    <div className="grid gap-8 rounded-2xl bg-neutral-50 p-8 md:grid-cols-[.75fr_1.25fr] md:p-12">
      <div>
        <div className="flex size-12 items-center justify-center rounded-xl bg-white text-neutral-700">
          <MessageCircle aria-hidden className="size-6" />
        </div>
        <p className="mt-4 text-4xl font-bold text-neutral-950 sm:text-5xl">
          {formatAverageRating(averageRating)}
          <span className="text-xl font-semibold text-neutral-400">/5</span>
        </p>
        <RatingStars
          value={Math.round(averageRating)}
          inactiveClassName="text-neutral-300"
          wrapperClassName="mt-2.5 flex gap-1 text-amber-400"
          ariaLabel={`Trung bình ${formatAverageRating(averageRating)} trên 5 sao`}
        />
        <p className="mt-2 text-xs font-medium text-neutral-500">
          {total} đánh giá đã được duyệt
        </p>
      </div>
      <blockquote className="flex flex-col justify-center">
        <p className="text-lg font-medium leading-relaxed text-neutral-900 sm:text-xl">
          “{highlight.content}”
        </p>
        <footer className="mt-4 text-xs font-medium text-neutral-500">
          {highlight.authorName}
          {highlight.verifiedPurchase ? ' · Đã xác minh mua hàng' : ''} · {highlight.dateLabel}
        </footer>
        {highlight.reply && (
          <p className="mt-4 rounded-xl bg-white p-4 text-xs leading-relaxed text-neutral-600">
            <strong className="text-neutral-900">{highlight.reply.authorName}:</strong>{' '}
            {highlight.reply.content}
          </p>
        )}
      </blockquote>
    </div>
  );
}
