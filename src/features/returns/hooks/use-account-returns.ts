import { useState } from 'react';
import { useCustomerAuth } from '@/features/auth';
import { useListAccountReturns } from '@/generated/api/returns/returns';
import { RETURN_PAGE_SIZE } from '../model/return.constants';
import { apiErrorMessage } from '@/lib/api/error-message';

/** Query + phân trang danh sách phiếu đổi trả của tài khoản. */
export function useAccountReturns() {
  const [page, setPage] = useState(1);
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const returns = useListAccountReturns(
    { page, limit: RETURN_PAGE_SIZE },
    { query: { enabled: isLoaded && isAuthenticated, retry: false } },
  );
  const totalPages = returns.data ? Math.ceil(returns.data.total / RETURN_PAGE_SIZE) : 1;

  return {
    page,
    setPage,
    isLoaded,
    isAuthenticated,
    isLoading: returns.isLoading,
    isError: returns.isError,
    errorMessage: returns.isError ? apiErrorMessage(returns.error, 'Không tải được danh sách yêu cầu đổi trả.', { includeClientErrors: true }) : null,
    isFetching: returns.isFetching,
    items: returns.data?.items ?? [],
    hasData: Boolean(returns.data),
    totalPages,
  };
}
