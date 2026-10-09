'use client';

import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createConsultationRequest } from '@/generated/api/support/support';
import type {
  ConsultationRequestResultDto,
  CreateConsultationRequestDto,
} from '@/generated/api/support/support.schemas';
import { requiresFreshSupportIdempotencyKey, supportErrorMessage } from '../model/support-error';

/**
 * Yêu cầu tư vấn của khách CHƯA đăng nhập (`createConsultationRequest`): API trả mã phiếu, không echo
 * thông tin cá nhân. Khách đã đăng nhập dùng `useCreateSupportRequest` để phiếu gắn hồ sơ.
 */
export function useCreateConsultationRequest() {
  const idempotencyRef = useRef<{ signature: string; key: string } | undefined>(undefined);

  const mutation = useMutation<ConsultationRequestResultDto, unknown, CreateConsultationRequestDto>({
    mutationFn: (input) => {
      // IDEMPOTENCY: gửi lại đúng nội dung (timeout/lỗi mạng) dùng lại khoá để server trả lại phiếu cũ;
      // đổi nội dung là ý định mới nên sinh khoá mới (cùng khoá khác nội dung = 409).
      const signature = JSON.stringify(input);
      if (idempotencyRef.current?.signature !== signature) {
        idempotencyRef.current = { signature, key: crypto.randomUUID() };
      }
      return createConsultationRequest(input, { headers: { 'idempotency-key': idempotencyRef.current.key } });
    },
    retry: false,
    onSuccess: () => {
      idempotencyRef.current = undefined;
    },
    onError: (error) => {
      if (requiresFreshSupportIdempotencyKey(error)) idempotencyRef.current = undefined;
    },
  });

  return {
    submit: (input: CreateConsultationRequestDto) => {
      if (!mutation.isPending) mutation.mutate(input);
    },
    ticketNo: mutation.data?.ticketNo,
    isPending: mutation.isPending,
    errorMessage: mutation.isError
      ? supportErrorMessage(mutation.error, 'Không gửi được yêu cầu tư vấn. Vui lòng thử lại hoặc gọi hotline.')
      : null,
    reset: mutation.reset,
  };
}
