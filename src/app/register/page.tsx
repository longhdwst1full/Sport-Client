import { CustomerRegisterPage } from '@/features/auth';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

export const metadata = { title: 'Đăng ký tài khoản', robots: NOINDEX_ROBOTS };

export default function RegisterPage() {
  return <CustomerRegisterPage />;
}
