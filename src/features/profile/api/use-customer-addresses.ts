'use client';

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  getListCustomerAddressesQueryKey,
  useCreateCustomerAddress,
  useListCustomerAddresses,
  useRemoveCustomerAddress,
  useUpdateCustomerAddress,
} from '@/generated/api/customer/customer';

import { toAddressView, type AddressView } from '../model/address.mapper';

/**
 * Sổ địa chỉ là dữ liệu cá nhân của tài khoản: TanStack Query sở hữu, không
 * persist xuống localStorage và không cache ở service worker
 * (03-pwa-security-caching, 07-state-tools-performance).
 */
export function useCustomerAddresses(enabled: boolean) {
  const queryClient = useQueryClient();
  const listKey = getListCustomerAddressesQueryKey();

  const query = useListCustomerAddresses({
    query: { enabled, staleTime: 0, gcTime: 0 },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: listKey });
  const mutationOptions = { mutation: { onSuccess: invalidate } } as const;

  const createAddress = useCreateCustomerAddress(mutationOptions);
  const updateAddress = useUpdateCustomerAddress(mutationOptions);
  const removeAddress = useRemoveCustomerAddress(mutationOptions);

  const addresses = useMemo<AddressView[]>(
    () => (query.data ?? []).map(toAddressView),
    [query.data],
  );

  return {
    addresses,
    isLoading: query.isPending && enabled,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createAddress,
    updateAddress,
    removeAddress,
    isMutating:
      createAddress.isPending || updateAddress.isPending || removeAddress.isPending,
  };
}
