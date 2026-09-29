'use client';

import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSupportRequest,
  getGetAccountSupportTicketQueryKey,
  getListAccountSupportTicketsQueryKey,
} from '@/generated/api/support/support';
import type { AccountSupportTicketDetailDto } from '@/generated/api/support/support.schemas';
import { toCreatedSupportTicketView } from '../model/support-ticket.mapper';
import type { CreateSupportRequestInput, CreatedSupportTicketView } from '../model/support-ticket.types';
import { supportErrorMessage } from '../model/support-error';

/**
 * Tạo phiếu hỗ trợ (form "Tạo yêu cầu hỗ trợ" và nút "Chuyển nhân viên" của trợ lý).
 * V1.0 yêu cầu khách đăng nhập; caller phải chặn khách ẩn danh trước khi gọi `submit`.
 */
export function useCreateSupportRequest(options: { onCreated?: (ticket: CreatedSupportTicketView) => void } = {}) {
  const queryClient = useQueryClient();
  const idempotencyRef = useRef<{ signature: string; key: string } | undefined>(undefined);

  const mutation = useMutation<AccountSupportTicketDetailDto, unknown, CreateSupportRequestInput>({
    mutationFn: (input) => {
      // IDEMPOTENCY: gửi lại đúng nội dung (sau timeout/lỗi mạng) dùng lại key cũ để server trả lại phiếu cũ thay vì
      // tạo phiếu thứ hai; đổi nội dung là ý định mới nên sinh key mới (cùng key khác nội dung = 409).
      const signature = JSON.stringify([input.subject, input.message, input.conversationId ?? null]);
      if (idempotencyRef.current?.signature !== signature) {
        idempotencyRef.current = { signature, key: crypto.randomUUID() };
      }
      return createSupportRequest(input, { headers: { 'idempotency-key': idempotencyRef.current.key } });
    },
    retry: false,
    onSuccess: (ticket) => {
      idempotencyRef.current = undefined;
      queryClient.setQueryData(getGetAccountSupportTicketQueryKey(ticket.ticketNo), ticket);
      void queryClient.invalidateQueries({ queryKey: getListAccountSupportTicketsQueryKey() });
      options.onCreated?.(toCreatedSupportTicketView(ticket));
    },
  });

  const submit = (input: CreateSupportRequestInput) => {
    if (mutation.isPending) return;
    mutation.mutate(input);
  };

  return {
    submit,
    created: mutation.data ? toCreatedSupportTicketView(mutation.data) : undefined,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    errorMessage: mutation.isError
      ? supportErrorMessage(mutation.error, 'Không gửi được yêu cầu hỗ trợ. Vui lòng thử lại.')
      : null,
    reset: mutation.reset,
  };
}
