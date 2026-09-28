import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleDetailPage } from '@/features/content';
import {
  POLICY_POST_TYPE,
  toArticleDetailView,
  toContentPostView,
} from '@/features/content';
import { getPublishedPost, listPublishedPosts } from '@/generated/api/content/content';
import { ApiError } from '@/lib/api/fetcher';
import { buildPageMetadata } from '@/lib/seo/page-metadata';

// ISR 5 phút thay cho render mỗi request: bài viết đổi trong ngày là cùng. Bài mới/sửa hiện ngay
// khi API gọi `POST /api/revalidate` (xem `src/app/api/revalidate/route.ts`).
export const revalidate = 300;

// Không build trước slug nào; render lần đầu theo yêu cầu rồi cache theo `revalidate`.
export function generateStaticParams() {
  return [];
}

/**
 * `cache` gộp lượt gọi của `generateMetadata` và `Page` trong cùng request.
 *
 * Chỉ 404 của API mới là "không có bài". Lỗi tạm thời (mạng, 5xx) phải ném ra: với ISR, trả
 * `undefined` ở đây sẽ đóng băng một trang 404 suốt cửa sổ revalidate, còn ném lỗi thì Next giữ
 * nguyên bản tốt trước đó.
 */
const loadArticle = cache(async (slug: string) => {
  try {
    const post = await getPublishedPost(slug);
    // Trang chính sách nằm chung bảng với bài viết nhưng có route riêng; không loại ra
    // thì /news/<slug-chinh-sach> sẽ dựng một bài viết giả từ trang bảo hành, đổi trả.
    return post.postType === POLICY_POST_TYPE ? undefined : post;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadArticle(slug);
  if (!post) return { title: 'Tin tức' };

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/news/${post.slug}`,
    type: 'article',
    images: post.coverUrl ? [post.coverUrl] : undefined,
    publishedTime: post.publishedAt,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await loadArticle(slug);
  if (!post) notFound();

  let related: ReturnType<typeof toContentPostView>[] = [];
  try {
    // Contract chỉ nhận bộ lọc loại bài, không có tham số giới hạn; cắt ở đây.
    const list = await listPublishedPosts({ postType: post.postType });
    related = list.items
      .filter((item) => item.slug !== post.slug)
      .slice(0, 4)
      .map(toContentPostView);
  } catch {
    // Thiếu gợi ý bài liên quan không đáng để hỏng cả trang đang đọc.
    related = [];
  }

  return <ArticleDetailPage article={toArticleDetailView(post)} related={related} />;
}
