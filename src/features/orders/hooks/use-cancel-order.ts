'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cancelAccountOrder,
  cancelGuestOrder,
  getGetAccountOrderQueryKey,
  getGetGuestOrderQueryKey,
  getListAccountOrdersQueryKey,
} from '@/generated/api/orders/orders';
import type { OrderDetailDto } from '@/generated/api/orders/orders.schemas';
import { useSignatureIdempotencyKey } from './use-signature-idempotency-key';

/** Hộp thoại hủy đơn: lý do, trạng thái mở/đóng và lệnh hủy idempotent theo đường truy cập của khách. */
export function useCancelOrder({
  orderNo,
  order,
  isAuthenticated,
  guestToken,
  triggerToast,
}: {
  orderNo: string;
  order: OrderDetailDto | undefined;
  isAuthenticated: boolean;
  guestToken: string | null;
  triggerToast: (msg: string) => void;
}) {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const idempotency = useSignatureIdempotencyKey();

  const cancel = useMutation({
    mutationFn: async (): Promise<OrderDetailDto> => {
      if (!order) throw new Error('Chưa tải được đơn hàng');
      const normalizedReason = reason.trim();
      // IDEMPOTENCY: cùng đơn, cùng version và cùng lý do thì bấm lại dùng lại key cũ; đổi một trong ba
      // (hoặc đóng hộp thoại / hủy thành công) mới sinh key mới.
      const signature = `${order.id}:${order.version}:${normalizedReason}`;
      const headers = { 'idempotency-key': idempotency.keyFor(signature) };
      return isAuthenticated
        ? cancelAccountOrder(orderNo, { expectedVersion: order.version, reason: normalizedReason }, { headers })
        : cancelGuestOrder(orderNo, { expectedVersion: order.version, reason: normalizedReason }, { headers: { ...headers, 'x-cart-token': guestToken } });
    },
    retry: false,
    onSuccess: async (updated) => {
      const key = isAuthenticated ? getGetAccountOrderQueryKey(orderNo) : getGetGuestOrderQueryKey(orderNo);
      queryClient.setQueryData(key, updated);
      if (isAuthenticated) {
        await queryClient.invalidateQueries({ queryKey: getListAccountOrdersQueryKey() });
      }
      idempotency.reset();
      cancel.reset();
      setShowCancel(false);
      setReason('');
      triggerToast('Đã hủy đơn hàng thành công');
    },
  });

  const closeCancel = () => {
    if (cancel.isPending) return;
    cancel.reset();
    idempotency.reset();
    setReason('');
    setShowCancel(false);
  };

  return { reason, setReason, showCancel, setShowCancel, cancel, closeCancel };
}
