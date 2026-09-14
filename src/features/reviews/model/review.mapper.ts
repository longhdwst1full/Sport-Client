import type { ProductReviewDto } from '@/generated/api/reviews/models';

export interface ReviewReplyView {
  authorName: string;
  content: string;
  dateLabel: string;
}

export interface ReviewView {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  content: string;
  verifiedPurchase: boolean;
  dateLabel: string;
  reply?: ReviewReplyView;
}

export interface RatingBreakdownRow {
  star: number;
  count: number;
  percent: number;
}

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function toReviewView(dto: ProductReviewDto): ReviewView {
  // Chỉ hiện phản hồi chính thức từ cửa hàng, không hiện bình luận của khách khác.
  const officialReply = dto.comments.find((comment) => comment.authorType !== 'CUSTOMER');
  return {
    id: dto.id,
    authorName: dto.customerDisplayName,
    rating: dto.rating,
    title: dto.title,
    content: dto.content,
    verifiedPurchase: dto.verifiedPurchase,
    dateLabel: dateFormatter.format(new Date(dto.createdAt)),
    reply: officialReply
      ? {
          authorName: officialReply.authorName,
          content: officialReply.content,
          dateLabel: dateFormatter.format(new Date(officialReply.createdAt)),
        }
      : undefined,
  };
}

/** Phân bố sao tính từ chính danh sách đánh giá đã duyệt, không phải số cố định. */
export function toRatingBreakdown(reviews: readonly ReviewView[]): RatingBreakdownRow[] {
  const total = reviews.length;
  return [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => review.rating === star).length;
    return { star, count, percent: total === 0 ? 0 : Math.round((count / total) * 100) };
  });
}
