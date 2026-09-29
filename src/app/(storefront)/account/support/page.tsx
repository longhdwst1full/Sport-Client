import { AccountSupportTicketsPage } from '@/features/support';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

export const metadata = { title: 'Hỗ trợ của tôi', robots: NOINDEX_ROBOTS };

export default function SupportTicketsPage() {
  return <AccountSupportTicketsPage />;
}
