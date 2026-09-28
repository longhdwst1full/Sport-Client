'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CustomerAddressDto } from '@/generated/api/customer/customer.schemas';
import { listCustomerAddresses } from '@/generated/api/customer/customer';
import { initialAddress, toSelectedAddress } from '../model/checkout-address';
import type { CheckoutForm } from './use-checkout-form';

/**
 * Sổ địa chỉ của khách đã đăng nhập: chọn một địa chỉ đã lưu (hoặc bỏ chọn để nhập tay) và điền sẵn
 * địa chỉ mặc định một lần. Mọi lựa chọn đều đổi người nhận/địa chỉ nên phải bỏ báo giá hiện hành.
 */
export function useCheckoutSavedAddresses({
  form,
  isLoaded,
  isAuthenticated,
  invalidateQuote,
}: {
  form: CheckoutForm;
  isLoaded: boolean;
  isAuthenticated: boolean;
  invalidateQuote: () => void;
}) {
  const { name, address, selectedAddressId, setSelectedAddressId, setName, setPhone, setAddress, setAddressFormKey } = form;

  // Sổ địa chỉ chỉ có với khách đã đăng nhập; khách vãng lai nhập tay.
  const savedAddresses = useQuery({
    queryKey: ['account-addresses'],
    queryFn: ({ signal }) => listCustomerAddresses(undefined, signal),
    enabled: isLoaded && isAuthenticated,
    staleTime: 60_000,
  });

  const applySavedAddress = (saved: CustomerAddressDto) => {
    setSelectedAddressId(saved.id);
    setName(saved.recipient);
    setPhone(saved.phone);
    setAddress(toSelectedAddress(saved));
    setAddressFormKey((key) => key + 1);
    invalidateQuote();
  };

  const deliverToOtherAddress = () => {
    setSelectedAddressId('');
    setName('');
    setPhone('');
    setAddress(initialAddress);
    setAddressFormKey((key) => key + 1);
    invalidateQuote();
  };

  useEffect(() => {
    const list = savedAddresses.data;
    if (!list?.length || selectedAddressId !== null || name || address.provinceCode) return;
    applySavedAddress(list.find(({ isDefault }) => isDefault) ?? list[0]);
    // Chỉ điền sẵn một lần khi sổ địa chỉ vừa tải và form còn trống.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedAddresses.data]);

  return { savedAddresses: savedAddresses.data, applySavedAddress, deliverToOtherAddress };
}
