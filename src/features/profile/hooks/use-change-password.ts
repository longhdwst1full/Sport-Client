'use client';

import { useState } from 'react';
import { useChangeCustomerPassword } from '@/generated/api/auth/auth';
import { apiErrorMessage as messageOf } from '@/lib/api/error-message';

export function useChangePassword(onSuccess?: () => void) {
  const [notice, setNotice] = useState<string>();
  const [error, setError] = useState<string>();

  const mutation = useChangeCustomerPassword({
    mutation: {
      onSuccess: () => {
        setError(undefined);
        setNotice('Đã đổi mật khẩu. Các thiết bị khác đang đăng nhập đã bị đăng xuất.');
        onSuccess?.();
      },
      onError: (err) => {
        setNotice(undefined);
        setError(messageOf(err, 'Không đổi được mật khẩu. Vui lòng thử lại.'));
      },
    },
  });

  return { mutation, notice, error, setNotice, setError };
}
