import { AccountSupportTicketDetailPage } from '@/features/support';
import { NOINDEX_ROBOTS } from '@/lib/seo/page-metadata';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Chi tiết yêu cầu hỗ trợ', robots: NOINDEX_ROBOTS };

export default async function SupportTicketPage({ params }: { params: Promise<{ ticketNo: string }> }) {
  const { ticketNo } = await params;
  return <AccountSupportTicketDetailPage ticketNo={decodeURIComponent(ticketNo)} />;
}
