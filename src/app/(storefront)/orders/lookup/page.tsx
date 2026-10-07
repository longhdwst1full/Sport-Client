import { GuestOrderLookupPage } from '@/features/orders';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

// SECURITY: trang tài khoản/mật khẩu không được CDN hay trình duyệt lưu đệm — `force-dynamic` để Next gửi
// `Cache-Control: private, no-cache, no-store` thay cho bản prerender `public`.
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Tra cứu đơn hàng', robots: NOINDEX_ROBOTS };

export default async function OrderLookupPage({ searchParams }: { searchParams: Promise<{ orderNo?: string | string[] }> }) {
  const { orderNo } = await searchParams;
  const initialOrderNo = typeof orderNo === 'string' ? orderNo.slice(0, 32) : '';
  return <GuestOrderLookupPage initialOrderNo={initialOrderNo} />;
}
