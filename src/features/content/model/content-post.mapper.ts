import type { ContentPostDto, ContentPostSummaryDto } from '@/generated/api/content/content.schemas';
import { formatDate } from '@/shared/format/date-time';

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
  /**
   * `null` ở danh sách: summary không có `body`, ước lượng từ `excerpt` luôn ra "1 phút đọc" cho mọi
   * bài (sai). Chỉ trang chi tiết (có thân bài) mới có số phút.
   */
  readTimeLabel: string | null;
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

/**
 * Số bài mỗi lượt tải của `/news` (server lấy trang 1, client "Xem thêm" các trang sau); khớp lưới
 * 3 cột x 4 hàng. Đặt ở model, không ở hook `'use client'`, để route server import được giá trị thật.
 */
export const NEWS_PAGE_SIZE = 12;

/** Bỏ trang chính sách (có route riêng) khỏi danh sách bài viết. */
export function toNewsPostViews(items: ContentPostSummaryDto[]): ContentPostView[] {
  return items.filter((post) => post.postType !== POLICY_POST_TYPE).map(toContentPostView);
}

/** Ước lượng thời gian đọc từ độ dài văn bản đưa vào, không phải con số cố định. */
function readTimeLabel(text: string): string {
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} phút đọc`;
}

/**
 * Danh sách bài viết (`listPublishedPosts`) trả `ContentPostSummaryDto` — không có `body`
 * (contract v2: tóm tắt cho danh sách). Không đủ dữ liệu ước lượng thời gian đọc nên để `null`;
 * bài chi tiết dùng `toArticleDetailView` để tính theo thân bài đầy đủ.
 */
export function toContentPostView(dto: ContentPostSummaryDto): ContentPostView {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    excerpt: dto.excerpt,
    coverUrl: dto.coverUrl,
    postType: dto.postType,
    categoryLabel: CONTENT_POST_TYPE_LABELS[dto.postType] ?? dto.postType,
    publishedLabel: formatDate(dto.publishedAt),
    readTimeLabel: null,
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
  /** ISO 8601 gốc từ API, chỉ dùng cho dữ liệu có cấu trúc (JSON-LD); hiển thị dùng `publishedLabel`. */
  publishedAtIso: string;
}

/**
 * Thân bài lưu văn bản thuần với tiền tố nhẹ do lớp seed đặt: '## ' tiêu đề mục,
 * '### ' tiêu đề con, '- ' gạch đầu dòng. Giữ ở đây để đổi cách lưu trữ về sau chỉ
 * phải sửa một chỗ, và để trang không phải biết quy ước này.
 */
/** Tách thân bài văn bản thuần thành các dòng không rỗng (dùng chung cho bài viết và chính sách). */
export function toBodyLines(body: string): string[] {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function toArticleBlocks(body: string): ArticleBlock[] {
  return toBodyLines(body).map((line): ArticleBlock => {
    if (line.startsWith('### ')) return { kind: 'heading', level: 3, text: line.slice(4) };
    if (line.startsWith('## ')) return { kind: 'heading', level: 2, text: line.slice(3) };
    if (line.startsWith('- ')) return { kind: 'bullet', text: line.slice(2) };
    return { kind: 'paragraph', text: line };
  });
}

export function toArticleDetailView(dto: ContentPostDto): ArticleDetailView {
  return {
    ...toContentPostView(dto),
    // Trang chi tiết có `body` đầy đủ (ContentPostDto) nên tính thời gian đọc theo cả thân bài,
    // khác với `toContentPostView` vốn chỉ nhận được summary không có `body`.
    readTimeLabel: readTimeLabel(`${dto.excerpt} ${dto.body}`),
    blocks: toArticleBlocks(dto.body),
    hasCover: Boolean(dto.coverUrl),
    publishedAtIso: dto.publishedAt,
  };
}
