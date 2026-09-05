'use client';

import { MessageCircle, Star } from 'lucide-react';
import { useProductReviews } from '../hooks/use-product-reviews';

export function ProductReviews() {
  const { summary, isPending } = useProductReviews('may-chay-bo-dctd-pro-x1');
  if (isPending) return <div className="h-64 animate-pulse rounded-[32px] bg-slate-900" />;
  if (!summary) return null;

  return (
    <div className="grid gap-8 rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-white shadow-xl md:grid-cols-[.75fr_1.25fr] md:p-12">
      <div>
        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <MessageCircle className="size-6" />
        </div>
        <p className="mt-4 text-4xl sm:text-5xl font-black text-white">{summary.averageRating}<span className="text-xl font-bold text-slate-400">/5</span></p>
        <div className="mt-2.5 flex gap-1 text-amber-400">
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} className="size-4 fill-current" />
          ))}
        </div>
        <p className="mt-2 text-xs font-semibold text-slate-400">Đánh giá thực tế từ khách hàng đã mua</p>
      </div>
      <blockquote className="flex flex-col justify-center">
        <p className="text-lg sm:text-xl font-bold leading-relaxed text-slate-100">“{summary.content}”</p>
        <footer className="mt-4 text-xs font-semibold text-emerald-400">
          {summary.customerLabel} · {summary.purchaseLabel}
        </footer>
        {summary.comment && (
          <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-slate-300">
            <strong className="text-white">{summary.comment.authorName}:</strong> {summary.comment.content}
          </p>
        )}
      </blockquote>
    </div>
  );
}
