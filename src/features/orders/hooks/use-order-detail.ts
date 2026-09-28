'use client';

import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCustomerAuth } from '@/features/auth';
import {
  getAccountOrder,
  getGetAccountOrderQueryKey,
  getGetGuestOrderQueryKey,
  getGuestOrder,
} from '@/generated/api/orders/orders';
import { toOrderDetailView } from '../model/order.mapper';
import {
  CANCELLABLE_PAYMENT_STATUSES,
  FULFILLMENT_STATUS,
  GUEST_ACCESS_RETIRED_ORDER_STATUSES,
  statusIn,
} from '../model/order.constants';
import { readGuestOrderAccessToken, retireGuestOrderAccessToken } from '../model/guest-order-access.store';

/**
 * Tải đơn theo đúng đường truy cập: khách đã đăng nhập dùng API tài khoản, khách vãng lai dùng mã truy cập
 * lưu trên trình duyệt đã đặt đơn. Mã truy cập vãng lai bị thu hồi khi đơn sang trạng thái kết thúc.
 */
export function useOrderDetail(orderNo: string) {
  const { isAuthenticated, isLoaded } = useCustomerAuth();

  // SECURITY: chỉ đọc mã truy cập vãng lai khi đã biết chắc khách chưa đăng nhập, để không gửi nhầm
  // `x-cart-token` cho đơn của tài khoản.
  const guestToken = useMemo(
    () => isLoaded && !isAuthenticated ? readGuestOrderAccessToken(orderNo) : null,
    [isAuthenticated, isLoaded, orderNo],
  );

  const orderQuery = useQuery({
    queryKey: isAuthenticated ? getGetAccountOrderQueryKey(orderNo) : getGetGuestOrderQueryKey(orderNo),
    enabled: isLoaded && (isAuthenticated || Boolean(guestToken)),
    retry: false,
    queryFn: ({ signal }) => isAuthenticated
      ? getAccountOrder(orderNo, undefined, signal)
      : getGuestOrder(orderNo, { headers: { 'x-cart-token': guestToken } }, signal),
  });

  const order = orderQuery.data;

  useEffect(() => {
    if (!isAuthenticated && order && statusIn(GUEST_ACCESS_RETIRED_ORDER_STATUSES, order.status)) {
      retireGuestOrderAccessToken(order.orderNo);
    }
  }, [isAuthenticated, order]);

  const view = useMemo(() => (order ? toOrderDetailView(order) : undefined), [order]);

  const canCancel = order?.status === 'PENDING_CONFIRMATION'
    && statusIn(CANCELLABLE_PAYMENT_STATUSES, order.paymentStatus)
    && order.fulfillmentStatus === FULFILLMENT_STATUS.PENDING;

  return { isAuthenticated, isLoaded, guestToken, orderQuery, order, view, canCancel };
}
