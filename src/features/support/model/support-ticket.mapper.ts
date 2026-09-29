import type {
  AccountSupportTicketDetailDto,
  SupportTicketDto,
  SupportTicketMessageDto,
} from '@/generated/api/support/support.schemas';
import type {
  CreatedSupportTicketView,
  SupportTicketDetailView,
  SupportTicketMessageView,
  SupportTicketSummaryView,
} from './support-ticket.types';

export function toSupportTicketSummaryView(dto: SupportTicketDto): SupportTicketSummaryView {
  return { ticketNo: dto.ticketNo, subject: dto.subject, status: dto.status, updatedAt: dto.updatedAt };
}

/**
 * SECURITY: API khách không bao giờ trả ghi chú nội bộ (contract không có field này). Vẫn lọc phòng thủ:
 * nếu một bản API sau lỡ thêm `isInternal`, tin đó không bao giờ tới màn hình của khách.
 */
function isCustomerVisible(message: SupportTicketMessageDto): boolean {
  return (message as SupportTicketMessageDto & { isInternal?: unknown }).isInternal !== true;
}

function toMessageView(dto: SupportTicketMessageDto): SupportTicketMessageView {
  return { id: dto.id, author: dto.authorType, body: dto.body, createdAt: dto.createdAt };
}

export function toSupportTicketDetailView(dto: AccountSupportTicketDetailDto): SupportTicketDetailView {
  return {
    ticketNo: dto.ticketNo,
    subject: dto.subject,
    status: dto.status,
    updatedAt: dto.updatedAt,
    createdAt: dto.createdAt,
    version: dto.version,
    resolutionNote: dto.resolutionNote ?? null,
    messages: dto.messages.filter(isCustomerVisible).map(toMessageView),
  };
}

export function toCreatedSupportTicketView(dto: AccountSupportTicketDetailDto): CreatedSupportTicketView {
  return { ticketNo: dto.ticketNo, status: dto.status, subject: dto.subject };
}
