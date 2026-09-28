import { Suspense } from 'react';
import { ResetPasswordPage } from '@/features/auth';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

export const metadata = { title: 'Đặt lại mật khẩu', robots: NOINDEX_ROBOTS };

/**
 * `useSearchParams` cần Suspense ở App Router, nếu không cả trang bị ép render phía client.
 */
export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
