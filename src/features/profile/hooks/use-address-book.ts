'use client';

import { useState } from 'react';
import type { SelectedAddressData } from '@/features/address';
import { useToast } from '@/shared/components/global-toast';
import { useCustomerAddresses } from '../api/use-customer-addresses';
import {
  EMPTY_LOCATION,
  toCreateAddressPayload,
  toSelectorInitialData,
  toUpdateAddressPayload,
  type AddressView,
} from '../model/address.mapper';

/**
 * Owns address-book CRUD wiring (create/update/delete/set-default) plus the add/edit modal's
 * local form state, so the profile page and address components only render.
 */
export function useAddressBook(enabled: boolean, profileName: string, profilePhone: string) {
  const {
    addresses,
    isLoading: addressesLoading,
    isError: addressesError,
    refetch: refetchAddresses,
    createAddress,
    updateAddress,
    removeAddress,
    isMutating: addressMutating,
  } = useCustomerAddresses(enabled);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressView | null>(null);
  const [addressFormName, setAddressFormName] = useState('');
  const [addressFormPhone, setAddressFormPhone] = useState('');
  const [addressFormIsDefault, setAddressFormIsDefault] = useState(false);
  const [modalAddressData, setModalAddressData] = useState<SelectedAddressData>(EMPTY_LOCATION);

  const { success } = useToast();
  const showToast = (msg: string) => {
    success('Thông báo', msg);
  };

  const { error: showError } = useToast();

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressFormName(profileName);
    setAddressFormPhone(profilePhone);
    setAddressFormIsDefault(addresses.length === 0);
    setModalAddressData(EMPTY_LOCATION);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: AddressView) => {
    setEditingAddress(addr);
    setAddressFormName(addr.recipient);
    setAddressFormPhone(addr.phone);
    setAddressFormIsDefault(addr.isDefault);
    setModalAddressData(toSelectorInitialData(addr));
    setIsAddressModalOpen(true);
  };

  const reportAddressError = (fallback: string) => (error: unknown) => {
    const message = error instanceof Error ? error.message : fallback;
    showError('Không thực hiện được', message);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAddressData.streetAddress.trim() || modalAddressData.provinceCode == null) {
      showError('Thiếu thông tin', 'Vui lòng chọn Tỉnh/Thành và nhập số nhà, tên đường.');
      return;
    }

    const values = {
      recipient: addressFormName,
      phone: addressFormPhone,
      isDefault: addressFormIsDefault,
      location: modalAddressData,
    };

    try {
      if (editingAddress) {
        // `expectedVersion` là optimistic concurrency của BE: gửi đúng version đã
        // đọc để một bản ghi bị sửa nơi khác sẽ bị từ chối thay vì ghi đè.
        await updateAddress.mutateAsync({
          addressId: editingAddress.id,
          data: toUpdateAddressPayload(values, editingAddress.version),
        });
        showToast('Đã cập nhật địa chỉ thành công!');
      } else {
        await createAddress.mutateAsync({ data: toCreateAddressPayload(values) });
        showToast('Đã thêm địa chỉ mới vào sổ địa chỉ!');
      }
      setIsAddressModalOpen(false);
    } catch (error) {
      // Giữ nguyên modal và dữ liệu đã nhập khi mutation thất bại.
      reportAddressError('Không lưu được địa chỉ, vui lòng thử lại.')(error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      await removeAddress.mutateAsync({ addressId: id });
      showToast('Đã xóa địa chỉ thành công.');
    } catch (error) {
      reportAddressError('Không xóa được địa chỉ, vui lòng thử lại.')(error);
    }
  };

  const handleSetDefaultAddress = async (addr: AddressView) => {
    try {
      await updateAddress.mutateAsync({
        addressId: addr.id,
        data: { isDefault: true, expectedVersion: addr.version },
      });
      showToast('Đã đổi địa chỉ mặc định!');
    } catch (error) {
      reportAddressError('Không đổi được địa chỉ mặc định.')(error);
    }
  };

  return {
    addresses,
    addressesLoading,
    addressesError,
    refetchAddresses,
    addressMutating,
    isAddressModalOpen,
    setIsAddressModalOpen,
    editingAddress,
    addressFormName,
    setAddressFormName,
    addressFormPhone,
    setAddressFormPhone,
    addressFormIsDefault,
    setAddressFormIsDefault,
    modalAddressData,
    setModalAddressData,
    handleOpenAddAddress,
    handleOpenEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
  };
}
