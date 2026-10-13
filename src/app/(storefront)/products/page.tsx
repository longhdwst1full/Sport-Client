import { ProductsPage } from '@/features/catalog';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { storefrontClientIpHeaders } from '@/lib/api/server/proxy-to-backend';
import { getPublicCategories } from '../_data/public-data';

// `/catalog` re-export metadata này nên canonical của nó cũng trỏ về `/products`.
export const metadata = buildPageMetadata({
  title: 'Tất cả thiết bị & Phụ kiện thể thao',
  description:
    'Danh mục trọn bộ thiết bị tập gym, máy chạy bộ, xe đạp thể thao, bóng bàn, bóng rổ và phụ kiện chính hãng Bảo An Sport.',
  path: '/products',
});

// Đọc `searchParams` để server render sẵn trang 1 theo đúng bộ lọc trên URL (SEO + không nháy skeleton).
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Trang đã động (đọc `searchParams`) nên `headers()` không làm mất ISR; danh mục vẫn đi cache chung.
  return (
    <ProductsPage
      searchParams={searchParams}
      categories={await getPublicCategories()}
      requestHeaders={await storefrontClientIpHeaders()}
    />
  );
}
