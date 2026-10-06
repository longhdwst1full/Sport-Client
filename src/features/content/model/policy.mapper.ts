import type { ContentPostDto, ContentPostSummaryDto } from '@/generated/api/content/content.schemas';
import { formatDate } from '@/shared/format/date-time';
import { POLICY_POST_TYPE, toBodyLines } from './content-post.mapper';

export interface PolicySummaryView {
  slug: string;
  title: string;
  excerpt: string;
}

export interface PolicyDetailView extends PolicySummaryView {
  updatedLabel: string;
  /** Thân bài lưu dạng văn bản thuần; tách đoạn ở đây để component không đụng chuỗi thô. */
  paragraphs: string[];
  /** ISO 8601 gốc từ API, chỉ dùng cho JSON-LD; hiển thị dùng `updatedLabel`. */
  publishedAtIso: string;
}

export function isPolicyPost(dto: ContentPostDto): boolean {
  return dto.postType === POLICY_POST_TYPE;
}

// Danh sách chính sách đọc từ `listPublishedPosts` (ContentPostSummaryDto, không có `body`);
// chỉ trang chi tiết chính sách mới cần `ContentPostDto` đầy đủ để tách đoạn thân bài.
export function toPolicySummaryView(dto: ContentPostSummaryDto): PolicySummaryView {
  return { slug: dto.slug, title: dto.title, excerpt: dto.excerpt };
}

export function toPolicyDetailView(dto: ContentPostDto): PolicyDetailView {
  return {
    ...toPolicySummaryView(dto),
    updatedLabel: formatDate(dto.publishedAt),
    paragraphs: toBodyLines(dto.body),
    publishedAtIso: dto.publishedAt,
  };
}
