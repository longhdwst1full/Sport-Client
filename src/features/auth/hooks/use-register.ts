'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterCustomer } from '@/generated/api/auth/auth';
import { useToast } from '@/shared/components/global-toast';
import { getCustomerAuthError } from '../model/auth-error';
import { saveCustomerAuthTokens } from '@/core/auth/customer-auth-token.store';
import { syncCartAfterAuth, hydrateCart } from '@/features/cart';
import { storefrontStore } from '@/app/store/store';

/**
 * Owns the register mutation and its post-auth side effects, mirroring the login flow's
 * save-tokens -> success-toast -> merge-cart -> hydrate -> redirect order.
 */
export function useRegister() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitError, setSubmitError] = useState('');

  const register = useRegisterCustomer({
    mutation: {
      onSuccess: async (tokens) => {
        saveCustomerAuthTokens(tokens);
        toast({
          type: 'success',
          title: 'Đăng ký thành công',
          message: 'Chào mừng bạn gia nhập cộng đồng Bảo An Sport!',
        });
        const accountItems = await syncCartAfterAuth(storefrontStore.getState().cart.items);
        if (accountItems) storefrontStore.dispatch(hydrateCart(accountItems));
        router.replace('/');
      },
      onError: (error) => {
        const msg = getCustomerAuthError(error, 'Đăng ký tài khoản không thành công. Vui lòng thử lại.');
        setSubmitError(msg);
        toast({
          type: 'error',
          title: 'Đăng ký thất bại',
          message: msg,
        });
      },
    },
  });

  return { register, submitError, setSubmitError };
}
