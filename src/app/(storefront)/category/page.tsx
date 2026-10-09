import { CategoryListPage } from '@/features/catalog';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { getPublicCategories } from '../_data/public-data';

// Danh mục thay đổi chậm nhưng vẫn phải tự làm mới: ISR 5 phút thay vì
// đóng băng kết quả tại thời điểm build (`01-next-rendering.md`, `02-api-contract.md`).
export const revalidate = 300;

export const metadata = buildPageMetadata({
  title: 'Danh mục thiết bị thể thao chính hãng',
  description:
    'Khám phá trọn bộ các dòng thiết bị thể hình, máy chạy bộ, xe đạp tập, bàn bóng bàn và dụng cụ võ thuật chính hãng tại Bảo An Sport.',
  path: '/category',
});

export default async function Page() {
  return <CategoryListPage categories={(await getPublicCategories()) ?? []} />;
}
