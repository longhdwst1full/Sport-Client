import { NEWS_PAGE_SIZE, NewsListPage, toNewsPostViews } from '@/features/content';
import { listPublishedPosts } from '@/generated/api/content/content';
import { buildPageMetadata } from '@/lib/seo/page-metadata';

// ISR 5 phút như `/news/[slug]`; bài mới hiện ngay khi API gọi `POST /api/revalidate`.
export const revalidate = 300;

export const metadata = buildPageMetadata({
  title: 'Tin tức & Kiến thức thể thao',
  description:
    'Bài viết kỹ thuật tập luyện, cẩm nang chọn thiết bị tập gym, xe đạp tập, bóng bàn và kinh nghiệm bảo dưỡng từ Bảo An Sport.',
  path: '/news',
});

/** Trang 1 lấy ở server để HTML có bài viết; lỗi thì để island client tự tải (không chặn trang). */
async function loadFirstPage() {
  try {
    const page = await listPublishedPosts({ page: 1, limit: NEWS_PAGE_SIZE });
    return { posts: toNewsPostViews(page.items), hasMore: page.meta.hasMore };
  } catch {
    return undefined;
  }
}

export default async function Page() {
  const firstPage = await loadFirstPage();
  return <NewsListPage initialPosts={firstPage?.posts} initialHasMore={firstPage?.hasMore} />;
}
