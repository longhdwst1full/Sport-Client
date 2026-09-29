import type { SupportMessageAuthorType, SupportTicketStatus } from '@/generated/api/support/support.schemas';

/**
 * View model phiếu hỗ trợ phía khách. `support-ticket.mapper.ts` là nơi duy nhất đọc tên field của
 * generated DTO; component chỉ nhận các type dưới đây.
 */
export type { SupportTicketStatus };

export type SupportTicketSummaryView = {
  ticketNo: string;
  subject: string;
  status: SupportTicketStatus;
  updatedAt: string;
};

export type SupportTicketMessageAuthor = SupportMessageAuthorType;

/**
 * SECURITY: thread phía khách không có khái niệm ghi chú nội bộ. Type này cố ý không có `isInternal`;
 * mapper loại mọi tin nội bộ nếu API lỡ trả về, không chuyển nó xuống UI.
 */
export type SupportTicketMessageView = {
  id: string;
  author: SupportTicketMessageAuthor;
  body: string;
  createdAt: string;
};

export type SupportTicketDetailView = SupportTicketSummaryView & {
  createdAt: string;
  /** Optimistic version; gửi lại làm `expectedVersion` khi khách nhắn thêm. */
  version: string;
  resolutionNote: string | null;
  messages: SupportTicketMessageView[];
};

export type CreateSupportRequestInput = {
  subject: string;
  message: string;
  /** Có khi khách chuyển từ trợ lý mua sắm sang nhân viên. */
  conversationId?: string;
};

export type CreatedSupportTicketView = {
  ticketNo: string;
  status: SupportTicketStatus;
  subject: string;
};
