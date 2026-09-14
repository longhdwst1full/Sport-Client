'use client';

import { useMemo, useState } from 'react';
import { MessageCircle, ShieldCheck, Star } from 'lucide-react';
import { Skeleton, SkeletonText } from '@/foundation/components/feedback';
import { STORE_CONTACT } from '@/shared/constants';
import { useProductReviews } from '../hooks/use-product-reviews';
import type { ReviewView } from '../model/review.mapper';

export type { ReviewView };

type ReviewFilter = 'all' | '5' | '4' | 'verified';

function StarRow({ rating, className = 'size-4' }: { rating: number; className?: string }) {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label={`${rating} trên 5 sao`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`${className} ${index < rating ? 'fill-current' : 'text-slate-300'}`}
        />
      ))}
    </div>
  );
}

export function ProductReviewSection({
  productName,
  productSlug,
}: {
  productName: string;
  productSlug?: string;
}) {
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>('all');
  const { reviews, total, averageRating, breakdown, isPending, isError } = useProductReviews(
    productSlug ?? '',
  );

  const filtered = useMemo(() => {
    if (activeFilter === 'verified') return reviews.filter((review) => review.verifiedPurchase);
    if (activeFilter === 'all') return reviews;
    return reviews.filter((review) => review.rating === Number(activeFilter));
  }, [reviews, activeFilter]);

  return (
    <section aria-labelledby="product-reviews-title" className="space-y-8">
      <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <h2 id="product-reviews-title" className="text-xl font-black text-ink sm:text-2xl">
          Đánh giá từ khách hàng
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Nhận xét về {productName} đã được kiểm duyệt trước khi hiển thị.
        </p>

        {isPending ? (
          <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
            <Skeleton className="h-40" />
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <p className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Không tải được đánh giá. Vui lòng thử lại sau ít phút.
          </p>
        ) : total === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Sản phẩm chưa có đánh giá nào được duyệt.
          </p>
        ) : (
          <>
            <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
              <div className="text-center md:text-left">
                <p className="text-5xl font-black text-ink">
                  {averageRating.toFixed(1)}
                  <span className="text-xl font-bold text-slate-400">/5</span>
                </p>
                <div className="mt-2 flex justify-center md:justify-start">
                  <StarRow rating={Math.round(averageRating)} />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  {total} đánh giá đã duyệt
                </p>
              </div>

              <div className="space-y-2">
                {breakdown.map((row) => (
                  <div key={row.star} className="flex items-center gap-3 text-xs font-semibold">
                    <span className="w-10 shrink-0 text-slate-500">{row.star} sao</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-slate-400">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-5">
              <span className="mr-1 text-xs font-bold text-slate-500">Lọc theo:</span>
              {(
                [
                  { id: 'all', label: `Tất cả (${reviews.length})` },
                  { id: '5', label: '5 sao' },
                  { id: '4', label: '4 sao' },
                  { id: 'verified', label: 'Đã xác minh mua hàng' },
                ] as Array<{ id: ReviewFilter; label: string }>
              ).map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    activeFilter === filter.id
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-6">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Không có đánh giá nào khớp bộ lọc này.
                </p>
              ) : (
                filtered.map((review) => (
                  <article key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-ink">{review.authorName}</p>
                          <p className="text-[11px] text-slate-400">{review.dateLabel}</p>
                        </div>
                      </div>
                      {review.verifiedPurchase && (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                          <ShieldCheck className="size-3.5" />
                          Đã mua hàng
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <StarRow rating={review.rating} className="size-3.5" />
                    </div>
                    <h3 className="mt-2 text-sm font-black text-ink">{review.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{review.content}</p>

                    {review.reply && (
                      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                        <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                          <MessageCircle className="size-3.5" />
                          {review.reply.authorName}
                          <span className="font-normal text-slate-400">· {review.reply.dateLabel}</span>
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                          {review.reply.content}
                        </p>
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </>
        )}

        {/*
          CONTRACT: chưa có endpoint gửi đánh giá từ Storefront — `Storefront Reviews`
          mới chỉ có GET. Không dựng form gửi giả rồi tự sinh phản hồi của cửa hàng,
          vì như vậy khách tin là đã gửi được trong khi không có gì tới hệ thống.
        */}
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5 text-center">
          <p className="text-sm font-bold text-ink">Bạn đã mua sản phẩm này?</p>
          <p className="mt-1 text-xs text-slate-500">
            Gọi {STORE_CONTACT.primaryHotline} để gửi đánh giá. Chúng tôi sẽ đăng sau khi kiểm duyệt.
          </p>
        </div>
      </div>
    </section>
  );
}
