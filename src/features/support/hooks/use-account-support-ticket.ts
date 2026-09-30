'use client';

import { useMemo, useRef, useState } from 'react';
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
import { isSupportConflict, requiresFreshSupportIdempotencyKey, supportErrorMessage } from '../model/support-error';

/** Chi tiết phiếu hỗ trợ + gửi trả lời của khách. Phiếu CLOSED không nhận trả lời. */
export function useAccountSupportTicket(ticketNo: string) {
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const queryClient = useQueryClient();
  const [reply, setReply] = useState('');
  const detailKey = getGetAccountSupportTicketQueryKey(ticketNo);
  const idempotencyRef = useRef<{ signature: string; key: string } | undefined>(undefined);

  const ticket = useGetAccountSupportTicket(ticketNo, {
    query: { enabled: isLoaded && isAuthenticated && Boolean(ticketNo), retry: false },
  });
  const detail = useMemo(() => (ticket.data ? toSupportTicketDetailView(ticket.data) : undefined), [ticket.data]);

  const addMessage = useMutation<AccountSupportTicketDetailDto, unknown, { body: string; expectedVersion: string }>({
    mutationFn: (variables) => {
      // IDEMPOTENCY: gửi lại cùng nội dung trên cùng version (sau timeout/lỗi mạng) dùng lại khoá cũ để server trả lại
      // kết quả lần đầu thay vì thêm tin thứ hai; đổi nội dung hoặc version (sau khi tải lại) là ý định mới → khoá mới.
      // `expectedVersion` vẫn chặn ghi đè lên phiếu đã đổi.
      const signature = `${ticketNo}:${variables.expectedVersion}:${variables.body}`;
      if (idempotencyRef.current?.signature !== signature) {
        idempotencyRef.current = { signature, key: crypto.randomUUID() };
      }
      return addAccountSupportTicketMessage(ticketNo, variables, {
        headers: { 'idempotency-key': idempotencyRef.current.key },
      });
    },
    retry: false,
    onSuccess: (updated) => {
      idempotencyRef.current = undefined;
      setReply('');
      queryClient.setQueryData(detailKey, updated);
      void queryClient.invalidateQueries({ queryKey: getListAccountSupportTicketsQueryKey() });
    },
    onError: (error) => {
      // Khoá bị từ chối (sai định dạng / đã dùng cho nội dung khác): lần gửi sau phải dùng khoá mới.
      if (requiresFreshSupportIdempotencyKey(error)) idempotencyRef.current = undefined;
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
