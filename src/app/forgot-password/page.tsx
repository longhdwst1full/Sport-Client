import { ForgotPasswordPage } from '@/features/auth';
import { NOINDEX_ROBOTS } from '@/shared/seo/page-metadata';

export const metadata = { title: 'Quên mật khẩu', robots: NOINDEX_ROBOTS };

export default function Page() {
  return <ForgotPasswordPage />;
}
