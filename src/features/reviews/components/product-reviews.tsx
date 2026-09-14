'use client';

import { MessageCircle, Star } from 'lucide-react';
import { useProductReviews } from '../hooks/use-product-reviews';

/**
 * Khối trích dẫn đánh giá trên trang chủ.
 *
 * API đánh giá công khai chỉ có theo từng sản phẩm, chưa có endpoint tổng hợp
 * toàn site; vì vậy slug được truyền từ ngoài vào thay vì hardcode một slug có
 * thể không tồn tại. Không có đánh giá thì ẩn hẳn, không dựng trích dẫn giả.
 */
export function ProductReviews({ productSlug }: { productSlug: string }) {
  const { reviews, averageRating, total, isPending } = useProductReviews(productSlug);

  if (isPending) return <div className="h-64 animate-pulse rounded-[32px] bg-slate-900" />;

  const highlight = reviews.find((review) => review.rating >= 4) ?? reviews[0];
  if (!highlight) return null;

  return (
    <div className="grid gap-8 rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-white shadow-xl md:grid-cols-[.75fr_1.25fr] md:p-12">
      <div>
        <div className="flex size-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
          <MessageCircle className="size-6" />
        </div>
        <p className="mt-4 text-4xl font-black text-white sm:text-5xl">
          {averageRating.toFixed(1)}
          <span className="text-xl font-bold text-slate-400">/5</span>
        </p>
        <div className="mt-2.5 flex gap-1 text-amber-400">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={`size-4 ${index < Math.round(averageRating) ? 'fill-current' : 'text-slate-700'}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs font-semibold text-slate-400">
          {total} đánh giá đã được duyệt
        </p>
      </div>
      <blockquote className="flex flex-col justify-center">
        <p className="text-lg font-bold leading-relaxed text-slate-100 sm:text-xl">
          “{highlight.content}”
        </p>
        <footer className="mt-4 text-xs font-semibold text-emerald-400">
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
