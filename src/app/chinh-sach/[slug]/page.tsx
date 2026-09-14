import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PolicyDetailPage } from '@/features/content';
import {
  isPolicyPost,
  toPolicyDetailView,
  toPolicySummaryView,
} from '@/features/content/model/policy.mapper';
import { getPublishedPost, listPublishedPosts } from '@/generated/api/content/content';

export const revalidate = 0;

async function loadPolicy(slug: string) {
  try {
    const post = await getPublishedPost(slug);
    // `getPublishedPost` trả mọi bài đã đăng; chỉ bài POLICY mới thuộc route này,
    // nếu không /chinh-sach/<slug-tin-tuc> sẽ dựng ra một trang chính sách giả.
    return isPolicyPost(post) ? post : undefined;
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
  const post = await loadPolicy(slug);
  if (!post) return { title: 'Thông tin và chính sách — Bảo An Sport' };

  return {
    title: `${post.title} — Bảo An Sport`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  };
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
