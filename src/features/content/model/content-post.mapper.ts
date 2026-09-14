import type { ContentPostDto } from '@/generated/api/content/models';

export interface ContentPostView {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  /** Mã ổn định dùng để lọc; không dùng nhãn hiển thị để so sánh. */
  postType: string;
  categoryLabel: string;
  publishedLabel: string;
  readTimeLabel: string;
}

/**
 * Nhãn tiếng Việt map tách khỏi mã `postType` (`08-enums-constants.md`):
 * đổi chữ hiển thị không được làm hỏng bộ lọc.
 */
export const CONTENT_POST_TYPE_LABELS: Record<string, string> = {
  NEWS: 'Tin tức',
  TRAINING_GUIDE: 'Hướng dẫn tập luyện',
  PRODUCT_GUIDE: 'Tư vấn sản phẩm',
  ABOUT: 'Về chúng tôi',
};

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/** Ước lượng thời gian đọc từ độ dài bài thật, không phải con số cố định. */
function readTimeLabel(body: string, excerpt: string): string {
  const words = `${excerpt} ${body}`.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} phút đọc`;
}

export function toContentPostView(dto: ContentPostDto): ContentPostView {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    excerpt: dto.excerpt,
    coverUrl: dto.coverUrl,
    postType: dto.postType,
    categoryLabel: CONTENT_POST_TYPE_LABELS[dto.postType] ?? dto.postType,
    publishedLabel: dateFormatter.format(new Date(dto.publishedAt)),
    readTimeLabel: readTimeLabel(dto.body, dto.excerpt),
  };
}
