import { AccountReturnsPage } from '@/features/returns';
import { NOINDEX_ROBOTS } from '@/shared/seo/page-metadata';

export const metadata = { title: 'Yêu cầu đổi trả', robots: NOINDEX_ROBOTS };

export default function ReturnsPage() {
  return <AccountReturnsPage />;
}
