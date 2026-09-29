'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomerAuth } from '@/features/auth';
import {
  addAccountSupportTicketMessage,
  getGetAccountSupportTicketQueryKey,
  getListAccountSupportTicketsQueryKey,
  useGetAccountSupportTicket,
} from '@/generated/api/support/support';
import type { AccountSupportTicketDetailDto } from '@/generated/api/support/support.schemas';
import { SUPPORT_MESSAGE_MAX_LENGTH } from '../model/support-ticket.constants';
import { toSupportTicketDetailView } from '../model/support-ticket.mapper';
import { isSupportConflict, supportErrorMessage } from '../model/support-error';

/** Chi tiết phiếu hỗ trợ + gửi trả lời của khách. Phiếu CLOSED không nhận trả lời. */
export function useAccountSupportTicket(ticketNo: string) {
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const queryClient = useQueryClient();
  const [reply, setReply] = useState('');
  const detailKey = getGetAccountSupportTicketQueryKey(ticketNo);

  const ticket = useGetAccountSupportTicket(ticketNo, {
    query: { enabled: isLoaded && isAuthenticated && Boolean(ticketNo), retry: false },
  });
  const detail = useMemo(() => (ticket.data ? toSupportTicketDetailView(ticket.data) : undefined), [ticket.data]);

  const addMessage = useMutation<AccountSupportTicketDetailDto, unknown, { body: string; expectedVersion: string }>({
    // IDEMPOTENCY: endpoint này không nhận Idempotency-Key; `expectedVersion` chặn ghi trùng — bấm gửi lại sau khi
    // lần đầu đã thành công sẽ nhận 409 SUPPORT_VERSION_CONFLICT thay vì thêm tin thứ hai.
    mutationFn: (variables) => addAccountSupportTicketMessage(ticketNo, variables),
    retry: false,
    onSuccess: (updated) => {
      setReply('');
      queryClient.setQueryData(detailKey, updated);
      void queryClient.invalidateQueries({ queryKey: getListAccountSupportTicketsQueryKey() });
    },
    onError: (error) => {
      // Xung đột version/phiếu vừa đóng: tải lại để khách thấy tin mới/trạng thái mới, giữ nguyên nội dung đang gõ.
      if (isSupportConflict(error)) void queryClient.invalidateQueries({ queryKey: detailKey });
    },
  });

  const canReply = Boolean(detail) && detail?.status !== 'CLOSED';
  const trimmedReply = reply.trim();

  const submitReply = () => {
    if (!detail || !canReply || !trimmedReply || trimmedReply.length > SUPPORT_MESSAGE_MAX_LENGTH || addMessage.isPending) return;
    addMessage.mutate({ body: trimmedReply, expectedVersion: detail.version });
  };

  return {
    isLoaded,
    isAuthenticated,
    isLoading: ticket.isLoading,
    isError: ticket.isError,
    errorMessage: ticket.isError ? supportErrorMessage(ticket.error, 'Không tìm thấy yêu cầu hỗ trợ.') : null,
    detail,
    canReply,
    reply,
    setReply,
    submitReply,
    isReplying: addMessage.isPending,
    replyErrorMessage: addMessage.isError
      ? supportErrorMessage(addMessage.error, 'Không gửi được trả lời. Vui lòng thử lại.')
      : null,
  };
}
