import { NewsListPage } from '@/features/content';
import { buildPageMetadata } from '@/lib/seo/page-metadata';

export const metadata = buildPageMetadata({
  title: 'Tin tức & Kiến thức thể thao',
  description:
    'Bài viết kỹ thuật tập luyện, cẩm nang chọn thiết bị tập gym, xe đạp tập, bóng bàn và kinh nghiệm bảo dưỡng từ Bảo An Sport.',
  path: '/news',
});

export default function Page() {
  return <NewsListPage />;
}
