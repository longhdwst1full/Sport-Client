import { ProfilePage } from '@/features/profile';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

export const metadata = {
  title: 'Tài khoản thành viên',
  robots: NOINDEX_ROBOTS,
  description: 'Quản lý thông tin cá nhân, sổ địa chỉ nhận hàng, lịch sử đơn hàng và tra cứu bảo hành điện tử chính hãng tại Bảo An Sport.',
};

export default function Page() {
  return <ProfilePage />;
}
