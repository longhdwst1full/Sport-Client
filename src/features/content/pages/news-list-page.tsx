import { Breadcrumb } from '@/foundation/components/navigation';
import { NewsListFeed } from '../components/news-list-feed';
import type { ContentPostView } from '../model/content-post.mapper';

/**
 * Server component: h1, breadcrumb, phần giới thiệu và trang 1 bài viết (route lấy ở server) có sẵn
 * trong HTML cho SEO. Bộ lọc và "Xem thêm" nằm trong island `NewsListFeed`.
 * `initialPosts` undefined (API lỗi lúc render server) thì island tự tải trang 1 ở client.
 */
export function NewsListPage({
  initialPosts,
  initialHasMore,
}: {
  initialPosts?: ContentPostView[];
  initialHasMore?: boolean;
}) {
  return (
    <div className="bg-slate-50/60 pb-20 pt-8">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Kiến thức luyện tập & Tin tức' },
          ]}
        />

        <div className="max-w-2xl">
          <span className="rounded-full bg-brand-50 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-brand-700">
            Bảo An Sport Journal
          </span>
          <h1 className="mt-3 text-3xl font-black text-ink sm:text-5xl">
            Kiến thức tập luyện & Tin tức thể thao
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Tổng hợp bài viết phân tích kỹ thuật, cẩm nang chọn thiết bị tập gym, xe đạp tập, bàn bóng bàn và kinh nghiệm bảo dưỡng từ chuyên gia Bảo An Sport.
          </p>
        </div>

        <NewsListFeed initialPosts={initialPosts} initialHasMore={initialHasMore} />
      </main>
    </div>
  );
}
