import type { ReactNode } from 'react';
import { StorefrontLayout } from '@/layouts/storefront-layout';

// Route group so every storefront-shell page (header/footer) shares one layout
// instance instead of each page rendering <StorefrontLayout> itself.
// Footer đọc banner FOOTER ở server (Axios, không qua `fetch` của Next nên không tự gắn ISR):
// không đặt revalidate thì trang tĩnh (giỏ hàng, liên hệ…) đóng băng banner lúc build. Next lấy
// giá trị nhỏ nhất giữa layout và page, nên trang 120s/động giữ nguyên chế độ của mình.
export const revalidate = 300;

export default function StorefrontRouteGroupLayout({ children }: { children: ReactNode }) {
  return <StorefrontLayout>{children}</StorefrontLayout>;
}
