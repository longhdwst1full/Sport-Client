import type { ContentPostDto } from '@/generated/api/content/models';
import { POLICY_POST_TYPE } from './content-post.mapper';

export interface PolicySummaryView {
  slug: string;
  title: string;
  excerpt: string;
}

export interface PolicyDetailView extends PolicySummaryView {
  updatedLabel: string;
  /** Thân bài lưu dạng văn bản thuần; tách đoạn ở đây để component không đụng chuỗi thô. */
  paragraphs: string[];
}

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function isPolicyPost(dto: ContentPostDto): boolean {
  return dto.postType === POLICY_POST_TYPE;
}

export function toPolicySummaryView(dto: ContentPostDto): PolicySummaryView {
  return { slug: dto.slug, title: dto.title, excerpt: dto.excerpt };
}

export function toPolicyDetailView(dto: ContentPostDto): PolicyDetailView {
  return {
    ...toPolicySummaryView(dto),
    updatedLabel: dateFormatter.format(new Date(dto.publishedAt)),
    paragraphs: dto.body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
  };
}
