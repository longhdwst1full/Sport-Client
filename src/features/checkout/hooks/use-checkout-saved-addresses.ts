'use client';

import { useEffect, useRef } from 'react';
import type { CustomerAddressDto, CustomerProfileDto } from '@/generated/api/customer/customer.schemas';
import { EMPTY_SELECTED_ADDRESS, toSelectedAddressData, useCustomerAddressList } from '@/features/address';
import type { CheckoutForm } from './use-checkout-form';

/**
 * Sổ địa chỉ của khách đã đăng nhập: chọn một địa chỉ đã lưu (hoặc bỏ chọn để nhập tay) và điền sẵn
 * địa chỉ mặc định một lần. Mọi lựa chọn đều đổi người nhận/địa chỉ nên phải bỏ báo giá hiện hành.
 *
 * Khách đã đăng nhập còn được điền sẵn họ tên/SĐT/email từ hồ sơ (chỉ vào ô đang trống, một lần);
 * khách vẫn sửa được như ô nhập bình thường.
 */
export function useCheckoutSavedAddresses({
  form,
  isLoaded,
  isAuthenticated,
  customer,
  invalidateQuote,
}: {
  form: CheckoutForm;
  isLoaded: boolean;
  isAuthenticated: boolean;
  /** Hồ sơ khách đang đăng nhập (`useCustomerAuth().customer`). */
  customer: CustomerProfileDto | undefined;
  invalidateQuote: () => void;
}) {
  const { name, phone, email, address, selectedAddressId, setSelectedAddressId, setName, setPhone, setEmail, setAddress, setAddressFormKey } = form;
  const prefilledFromProfile = useRef(false);

  // Sổ địa chỉ chỉ có với khách đã đăng nhập; khách vãng lai nhập tay.
  // Dùng chung generated query key với profile (qua features/address) để sửa/xóa địa chỉ ở
  // profile invalidate đúng cache và checkout thấy dữ liệu mới ngay, thay vì query key tự đặt
  // ['account-addresses'] trước đây không liên quan gì tới cache của profile.
  const savedAddresses = useCustomerAddressList(isLoaded && isAuthenticated, {
    staleTime: 60_000,
  });

  const applySavedAddress = (saved: CustomerAddressDto) => {
    setSelectedAddressId(saved.id);
    setName(saved.recipient);
    setPhone(saved.phone);
    setAddress(toSelectedAddressData(saved));
    setAddressFormKey((key) => key + 1);
    invalidateQuote();
  };

  // Giao tới địa chỉ khác: người nhận mặc định vẫn là chủ tài khoản, khách sửa nếu khác.
  const deliverToOtherAddress = () => {
    setSelectedAddressId('');
    setName(customer?.name ?? '');
    setPhone(customer?.phone ?? '');
    setAddress(EMPTY_SELECTED_ADDRESS);
    setAddressFormKey((key) => key + 1);
    invalidateQuote();
  };

  useEffect(() => {
    if (!customer || prefilledFromProfile.current) return;
    prefilledFromProfile.current = true;
    if (!name.trim() && customer.name) setName(customer.name);
    if (!phone.trim() && customer.phone) setPhone(customer.phone);
    if (!email.trim() && customer.email) setEmail(customer.email);
    // Chỉ điền một lần khi hồ sơ vừa tải; sau đó là dữ liệu khách tự sửa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  useEffect(() => {
    const list = savedAddresses.data;
    // Không xét `name`: hồ sơ có thể đã điền sẵn tên trước khi sổ địa chỉ tải xong.
    if (!list?.length || selectedAddressId !== null || address.provinceCode) return;
    applySavedAddress(list.find(({ isDefault }) => isDefault) ?? list[0]);
    // Chỉ điền sẵn một lần khi sổ địa chỉ vừa tải và form còn trống.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedAddresses.data]);

  return { savedAddresses: savedAddresses.data, applySavedAddress, deliverToOtherAddress };
}
