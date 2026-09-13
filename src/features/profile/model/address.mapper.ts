import type {
  CreateCustomerAddressDto,
  CustomerAddressDto,
  UpdateCustomerAddressDto,
} from '@/generated/api/customer/models';
import type { SelectedAddressData } from '@/shared/components/address/vietnam-address-selector';

/**
 * View model cho sổ địa chỉ. Chỉ chứa field có thật trong `CustomerAddressDto`;
 * nhãn "nhà riêng / văn phòng" không tồn tại trong contract nên không được thêm
 * vào đây (02a-contract-change-workflow RULE-CTR-02).
 */
export interface AddressView {
  id: string;
  recipient: string;
  phone: string;
  addressLine: string;
  ward: string;
  district: string;
  provinceCode: string;
  isDefault: boolean;
  /** Dùng cho `expectedVersion` khi update (optimistic concurrency của BE). */
  version: number;
  fullAddress: string;
}

function joinAddress(parts: Array<string | null | undefined>): string {
  return parts.map((part) => part?.trim()).filter(Boolean).join(', ');
}

export function toAddressView(dto: CustomerAddressDto): AddressView {
  const ward = dto.ward ?? '';
  const district = dto.district ?? '';

  return {
    id: dto.id,
    recipient: dto.recipient,
    phone: dto.phone,
    addressLine: dto.addressLine,
    ward,
    district,
    provinceCode: dto.provinceCode,
    isDefault: dto.isDefault,
    version: dto.version,
    fullAddress: joinAddress([dto.addressLine, ward, district]),
  };
}

export interface AddressFormValues {
  recipient: string;
  phone: string;
  isDefault: boolean;
  location: SelectedAddressData;
}

/**
 * `VietnamAddressSelector` trả mã số theo nguồn địa giới bên thứ ba, còn contract
 * lưu `provinceCode` dạng chuỗi và ward/district dạng tên. Chỉ chuyển kiểu ở đây,
 * không suy diễn thêm field nào ngoài contract.
 */
export function toCreateAddressPayload(values: AddressFormValues): CreateCustomerAddressDto {
  const { location } = values;

  return {
    recipient: values.recipient.trim(),
    phone: values.phone.trim(),
    addressLine: location.streetAddress.trim(),
    ward: location.wardName || undefined,
    district: location.districtName || undefined,
    provinceCode: location.provinceCode == null ? '' : String(location.provinceCode),
    isDefault: values.isDefault,
  };
}

export function toUpdateAddressPayload(
  values: AddressFormValues,
  expectedVersion: number,
): UpdateCustomerAddressDto {
  return { ...toCreateAddressPayload(values), expectedVersion };
}

export const EMPTY_LOCATION: SelectedAddressData = {
  provinceCode: null,
  provinceName: '',
  districtCode: null,
  districtName: '',
  wardCode: null,
  wardName: '',
  streetAddress: '',
  fullAddress: '',
};

export function toSelectorInitialData(address: AddressView): SelectedAddressData {
  const provinceCode = Number(address.provinceCode);

  return {
    ...EMPTY_LOCATION,
    provinceCode: Number.isFinite(provinceCode) && provinceCode > 0 ? provinceCode : null,
    districtName: address.district,
    wardName: address.ward,
    streetAddress: address.addressLine,
    fullAddress: address.fullAddress,
  };
}
