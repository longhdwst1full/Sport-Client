'use client';

import { useState } from 'react';
import { EMPTY_SELECTED_ADDRESS } from '@/features/address';
import { useToast } from '@/shared/components/global-toast';
import { useCustomerAddresses } from '../api/use-customer-addresses';
import {
  toCreateAddressPayload,
  toSelectorInitialData,
  toUpdateAddressPayload,
  type AddressFormValues,
  type AddressView,
} from '../model/address.mapper';

const EMPTY_ADDRESS_FORM: AddressFormValues = { recipient: '', phone: '', isDefault: false, location: EMPTY_SELECTED_ADDRESS };

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
  const [addressForm, setAddressForm] = useState<AddressFormValues>(EMPTY_ADDRESS_FORM);
  const updateAddressForm = (patch: Partial<AddressFormValues>) =>
    setAddressForm((current) => ({ ...current, ...patch }));

  const { success, error: showError } = useToast();
  const showToast = (msg: string) => success('Thông báo', msg);

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      recipient: profileName,
      phone: profilePhone,
      isDefault: addresses.length === 0,
      location: EMPTY_SELECTED_ADDRESS,
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: AddressView) => {
    setEditingAddress(addr);
    setAddressForm({
      recipient: addr.recipient,
      phone: addr.phone,
      isDefault: addr.isDefault,
      location: toSelectorInitialData(addr),
    });
    setIsAddressModalOpen(true);
  };

  const reportAddressError = (fallback: string) => (error: unknown) => {
    const message = error instanceof Error ? error.message : fallback;
    showError('Không thực hiện được', message);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = addressForm;
    if (!values.location.streetAddress.trim() || values.location.provinceCode == null) {
      showError('Thiếu thông tin', 'Vui lòng chọn Tỉnh/Thành và nhập số nhà, tên đường.');
      return;
    }

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
    addressForm,
    updateAddressForm,
    handleOpenAddAddress,
    handleOpenEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
  };
}
