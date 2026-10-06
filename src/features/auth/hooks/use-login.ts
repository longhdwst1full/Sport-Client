'use client';

import { useState } from 'react';
import { useLoginCustomer } from '@/generated/api/auth/auth';
import { usePostAuthHandlers } from './use-post-auth-handlers';

/** Owns the login mutation; post-auth side effects (tokens → cart merge → redirect) are shared with register. */
export function useLogin() {
  const [submitError, setSubmitError] = useState('');

  const mutation = usePostAuthHandlers({
    success: { title: 'Đăng nhập thành công', message: 'Chào mừng bạn quay trở lại với Bảo An Sport!' },
    failureTitle: 'Đăng nhập thất bại',
    failureFallback: 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.',
    setSubmitError,
  });
  const login = useLoginCustomer({ mutation });

  return { login, submitError, setSubmitError };
}
