'use client';

import { useListCustomerAddresses, getListCustomerAddressesQueryKey } from '@/generated/api/customer/customer';

/**
 * Sổ địa chỉ dùng chung cho profile (sổ địa chỉ) và checkout (chọn địa chỉ giao hàng).
 *
 * Cả hai nơi phải đi qua cùng một generated hook (cùng `getListCustomerAddressesQueryKey`) thay vì
 * tự khai `queryKey` thủ công, nếu không invalidate ở profile (sau create/update/remove) sẽ không
 * làm mới dữ liệu đang hiển thị ở checkout.
 */
export function useCustomerAddressList(
  enabled: boolean,
  options?: { staleTime?: number; gcTime?: number },
) {
  return useListCustomerAddresses({
    query: {
      enabled,
      staleTime: options?.staleTime,
      gcTime: options?.gcTime,
    },
  });
}

export { getListCustomerAddressesQueryKey };
