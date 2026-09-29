import { describe, expect, it } from 'vitest';
import type { AccountSupportTicketDetailDto, SupportTicketMessageDto } from '@/generated/api/support/support.schemas';
import { supportTicketStatusLabels } from './support-ticket.constants';
import { toCreatedSupportTicketView, toSupportTicketDetailView } from './support-ticket.mapper';

const msg = (id: string, extra: Record<string, unknown> = {}): SupportTicketMessageDto =>
  ({ id, authorType: 'STAFF', body: `b${id}`, createdAt: '2026-09-29T00:00:00.000Z', ...extra }) as SupportTicketMessageDto;

const detail = (messages: SupportTicketMessageDto[]): AccountSupportTicketDetailDto => ({
  id: '1',
  ticketNo: 'T-1',
  status: 'OPEN',
  priority: 'NORMAL',
  subject: 'Hỏi',
  createdAt: 'c',
  updatedAt: 'u',
  version: '3',
  messages,
});

describe('toSupportTicketDetailView', () => {
  it('bỏ mọi tin có isInternal === true, giữ tin còn lại theo thứ tự', () => {
    const view = toSupportTicketDetailView(
      detail([msg('1'), msg('2', { isInternal: true }), msg('3', { isInternal: false }), msg('4')]),
    );
    expect(view.messages.map((m) => m.id)).toEqual(['1', '3', '4']);
  });

  it('view tin nhắn không lộ field isInternal; resolutionNote thiếu thành null', () => {
    const view = toSupportTicketDetailView(detail([msg('1', { isInternal: false })]));
    expect(view.messages[0]).toEqual({ id: '1', author: 'STAFF', body: 'b1', createdAt: '2026-09-29T00:00:00.000Z' });
    expect(view.resolutionNote).toBeNull();
    expect(view.version).toBe('3');
  });

  it('toCreatedSupportTicketView chỉ lấy ticketNo/status/subject', () => {
    expect(toCreatedSupportTicketView(detail([]))).toEqual({ ticketNo: 'T-1', status: 'OPEN', subject: 'Hỏi' });
  });
});

describe('supportTicketStatusLabels', () => {
  it('có nhãn tiếng Việt cho mọi trạng thái', () => {
    expect(supportTicketStatusLabels).toEqual({
      OPEN: 'Đang chờ tiếp nhận',
      ASSIGNED: 'Nhân viên đang xử lý',
      RESOLVED: 'Đã giải quyết',
      CLOSED: 'Đã đóng',
    });
  });
});
