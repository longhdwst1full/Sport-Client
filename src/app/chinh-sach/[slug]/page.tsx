import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PolicyDetailPage } from '@/features/content';
import {
  isPolicyPost,
  toPolicyDetailView,
  toPolicySummaryView,
} from '@/features/content/model/policy.mapper';
import { getPublishedPost, listPublishedPosts } from '@/generated/api/content/content';
import { ApiError } from '@/lib/api/fetcher';
import { buildPageMetadata } from '@/shared/seo/page-metadata';

// ISR 5 phút; chính sách vừa sửa hiện ngay khi API gọi `POST /api/revalidate`.
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

/** Chỉ 404 mới là "không có trang"; lỗi tạm thời ném ra để ISR giữ bản tốt trước đó. */
const loadPolicy = cache(async (slug: string) => {
  try {
    const post = await getPublishedPost(slug);
    // `getPublishedPost` trả mọi bài đã đăng; chỉ bài POLICY mới thuộc route này,
    // nếu không /chinh-sach/<slug-tin-tuc> sẽ dựng ra một trang chính sách giả.
    return isPolicyPost(post) ? post : undefined;
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
  const post = await loadPolicy(slug);
  if (!post) return { title: 'Thông tin và chính sách' };

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/chinh-sach/${post.slug}`,
    type: 'article',
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await loadPolicy(slug);
  if (!post) notFound();

  let others: Awaited<ReturnType<typeof listPublishedPosts>>['items'] = [];
  try {
    others = (await listPublishedPosts({ postType: 'POLICY' })).items;
  } catch {
    others = [];
  }

  return (
    <PolicyDetailPage
      policy={toPolicyDetailView(post)}
      others={others.filter((item) => item.slug !== post.slug).map(toPolicySummaryView)}
    />
  );
}
