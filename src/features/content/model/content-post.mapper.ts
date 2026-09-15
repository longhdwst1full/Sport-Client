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
  POLICY: 'Thông tin và chính sách',
};

/**
 * Trang chính sách nằm chung bảng với bài viết nhưng không phải nội dung biên tập:
 * luồng tin tức phải loại nó ra, nếu không danh sách tin lẫn trang bảo hành, đổi trả.
 */
export const POLICY_POST_TYPE = 'POLICY';

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

/** Một khối trong thân bài, đã tách khỏi chuỗi thô để component không đụng cú pháp lưu trữ. */
export type ArticleBlock =
  | { kind: 'heading'; level: 2 | 3; text: string }
  | { kind: 'bullet'; text: string }
  | { kind: 'paragraph'; text: string };

export interface ArticleDetailView extends ContentPostView {
  blocks: ArticleBlock[];
  /** Ảnh bìa có thể trống với bài cũ; component tự quyết định có render khung ảnh không. */
  hasCover: boolean;
}

/**
 * Thân bài lưu văn bản thuần với tiền tố nhẹ do lớp seed đặt: '## ' tiêu đề mục,
 * '### ' tiêu đề con, '- ' gạch đầu dòng. Giữ ở đây để đổi cách lưu trữ về sau chỉ
 * phải sửa một chỗ, và để trang không phải biết quy ước này.
 */
export function toArticleBlocks(body: string): ArticleBlock[] {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line): ArticleBlock => {
      if (line.startsWith('### ')) return { kind: 'heading', level: 3, text: line.slice(4) };
      if (line.startsWith('## ')) return { kind: 'heading', level: 2, text: line.slice(3) };
      if (line.startsWith('- ')) return { kind: 'bullet', text: line.slice(2) };
      return { kind: 'paragraph', text: line };
    });
}

export function toArticleDetailView(dto: ContentPostDto): ArticleDetailView {
  return {
    ...toContentPostView(dto),
    blocks: toArticleBlocks(dto.body),
    hasCover: Boolean(dto.coverUrl),
  };
}
