'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetCustomerProfileQueryKey,
  useUpdateCustomerProfile,
} from '@/generated/api/customer/customer';
import { apiErrorMessage as messageOf } from '@/lib/api/error-message';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState<string>();
  const [error, setError] = useState<string>();

  const mutation = useUpdateCustomerProfile({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetCustomerProfileQueryKey() });
        setError(undefined);
        setNotice('Đã lưu thông tin tài khoản.');
      },
      onError: (err) => {
        setNotice(undefined);
        setError(messageOf(err, 'Không lưu được thông tin. Vui lòng thử lại.'));
      },
    },
  });

  return { mutation, notice, error };
}
