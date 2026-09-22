import { Suspense } from 'react';
import { ResetPasswordPage } from '@/features/auth';

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
