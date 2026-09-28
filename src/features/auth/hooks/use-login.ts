'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginCustomer } from '@/generated/api/auth/auth';
import { useToast } from '@/shared/components/global-toast';
import { syncCartAfterAuth, hydrateCart } from '@/features/cart';
import { storefrontStore } from '@/app/store/store';
import { getCustomerAuthError } from '../model/auth-error';
import { saveCustomerAuthTokens } from '@/core/auth/customer-auth-token.store';

/**
 * Owns the login mutation and its post-auth side effects. Order matters: tokens must be saved
 * before the cart merge call so the request carries the new session, and the redirect happens
 * last so the user only leaves once the cart state is settled.
 */
export function useLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitError, setSubmitError] = useState('');

  const login = useLoginCustomer({
    mutation: {
      onSuccess: async (tokens) => {
        saveCustomerAuthTokens(tokens);
        toast({
          type: 'success',
          title: 'Đăng nhập thành công',
          message: 'Chào mừng bạn quay trở lại với Bảo An Sport!',
        });
        const accountItems = await syncCartAfterAuth(storefrontStore.getState().cart.items);
        if (accountItems) storefrontStore.dispatch(hydrateCart(accountItems));
        router.replace('/');
      },
      onError: (error) => {
        const msg = getCustomerAuthError(error, 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
        setSubmitError(msg);
        toast({
          type: 'error',
          title: 'Đăng nhập thất bại',
          message: msg,
        });
      },
    },
  });

  return { login, submitError, setSubmitError };
}
