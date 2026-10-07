import { CartPage } from '@/features/cart';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

// SECURITY: trang tài khoản/mật khẩu không được CDN hay trình duyệt lưu đệm — `force-dynamic` để Next gửi
// `Cache-Control: private, no-cache, no-store` thay cho bản prerender `public`.
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Giỏ hàng', robots: NOINDEX_ROBOTS };
export default function Page() {
  return <CartPage />;
}
