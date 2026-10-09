import { describe, expect, it } from 'vitest';
import type { ContentPostDto, ContentPostSummaryDto } from '@/generated/api/content/content.schemas';
import { toArticleDetailView, toContentPostView } from './content-post.mapper';

const summary = {
  id: '1',
  slug: 'bai-viet',
  postType: 'NEWS',
  title: 'Bài viết',
  excerpt: 'Đoạn trích ngắn',
  coverUrl: '',
  publishedAt: '2026-10-01T00:00:00.000Z',
} as unknown as ContentPostSummaryDto;

describe('thời gian đọc', () => {
  it('danh sách không có thân bài nên không hiện số phút (trước đây luôn ra "1 phút đọc")', () => {
    expect(toContentPostView(summary).readTimeLabel).toBeNull();
  });

  it('trang chi tiết tính theo cả thân bài', () => {
    const body = Array.from({ length: 1000 }, () => 'chữ').join(' ');
    const detail = toArticleDetailView({ ...summary, body } as unknown as ContentPostDto);
    expect(detail.readTimeLabel).toBe('5 phút đọc');
  });
});
