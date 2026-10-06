import { cache, type ReactNode } from 'react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { toMegaMenuEntries, type MegaMenuEntry } from '@/features/catalog';
import { listCatalogCategories } from '@/generated/api/catalog/catalog';

// Route group so every storefront-shell page (header/footer) shares one layout
// instance instead of each page rendering <StorefrontLayout> itself.
// Footer đọc banner FOOTER ở server (Axios, không qua `fetch` của Next nên không tự gắn ISR):
// không đặt revalidate thì trang tĩnh (giỏ hàng, liên hệ…) đóng băng banner lúc build. Next lấy
// giá trị nhỏ nhất giữa layout và page, nên trang 120s/động giữ nguyên chế độ của mình.
export const revalidate = 300;

/**
 * Danh mục cho mega-menu + footer, lấy ở server để link danh mục có trong HTML đầu (SEO) thay vì chỉ
 * xuất hiện sau hydrate. Lỗi API → `undefined`: header tự tải ở client, footer dùng danh sách dự phòng.
 */
const loadShellCategories = cache(async (): Promise<MegaMenuEntry[] | undefined> => {
  try {
    const { items } = await listCatalogCategories();
    return toMegaMenuEntries(items);
  } catch {
    return undefined;
  }
});

export default async function StorefrontRouteGroupLayout({ children }: { children: ReactNode }) {
  const categories = await loadShellCategories();
  return <StorefrontLayout categories={categories}>{children}</StorefrontLayout>;
}
