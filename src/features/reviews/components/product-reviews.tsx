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

  if (isPending) return <Skeleton className="h-64 rounded-[32px]" />;

  const highlight = reviews.find((review) => review.rating >= 4) ?? reviews[0];
  if (!highlight) return null;

  return (
    <div className="grid gap-8 rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-white shadow-xl md:grid-cols-[.75fr_1.25fr] md:p-12">
      <div>
        <div className="flex size-12 items-center justify-center rounded-2xl border border-slate-900/20 bg-slate-900/10 text-slate-300">
          <MessageCircle aria-hidden className="size-6" />
        </div>
        <p className="mt-4 text-4xl font-black text-white sm:text-5xl">
          {formatAverageRating(averageRating)}
          <span className="text-xl font-bold text-slate-400">/5</span>
        </p>
        <RatingStars
          value={Math.round(averageRating)}
          inactiveClassName="text-slate-700"
          wrapperClassName="mt-2.5 flex gap-1 text-amber-400"
          ariaLabel={`Trung bình ${formatAverageRating(averageRating)} trên 5 sao`}
        />
        <p className="mt-2 text-xs font-semibold text-slate-400">
          {total} đánh giá đã được duyệt
        </p>
      </div>
      <blockquote className="flex flex-col justify-center">
        <p className="text-lg font-bold leading-relaxed text-slate-100 sm:text-xl">
          “{highlight.content}”
        </p>
        <footer className="mt-4 text-xs font-semibold text-slate-300">
          {highlight.authorName}
          {highlight.verifiedPurchase ? ' · Đã xác minh mua hàng' : ''} · {highlight.dateLabel}
        </footer>
        {highlight.reply && (
          <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-slate-300">
            <strong className="text-white">{highlight.reply.authorName}:</strong>{' '}
            {highlight.reply.content}
          </p>
        )}
      </blockquote>
    </div>
  );
}
