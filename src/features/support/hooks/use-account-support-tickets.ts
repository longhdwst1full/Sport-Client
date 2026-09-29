'use client';

import { useMemo, useState } from 'react';
import { useCustomerAuth } from '@/features/auth';
import { useListAccountSupportTickets } from '@/generated/api/support/support';
import { SUPPORT_TICKET_PAGE_SIZE } from '../model/support-ticket.constants';
import { toSupportTicketSummaryView } from '../model/support-ticket.mapper';
import { supportErrorMessage } from '../model/support-error';

/** Danh sách phiếu hỗ trợ của tài khoản + phân trang; trang chỉ nhận view state. */
export function useAccountSupportTickets() {
  const [page, setPage] = useState(1);
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const tickets = useListAccountSupportTickets(
    { page, limit: SUPPORT_TICKET_PAGE_SIZE },
    { query: { enabled: isLoaded && isAuthenticated, retry: false, placeholderData: (previous) => previous } },
  );

  const items = useMemo(() => tickets.data?.items.map(toSupportTicketSummaryView) ?? [], [tickets.data]);
  const total = tickets.data?.meta.total ?? 0;

  return {
    page,
    setPage,
    isLoaded,
    isAuthenticated,
    isLoading: tickets.isLoading,
    isFetching: tickets.isFetching,
    isError: tickets.isError,
    errorMessage: tickets.isError ? supportErrorMessage(tickets.error, 'Không tải được danh sách yêu cầu hỗ trợ.') : null,
    items,
    hasData: Boolean(tickets.data),
    totalPages: Math.max(1, Math.ceil(total / SUPPORT_TICKET_PAGE_SIZE)),
  };
}
