import { SearchPage } from '@/features/catalog';
import { NOINDEX_ROBOTS } from '@/shared/seo/page-metadata';

// Trang kết quả tìm kiếm là nội dung mỏng/trùng lặp theo từ khoá: không index, vẫn cho đi theo link.
export const metadata = { title: 'Tìm kiếm sản phẩm', robots: NOINDEX_ROBOTS };

export default function Page() {
  return <SearchPage />;
}
