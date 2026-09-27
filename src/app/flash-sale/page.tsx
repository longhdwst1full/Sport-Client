import { FlashSalePage } from '@/features/promotions';
import { buildPageMetadata } from '@/shared/seo/page-metadata';

export const metadata = buildPageMetadata({
  title: 'Flash Sale',
  description: 'Chương trình Flash Sale đang diễn ra tại Bảo An Sport: dụng cụ thể thao chính hãng giá ưu đãi trong thời gian giới hạn.',
  path: '/flash-sale',
});

export default function Page() {
  return <FlashSalePage />;
}
