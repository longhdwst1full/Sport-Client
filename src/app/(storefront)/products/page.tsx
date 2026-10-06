import { ProductsPage } from '@/features/catalog';
import { buildPageMetadata } from '@/lib/seo/page-metadata';

// `/catalog` re-export metadata này nên canonical của nó cũng trỏ về `/products`.
export const metadata = buildPageMetadata({
  title: 'Tất cả thiết bị & Phụ kiện thể thao',
  description:
    'Danh mục trọn bộ thiết bị tập gym, máy chạy bộ, xe đạp thể thao, bóng bàn, bóng rổ và phụ kiện chính hãng Bảo An Sport.',
  path: '/products',
});

// Đọc `searchParams` để server render sẵn trang 1 theo đúng bộ lọc trên URL (SEO + không nháy skeleton).
export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ProductsPage searchParams={searchParams} />;
}
