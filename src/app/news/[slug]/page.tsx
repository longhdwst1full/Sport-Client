import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleDetailPage } from '@/features/content';
import {
  POLICY_POST_TYPE,
  toArticleDetailView,
  toContentPostView,
} from '@/features/content/model/content-post.mapper';
import { getPublishedPost, listPublishedPosts } from '@/generated/api/content/content';

export const revalidate = 0;

async function loadArticle(slug: string) {
  try {
    const post = await getPublishedPost(slug);
    // Trang chính sách nằm chung bảng với bài viết nhưng có route riêng; không loại ra
    // thì /news/<slug-chinh-sach> sẽ dựng một bài viết giả từ trang bảo hành, đổi trả.
    return post.postType === POLICY_POST_TYPE ? undefined : post;
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadArticle(slug);
  if (!post) return { title: 'Tin tức — Bảo An Sport' };

  return {
    title: `${post.title} — Bảo An Sport`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: post.coverUrl ? [post.coverUrl] : undefined,
      publishedTime: post.publishedAt,
    },
  };
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
