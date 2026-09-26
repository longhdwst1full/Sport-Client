'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGetCustomerProfile } from '@/generated/api/customer/customer';
import type { CustomerProfileDto } from '@/generated/api/customer/customer.schemas';
import {
  isCustomerAuthenticated,
  readCustomerAuthTokens,
  clearCustomerAuthTokens,
} from '../model/auth-token.store';
import { ApiError } from '@/lib/api/fetcher';

export function useCustomerAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const checkAuth = useCallback(() => {
    setIsAuthenticated(isCustomerAuthenticated());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('dctd:auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('dctd:auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [checkAuth]);

  /**
   * Hồ sơ khách, dùng cho cả việc HIỂN THỊ tên lẫn việc xác nhận phiên còn sống.
   *
   * Chỉ gọi khi đã tin là có phiên: gọi vô điều kiện sẽ bắt mọi khách vãng lai trả giá bằng một
   * lời gọi 401 ở mọi trang, vì header có mặt ở khắp nơi. `retry: false` vì 401 không phải lỗi
   * tạm thời — thử lại chỉ nhân đôi số lời gọi.
   */
  const profileQuery = useGetCustomerProfile({
    query: { enabled: isLoaded && isAuthenticated, retry: false, staleTime: 5 * 60_000 },
  });

  /**
   * Cờ phiên nói còn đăng nhập nhưng server nói 401: cookie đã hết hạn hoặc bị thu hồi.
   *
   * Dọn cờ để giao diện trở về trạng thái chưa đăng nhập thay vì kẹt ở "đã đăng nhập nhưng không
   * có dữ liệu nào" — trạng thái đó khiến trang hồ sơ hiện khung rỗng mãi mãi.
   */
  useEffect(() => {
    if (profileQuery.error instanceof ApiError && profileQuery.error.status === 401) {
      clearCustomerAuthTokens();
    }
  }, [profileQuery.error]);

  const logout = useCallback(() => {
    clearCustomerAuthTokens();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoaded,
    /** Hồ sơ khách đang đăng nhập; `undefined` khi chưa đăng nhập hoặc đang tải. */
    customer: profileQuery.data as CustomerProfileDto | undefined,
    isCustomerLoading: profileQuery.isLoading,
    tokens: isAuthenticated ? readCustomerAuthTokens() : undefined,
    logout,
    checkAuth,
  };
}
