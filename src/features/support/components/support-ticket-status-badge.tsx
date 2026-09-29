import { Badge } from '@/foundation/components/tabs-chips';
import { supportTicketStatusLabels, supportTicketStatusTone } from '../model/support-ticket.constants';
import type { SupportTicketStatus } from '../model/support-ticket.types';

export function SupportTicketStatusBadge({ status, className = '' }: { status: SupportTicketStatus; className?: string }) {
  return (
    <Badge className={`rounded-full px-3 py-1 text-xs font-bold ${supportTicketStatusTone[status]} ${className}`}>
      {supportTicketStatusLabels[status]}
    </Badge>
  );
}
