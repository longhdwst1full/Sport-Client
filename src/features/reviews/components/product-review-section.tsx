'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { EmptyState, ErrorState, Skeleton } from '@/foundation/components/feedback';
import { RatingStars } from '@/foundation/components/indicators';
import { useProductReviews } from '../hooks/use-product-reviews';
import { formatAverageRating, type ReviewView } from '../model/review.mapper';

export type { ReviewView };

type ReviewFilter = 'all' | '5' | '4' | 'verified';

const REVIEW_FILTERS: Array<{ id: ReviewFilter; label: (total: number) => string }> = [
  { id: 'all', label: (total) => `Tất cả (${total})` },
  { id: '5', label: () => '5 sao' },
  { id: '4', label: () => '4 sao' },
  { id: 'verified', label: () => 'Đã xác minh mua hàng' },
];

/** Khung chú thích nét đứt dùng chung cho trạng thái lỗi/rỗng của khối đánh giá. */
const NOTE_BLOCK = {
  className: 'mt-8 rounded-2xl border border-dashed border-neutral-300 p-8 text-center',
  titleAs: 'p',
  titleClassName: 'text-sm text-neutral-500',
} as const;

function StarRow({ rating, className = 'size-4' }: { rating: number; className?: string }) {
  return (
    <RatingStars
      value={rating}
      size={className}
      inactiveClassName="text-neutral-300"
      wrapperClassName="flex gap-0.5 text-amber-400"
      ariaLabel={`${rating} trên 5 sao`}
    />
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
      <div className="rounded-4xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
        <h2 id="product-reviews-title" className="text-xl font-black text-ink sm:text-2xl">
          Đánh giá từ khách hàng
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Nhận xét về {productName} được hiển thị ngay sau khi khách gửi đánh giá.
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
          <ErrorState as="div" {...NOTE_BLOCK} title="Không tải được đánh giá. Vui lòng thử lại sau ít phút." />
        ) : total === 0 ? (
          <EmptyState {...NOTE_BLOCK} title="Sản phẩm chưa có đánh giá nào." />
        ) : (
          <>
            <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
              <div className="text-center md:text-left">
                <p className="text-5xl font-black text-ink">
                  {formatAverageRating(averageRating)}
                  <span className="text-xl font-bold text-neutral-400">/5</span>
                </p>
                <div className="mt-2 flex justify-center md:justify-start">
                  <StarRow rating={Math.round(averageRating)} />
                </div>
                <p className="mt-2 text-xs font-semibold text-neutral-500">
                  {total} đánh giá
                </p>
              </div>

              <div className="space-y-2">
                {breakdown.map((row) => (
                  <div key={row.star} className="flex items-center gap-3 text-xs font-semibold">
                    <span className="w-10 shrink-0 text-neutral-600">{row.star} sao</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-neutral-500">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-neutral-100 pb-5">
              <span className="mr-1 text-xs font-bold text-neutral-500">Lọc theo:</span>
              {REVIEW_FILTERS.map((filter) => {
                const active = activeFilter === filter.id;
                return (
                  <Button
                    key={filter.id}
                    variant={active ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter(filter.id)}
                    aria-pressed={active}
                    className={active ? 'bg-neutral-800 text-xs shadow-sm' : 'border-neutral-200 text-xs text-neutral-700'}
                  >
                    {filter.label(reviews.length)}
                  </Button>
                );
              })}
            </div>

            <div className="mt-6 space-y-6">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-neutral-500">
                  Không có đánh giá nào khớp bộ lọc này.
                </p>
              ) : (
                filtered.map((review) => (
                  <article key={review.id} className="border-b border-neutral-100 pb-6 last:border-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-950">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-ink">{review.authorName}</p>
                          <p className="text-2xs text-neutral-500">{review.dateLabel}</p>
                        </div>
                      </div>
                      {review.verifiedPurchase && (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-success-50 px-2.5 py-1 text-2xs font-bold text-success-800">
                          <ShieldCheck aria-hidden className="size-3.5" />
                          Đã mua hàng
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <StarRow rating={review.rating} className="size-3.5" />
                    </div>
                    <h3 className="mt-2 text-sm font-black text-ink">{review.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{review.content}</p>

                    {review.media.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.media.map((item) => (
                          <a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Mở ảnh thực tế từ ${review.authorName} (tab mới)`}
                            className="relative size-20 overflow-hidden rounded-xl border border-neutral-200 focus-ring"
                          >
                            <Image src={item.thumbnailUrl} alt={`Ảnh thực tế từ ${review.authorName}`} fill sizes="80px" className="object-cover" />
                          </a>
                        ))}
                      </div>
                    )}

                    {review.reply && (
                      <div className="mt-4 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4">
                        <p className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                          <MessageCircle aria-hidden className="size-3.5" />
                          {review.reply.authorName}
                          <span className="font-normal text-neutral-500">· {review.reply.dateLabel}</span>
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
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

        <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/60 p-5 text-center">
          <p className="text-sm font-bold text-ink">Bạn đã mua sản phẩm này?</p>
          <p className="mt-1 text-xs text-neutral-500">
            Mở đơn hàng đã hoàn tất, chọn sản phẩm và gửi đánh giá. Nội dung được hiển thị ngay sau khi gửi.
          </p>
        </div>
      </div>
    </section>
  );
}
