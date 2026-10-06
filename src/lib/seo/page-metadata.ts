import type { Metadata } from 'next';
import { SITE_URL } from '@/shared/constants/site';

export { SITE_URL };
export const SITE_NAME = 'Bảo An Sport';

/**
 * Ảnh chia sẻ mặc định. `openGraph`/`twitter` của trang con THAY THẾ (không gộp) object ở root
 * layout, nên trang không tự có ảnh phải gắn lại ảnh này, nếu không sẽ mất hẳn og:image.
 */
export const DEFAULT_OG_IMAGE = {
  url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85',
  width: 1200,
  height: 630,
  alt: 'Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng Giá Tốt Nhất',
} as const;

/** URL tuyệt đối trên domain công khai; URL đã tuyệt đối (ảnh CDN) giữ nguyên. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

type SearchParamsInput = URLSearchParams | Record<string, string | string[] | undefined>;

/**
 * Đường dẫn canonical tương đối (cho `alternates.canonical`, `metadataBase` tự ghép domain).
 *
 * Chỉ giữ tham số nằm trong `allowedParams` (mặc định: không giữ gì) để biến thể sort/lọc/utm
 * của cùng một danh sách gom về một URL. `page=1` bị bỏ vì trùng trang gốc. Thứ tự tham số cố
 * định theo `allowedParams` để hai URL tương đương ra cùng canonical.
 */
export function buildCanonicalPath(
  pathname: string,
  searchParams?: SearchParamsInput,
  allowedParams: readonly string[] = [],
): string {
  const path = `/${pathname.replace(/^\/+/, '')}`.replace(/(.)\/+$/, '$1');
  if (!searchParams || allowedParams.length === 0) return path;

  const read = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) return searchParams.get(key) ?? undefined;
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const kept = new URLSearchParams();
  for (const key of allowedParams) {
    const value = read(key)?.trim();
    if (!value || (key === 'page' && value === '1')) continue;
    kept.set(key, value);
  }
  const query = kept.toString();
  return query ? `${path}?${query}` : path;
}

/** Trang cá nhân/giao dịch/tiện ích: không index nhưng vẫn cho bot đi theo link. */
export const NOINDEX_ROBOTS: Metadata['robots'] = { index: false, follow: true };

export interface PageMetadataInput {
  /** Tiêu đề KHÔNG kèm tên thương hiệu; template ở root layout tự thêm `| Bảo An Sport`. */
  title: string;
  description?: string;
  /** Đường dẫn canonical tương đối, ví dụ `/news/abc`. Bỏ trống cho trang không index. */
  path?: string;
  type?: 'website' | 'article';
  images?: string[];
  publishedTime?: string;
  noindex?: boolean;
}

/**
 * Metadata chuẩn cho một trang công khai.
 *
 * Mỗi trang index được phải tự khai canonical của chính nó: root layout từng đặt
 * `canonical: '/'` và mọi trang con kế thừa, nghĩa là báo với Google rằng mọi trang đều là bản sao
 * của trang chủ.
 */
export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const socialTitle = `${input.title} | ${SITE_NAME}`;
  const ownImages = input.images?.filter(Boolean);
  const images = ownImages?.length ? ownImages : [DEFAULT_OG_IMAGE.url];
  return {
    title: input.title,
    description: input.description,
    ...(input.path ? { alternates: { canonical: input.path } } : {}),
    ...(input.noindex ? { robots: NOINDEX_ROBOTS } : {}),
    openGraph: {
      title: socialTitle,
      description: input.description,
      type: input.type ?? 'website',
      siteName: SITE_NAME,
      locale: 'vi_VN',
      ...(input.path ? { url: input.path } : {}),
      images,
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: input.description,
      images,
    },
  };
}
