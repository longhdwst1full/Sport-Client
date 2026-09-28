import { CustomerLoginPage } from '@/features/auth';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

export const metadata = { title: 'Đăng nhập', robots: NOINDEX_ROBOTS };

export default function LoginPage() {
  return <CustomerLoginPage />;
}
