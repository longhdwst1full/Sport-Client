import { CreateSupportRequestPage } from '@/features/support';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

export const metadata = { title: 'Tạo yêu cầu hỗ trợ', robots: NOINDEX_ROBOTS };

export default function NewSupportRequestPage() {
  return <CreateSupportRequestPage />;
}
