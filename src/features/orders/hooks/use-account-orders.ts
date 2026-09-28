import { useState } from 'react';
import { useCustomerAuth } from '@/features/auth';
import { useListAccountOrders } from '@/generated/api/orders/orders';
import { apiErrorMessage } from '@/lib/api/error-message';
import { toOrderListItemView, type OrderListItemView } from '../model/order.mapper';

function errorMessage(error: unknown): string {
  return apiErrorMessage(error, 'Không tải được danh sách đơn hàng. Vui lòng thử lại.');
}

/** Query + phân trang danh sách đơn của tài khoản; trang render chỉ nhận view state. */
export function useAccountOrders() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const orders = useListAccountOrders(
    { page, limit },
    { query: { enabled: isLoaded && isAuthenticated, retry: false } },
  );

  const items: OrderListItemView[] = orders.data?.items.map(toOrderListItemView) ?? [];
  const total = orders.data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    setPage,
    limit,
    isLoaded,
    isAuthenticated,
    isLoading: orders.isLoading,
    isError: orders.isError,
    errorMessage: orders.isError ? errorMessage(orders.error) : null,
    isFetching: orders.isFetching,
    items,
    total,
    totalPages,
    hasData: Boolean(orders.data),
  };
}
