import { Suspense } from 'react';
import { CheckoutPage, CheckoutSkeleton } from '@/features/checkout';
import { PolicyArticles } from '@/features/content';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';
import { STORE_POLICY_PAGES } from '@/shared/constants';

// SECURITY: trang tài khoản/mật khẩu không được CDN hay trình duyệt lưu đệm — `force-dynamic` để Next gửi
// `Cache-Control: private, no-cache, no-store` thay cho bản prerender `public`.
export const dynamic = 'force-dynamic';

const slugOf = (href: string) => href.slice(href.lastIndexOf('/') + 1);

/** Điều khoản dịch vụ + chính sách đổi trả: nội dung modal đồng ý ở checkout. */
const CHECKOUT_POLICIES = [STORE_POLICY_PAGES.TERMS, STORE_POLICY_PAGES.RETURNS].map(({ href, title }) => ({
  slug: slugOf(href),
  title,
}));

export const metadata = { title: 'Đặt hàng & Thanh toán', robots: NOINDEX_ROBOTS };
export default function Page() {
  // `checkout` không import `content`; route ghép nội dung chính sách vào modal đồng ý điều khoản.
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPage policyContent={<PolicyArticles policies={CHECKOUT_POLICIES} />} />
    </Suspense>
  );
}
