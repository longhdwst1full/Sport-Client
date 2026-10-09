import type { ReactNode } from 'react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { toMegaMenuEntries } from '@/features/catalog';
import { BannerPlacement } from '@/generated/api/content/content.schemas';
import { getActiveBannerViews, getPublicCategories } from './_data/public-data';

// Route group so every storefront-shell page (header/footer) shares one layout
// instance instead of each page rendering <StorefrontLayout> itself.
// Footer đọc banner FOOTER ở server: không đặt revalidate thì trang tĩnh (giỏ hàng, liên hệ…) đóng
// băng banner lúc build. Next lấy giá trị nhỏ nhất giữa layout và page.
export const revalidate = 300;

/**
 * Danh mục cho mega-menu + footer lấy ở server để link danh mục có trong HTML đầu (SEO). Dữ liệu
 * dùng chung cache với trang (`_data/public-data.ts`). Lỗi API → `undefined`: header tự tải ở
 * client, footer dùng danh sách dự phòng.
 */
export default async function StorefrontRouteGroupLayout({ children }: { children: ReactNode }) {
  const [categories, footerBanners] = await Promise.all([
    getPublicCategories(),
    getActiveBannerViews(BannerPlacement.FOOTER),
  ]);
  return (
    <StorefrontLayout
      categories={categories ? toMegaMenuEntries(categories) : undefined}
      footerBanner={footerBanners[0]}
    >
      {children}
    </StorefrontLayout>
  );
}
