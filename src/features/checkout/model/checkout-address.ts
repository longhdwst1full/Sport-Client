import type { SelectedAddressData } from '@/features/address';
import type { CustomerAddressDto } from '@/generated/api/customer/customer.schemas';

/**
 * Không điền sẵn địa chỉ nào.
 *
 * Trước đây mặc định là Quận 7, TP.HCM với mã hành chính nhà nước — vừa sai mã so với danh mục của
 * hãng vận chuyển, vừa khiến khách ở tỉnh khác dễ đặt nhầm nơi giao vì ô đã có sẵn giá trị trông
 * như đã chọn.
 */
export const initialAddress: SelectedAddressData = {
  provinceCode: null,
  provinceName: '',
  districtCode: null,
  districtName: '',
  wardCode: null,
  wardName: '',
  streetAddress: '',
  fullAddress: '',
};

/** Mã của hãng vận chuyển giữ nguyên chuỗi (mã phường GHN có thể chứa chữ); rỗng thì bắt chọn lại. */
const toCode = (value?: string | null) => value?.trim() || null;

export function toSelectedAddress(saved: CustomerAddressDto): SelectedAddressData {
  const parts = [saved.addressLine, saved.ward, saved.district, saved.province].filter(Boolean);
  return {
    provinceCode: toCode(saved.provinceCode),
    provinceName: saved.province ?? '',
    districtCode: toCode(saved.districtCode),
    districtName: saved.district ?? '',
    wardCode: toCode(saved.wardCode),
    wardName: saved.ward ?? '',
    streetAddress: saved.addressLine,
    fullAddress: parts.join(', '),
  };
}
