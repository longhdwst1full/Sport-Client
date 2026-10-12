import { Suspense } from 'react';
import { CHECKOUT_POLICY_LABEL, CheckoutPage, CheckoutSkeleton, POLICY_LINK_CLASS } from '@/features/checkout';
import { PolicyDialogLink } from '@/features/content';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';
import { STORE_POLICY_PAGES } from '@/shared/constants';

// SECURITY: trang tài khoản/mật khẩu không được CDN hay trình duyệt lưu đệm — `force-dynamic` để Next gửi
// `Cache-Control: private, no-cache, no-store` thay cho bản prerender `public`.
export const dynamic = 'force-dynamic';

const slugOf = (href: string) => href.slice(href.lastIndexOf('/') + 1);

export const metadata = { title: 'Đặt hàng & Thanh toán', robots: NOINDEX_ROBOTS };
export default function Page() {
  // `checkout` không import `content`; route ghép link chính sách dạng modal vào ô đồng ý điều khoản.
  const policyLinks = {
    terms: (
      <PolicyDialogLink slug={slugOf(STORE_POLICY_PAGES.TERMS.href)} title={STORE_POLICY_PAGES.TERMS.title} className={POLICY_LINK_CLASS}>
        {CHECKOUT_POLICY_LABEL.TERMS}
      </PolicyDialogLink>
    ),
    returns: (
      <PolicyDialogLink slug={slugOf(STORE_POLICY_PAGES.RETURNS.href)} title={STORE_POLICY_PAGES.RETURNS.title} className={POLICY_LINK_CLASS}>
        {CHECKOUT_POLICY_LABEL.RETURNS}
      </PolicyDialogLink>
    ),
  };

  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPage policyLinks={policyLinks} />
    </Suspense>
  );
}
