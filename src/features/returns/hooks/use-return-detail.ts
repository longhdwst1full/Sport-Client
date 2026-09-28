import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomerAuth } from '@/features/auth';
import {
  cancelAccountReturn,
  getGetAccountReturnQueryKey,
  getListAccountReturnsQueryKey,
  useGetAccountReturn,
} from '@/generated/api/returns/returns';
import type { ReturnDetailDto } from '@/generated/api/returns/returns.schemas';
import { canCustomerCancel, toReturnProgress } from '../model/return.mapper';

/** Query chi tiết phiếu đổi trả + mutation huỷ (khách). Giữ nguyên idempotency theo chữ ký request. */
export function useReturnDetail(returnNo: string) {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState('');
  const idempotencyRef = useRef<{ signature: string; key: string } | undefined>(undefined);
  const query = useGetAccountReturn(returnNo, { query: { enabled: isLoaded && isAuthenticated, retry: false } });
  const detail = query.data;

  const cancel = useMutation<ReturnDetailDto>({
    retry: false,
    mutationFn: () => {
      if (!detail) throw new Error('Chưa tải được yêu cầu');
      const body = { expectedVersion: detail.version, reason: reason.trim() };
      const signature = JSON.stringify({ returnNo, ...body });
      if (idempotencyRef.current?.signature !== signature) {
        idempotencyRef.current = { signature, key: crypto.randomUUID() };
      }
      return cancelAccountReturn(returnNo, body, { headers: { 'idempotency-key': idempotencyRef.current.key } });
    },
    onSuccess: async (updated) => {
      idempotencyRef.current = undefined;
      queryClient.setQueryData(getGetAccountReturnQueryKey(returnNo), updated);
      // CACHE: trạng thái đổi làm đổi nhãn trên danh sách phiếu.
      await queryClient.invalidateQueries({ queryKey: getListAccountReturnsQueryKey() });
      setShowCancel(false);
      setReason('');
    },
  });

  const progress = detail ? toReturnProgress(detail) : [];

  return {
    isAuthenticated,
    isLoaded,
    query,
    detail,
    progress,
    showCancel,
    setShowCancel,
    reason,
    setReason,
    cancel,
    canCustomerCancel,
  };
}
