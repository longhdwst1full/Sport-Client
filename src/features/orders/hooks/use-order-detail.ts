'use client';

import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCustomerAuth } from '@/features/auth';
import {
  getAccountOrder,
  getGetAccountOrderQueryKey,
  getGetGuestOrderByLookupQueryKey,
  getGetGuestOrderQueryKey,
  getGuestOrder,
  getGuestOrderByLookup,
} from '@/generated/api/orders/orders';
import { toOrderDetailView } from '../model/order.mapper';
import {
  CANCELLABLE_PAYMENT_STATUSES,
  FULFILLMENT_STATUS,
  GUEST_ACCESS_RETIRED_ORDER_STATUSES,
  statusIn,
} from '../model/order.constants';
import { readGuestOrderAccessToken, retireGuestOrderAccessToken } from '../model/guest-order-access.store';
import { clearGuestOrderLookupGrant, readGuestOrderLookupGrant } from '../model/guest-order-lookup.store';
import { isGuestLookupTokenInvalid } from '../model/guest-order-lookup-error';

/** Đường truy cập đơn: tài khoản, mã truy cập của trình duyệt đã đặt, hoặc grant tra cứu OTP email (chỉ xem). */
export type OrderAccessMode = 'account' | 'guest-cart' | 'lookup' | 'none';

/**
 * Tải đơn theo đúng đường truy cập: khách đã đăng nhập dùng API tài khoản, khách vãng lai dùng mã truy cập
 * lưu trên trình duyệt đã đặt đơn; không có mã đó thì dùng grant tra cứu OTP email (sessionStorage, 30 phút).
 * Mã truy cập vãng lai bị thu hồi khi đơn sang trạng thái kết thúc.
 */
export function useOrderDetail(orderNo: string) {
  const { isAuthenticated, isLoaded } = useCustomerAuth();

  // SECURITY: chỉ đọc mã truy cập vãng lai khi đã biết chắc khách chưa đăng nhập, để không gửi nhầm
  // `x-cart-token` cho đơn của tài khoản.
  const guestToken = useMemo(
    () => isLoaded && !isAuthenticated ? readGuestOrderAccessToken(orderNo) : null,
    [isAuthenticated, isLoaded, orderNo],
  );

  // SECURITY: grant OTP chỉ dùng khi là khách vãng lai và trình duyệt không có mã truy cập của đơn; mã truy cập (có quyền
  // thanh toán/huỷ) luôn được ưu tiên. Grant chỉ cho XEM đơn.
  const lookupGrant = useMemo(
    () => (isLoaded && !isAuthenticated && !guestToken ? readGuestOrderLookupGrant(orderNo) : null),
    [isAuthenticated, isLoaded, guestToken, orderNo],
  );
  const accessMode: OrderAccessMode = isAuthenticated
    ? 'account'
    : guestToken
      ? 'guest-cart'
      : lookupGrant
        ? 'lookup'
        : 'none';

  const orderQuery = useQuery({
    queryKey:
      accessMode === 'account'
        ? getGetAccountOrderQueryKey(orderNo)
        : accessMode === 'lookup'
          ? getGetGuestOrderByLookupQueryKey(orderNo)
          : getGetGuestOrderQueryKey(orderNo),
    enabled: isLoaded && accessMode !== 'none',
    retry: false,
    queryFn: ({ signal }) => {
      if (accessMode === 'account') return getAccountOrder(orderNo, undefined, signal);
      if (accessMode === 'lookup' && lookupGrant) {
        return getGuestOrderByLookup(orderNo, { headers: { 'x-order-lookup-token': lookupGrant.lookupToken } }, signal);
      }
      return getGuestOrder(orderNo, { headers: { 'x-cart-token': guestToken } }, signal);
    },
  });

  const lookupExpired = accessMode === 'lookup' && orderQuery.isError && isGuestLookupTokenInvalid(orderQuery.error);
  useEffect(() => {
    // Grant hết hạn/bị thu hồi: dọn sessionStorage (hệ thống ngoài React) để lần sau không gửi lại token chết.
    if (lookupExpired) clearGuestOrderLookupGrant(orderNo);
  }, [lookupExpired, orderNo]);

  const order = orderQuery.data;

  useEffect(() => {
    if (!isAuthenticated && order && statusIn(GUEST_ACCESS_RETIRED_ORDER_STATUSES, order.status)) {
      retireGuestOrderAccessToken(order.orderNo);
    }
  }, [isAuthenticated, order]);

  const view = useMemo(() => (order ? toOrderDetailView(order) : undefined), [order]);

  // Grant tra cứu chỉ cho xem: không huỷ/thanh toán qua đường này (API huỷ/thanh toán của khách cần `x-cart-token`).
  const canCancel = accessMode !== 'lookup'
    && order?.status === 'PENDING_CONFIRMATION'
    && statusIn(CANCELLABLE_PAYMENT_STATUSES, order.paymentStatus)
    && order.fulfillmentStatus === FULFILLMENT_STATUS.PENDING;

  return { isAuthenticated, isLoaded, guestToken, accessMode, lookupGrant, lookupExpired, orderQuery, order, view, canCancel };
}
