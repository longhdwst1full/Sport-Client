import { SupportTicketStatus as SupportTicketStatusCode } from '@/generated/api/support/support.schemas';
import type { SupportTicketMessageAuthor, SupportTicketStatus } from './support-ticket.types';

export const SUPPORT_TICKET_PAGE_SIZE = 10;
// Trần khớp `SUPPORT_LIMITS` của API (subject 255, message/body 4000).
export const SUPPORT_SUBJECT_MAX_LENGTH = 255;
export const SUPPORT_MESSAGE_MAX_LENGTH = 4000;
export const SUPPORT_SUBJECT_MIN_LENGTH = 1;

/** Route tài khoản; `/account/*` đã là network-only trong service worker. */
export const SUPPORT_ROUTES = {
  list: '/account/support',
  create: '/account/support/new',
  detail: (ticketNo: string) => `/account/support/${encodeURIComponent(ticketNo)}`,
} as const;

/** `Record<Status, …>` bắt lỗi compile khi contract thêm trạng thái mà quên nhãn. */
export const supportTicketStatusLabels: Record<SupportTicketStatus, string> = {
  OPEN: 'Đang chờ tiếp nhận',
  ASSIGNED: 'Nhân viên đang xử lý',
  RESOLVED: 'Đã giải quyết',
  CLOSED: 'Đã đóng',
};

export const supportTicketStatusTone: Record<SupportTicketStatus, string> = {
  OPEN: 'bg-amber-50 text-amber-800',
  ASSIGNED: 'bg-sky-50 text-sky-800',
  RESOLVED: 'bg-emerald-50 text-emerald-800',
  CLOSED: 'bg-slate-100 text-slate-600',
};

export const SUPPORT_FIELD_LABELS = {
  ticketNo: 'Mã yêu cầu',
  subject: 'Tiêu đề',
  message: 'Nội dung',
  status: 'Trạng thái',
  updatedAt: 'Cập nhật',
  createdAt: 'Ngày tạo',
  reply: 'Trả lời',
} as const;

export const SUPPORT_AUTHOR_LABELS: Record<SupportTicketMessageAuthor, string> = {
  CUSTOMER: 'Bạn',
  STAFF: 'Nhân viên Bảo An Sport',
  SYSTEM: 'Hệ thống',
};

const SUPPORT_TICKET_STATUS_CODES: readonly string[] = Object.values(SupportTicketStatusCode);

/** Thẻ phiếu trong chat mang `status` dạng chuỗi tự do; chỉ nhận mã trạng thái contract biết. */
export function isSupportTicketStatus(value: string): value is SupportTicketStatus {
  return SUPPORT_TICKET_STATUS_CODES.includes(value);
}
