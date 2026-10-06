'use client';

import { useState } from 'react';
import { useRegisterCustomer } from '@/generated/api/auth/auth';
import { usePostAuthHandlers } from './use-post-auth-handlers';

/** Owns the register mutation; post-auth side effects mirror the login flow via `usePostAuthHandlers`. */
export function useRegister() {
  const [submitError, setSubmitError] = useState('');

  const mutation = usePostAuthHandlers({
    success: { title: 'Đăng ký thành công', message: 'Chào mừng bạn gia nhập cộng đồng Bảo An Sport!' },
    failureTitle: 'Đăng ký thất bại',
    failureFallback: 'Đăng ký tài khoản không thành công. Vui lòng thử lại.',
    setSubmitError,
  });
  const register = useRegisterCustomer({ mutation });

  return { register, submitError, setSubmitError };
}
