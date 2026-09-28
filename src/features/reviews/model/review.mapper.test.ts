import { describe, expect, it } from 'vitest';
import type { ProductReviewDto } from '@/generated/api/reviews/reviews.schemas';
import { toRatingBreakdown, toReviewView } from './review.mapper';

const review: ProductReviewDto = {
  id: '81',
  productSlug: 'ta-tay-5kg',
  customerDisplayName: 'Nguyễn An',
  rating: 5,
  title: 'Dùng rất chắc chắn',
  content: 'Sản phẩm đúng mô tả và đóng gói tốt.',
  verifiedPurchase: true,
  status: 'APPROVED',
  version: 2,
  comments: [
    {
      id: '91',
      authorType: 'STAFF',
      authorName: 'MG Sport',
      content: 'Cảm ơn anh/chị đã tin tưởng.',
      createdAt: '2026-09-28T03:00:00.000Z',
    },
  ],
  media: [
    {
      id: '101',
      mediaAssetId: '71',
      url: 'https://cdn.example.test/review.jpg',
      thumbnailUrl: 'https://cdn.example.test/review-thumb.jpg',
      sortOrder: 0,
    },
  ],
  createdAt: '2026-09-28T02:00:00.000Z',
};

describe('review mapper', () => {
  it('maps verified review media and official staff reply', () => {
    const view = toReviewView(review);

    expect(view.media).toEqual([
      {
        id: '101',
        url: 'https://cdn.example.test/review.jpg',
        thumbnailUrl: 'https://cdn.example.test/review-thumb.jpg',
      },
    ]);
    expect(view.reply).toMatchObject({
      authorName: 'MG Sport',
      content: 'Cảm ơn anh/chị đã tin tưởng.',
    });
  });

  it('builds rating percentages from approved review data without fixed fallback', () => {
    const reviews = [toReviewView(review), toReviewView({ ...review, id: '82', rating: 4 })];

    expect(toRatingBreakdown(reviews)).toEqual([
      { star: 5, count: 1, percent: 50 },
      { star: 4, count: 1, percent: 50 },
      { star: 3, count: 0, percent: 0 },
      { star: 2, count: 0, percent: 0 },
      { star: 1, count: 0, percent: 0 },
    ]);
  });
});
