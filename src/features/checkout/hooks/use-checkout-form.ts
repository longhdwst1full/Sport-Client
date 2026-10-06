'use client';

import { useState } from 'react';
import { EMPTY_SELECTED_ADDRESS, type SelectedAddressData } from '@/features/address';
import type { CheckoutPaymentMethod } from '@/generated/api/checkout/checkout.schemas';

/** Trạng thái form nhận hàng + lựa chọn giao/thanh toán, và payload báo giá dựng từ đúng các giá trị đó. */
export function useCheckoutForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [address, setAddress] = useState<SelectedAddressData>(EMPTY_SELECTED_ADDRESS);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }>();
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('COD');
  /**
   * "Nhờ shop tư vấn & gửi chành": shop tự sắp xếp nhà xe và báo/thu cước riêng ngoài hệ thống.
   *
   * CONTRACT: gửi `shippingArrangement: 'SHOP_ARRANGED'`, KHÔNG phải `requestShippingConsultation`.
   * `SHOP_ARRANGED` trả báo giá `QUOTED` (`shippingTotal` 0, `shippingFeePending` true) nên khách đặt
   * được đơn ngay; `requestShippingConsultation` vẫn còn trong hợp đồng và vẫn nghĩa là "chờ nhân viên
   * chốt cước mới đặt được" — Storefront hiện không có nút nào chọn đường đó.
   */
  const [shopArranged, setShopArranged] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  // Đổi `key` để bộ chọn địa chỉ nạp lại dữ liệu khi khách chọn một địa chỉ đã lưu.
  const [addressFormKey, setAddressFormKey] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const buildInput = () => ({
    recipient: {
      recipient: name.trim(),
      phone: phone.trim(),
      ...(email.trim() ? { email: email.trim() } : {}),
      addressLine: address.streetAddress.trim(),
      ward: address.wardName,
      district: address.districtName,
      province: address.provinceName,
      provinceCode: address.provinceCode ?? '',
      districtCode: address.districtCode ?? undefined,
      wardCode: address.wardCode ?? undefined,
      ...coordinates,
    },
    paymentMethod,
    shippingArrangement: shopArranged ? ('SHOP_ARRANGED' as const) : ('STANDARD' as const),
    ...(note.trim() ? { note: note.trim() } : {}),
  });

  // Đủ người nhận + địa chỉ tới phường/xã thì tự báo giá: khách thấy phí giao (miễn phí shop tự giao
  // trong 10 km khi đã chia sẻ vị trí, hoặc phí GHN) mà không phải bấm "Kiểm tra". Dùng đúng API
  // báo giá hiện có nên số hiển thị là số Backend sẽ chốt.
  const readyToQuote = Boolean(
    name.trim() && phone.trim() && address.streetAddress.trim()
    && address.provinceCode && address.districtCode && address.wardCode,
  );

  return {
    name, setName,
    phone, setPhone,
    email, setEmail,
    note, setNote,
    address, setAddress,
    coordinates, setCoordinates,
    paymentMethod, setPaymentMethod,
    shopArranged, setShopArranged,
    acceptedTerms, setAcceptedTerms,
    addressFormKey, setAddressFormKey,
    selectedAddressId, setSelectedAddressId,
    buildInput,
    readyToQuote,
  };
}

export type CheckoutForm = ReturnType<typeof useCheckoutForm>;
