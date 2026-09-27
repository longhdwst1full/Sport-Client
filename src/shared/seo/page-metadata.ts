import type { Metadata } from 'next';

/**
 * Origin công khai dùng cho canonical, OpenGraph, sitemap, robots. Build-time env
 * (`NEXT_PUBLIC_SITE_URL`, đã khai ở `.env.production`); thiếu thì về domain production.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://baoansport.vn').replace(/\/+$/, '');
export const SITE_NAME = 'Bảo An Sport';

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
  const images = input.images?.filter(Boolean);
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
      ...(images?.length ? { images } : {}),
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: images?.length ? 'summary_large_image' : 'summary',
      title: socialTitle,
      description: input.description,
      ...(images?.length ? { images } : {}),
    },
  };
}
