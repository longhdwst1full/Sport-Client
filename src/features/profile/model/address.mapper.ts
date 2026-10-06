import type {
  CreateCustomerAddressDto,
  CustomerAddressDto,
  UpdateCustomerAddressDto,
} from '@/generated/api/customer/customer.schemas';
import { joinAddressParts, toSelectedAddressData, type SelectedAddressData } from '@/features/address';

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
  /** Mã địa giới của hãng vận chuyển; rỗng với địa chỉ lưu trước khi contract có các cột này. */
  wardCode: string;
  district: string;
  districtCode: string;
  province: string;
  provinceCode: string;
  isDefault: boolean;
  /** Dùng cho `expectedVersion` khi update (optimistic concurrency của BE). */
  version: number;
  fullAddress: string;
}

export function toAddressView(dto: CustomerAddressDto): AddressView {
  const ward = dto.ward ?? '';
  const district = dto.district ?? '';

  const province = dto.province ?? '';

  return {
    id: dto.id,
    recipient: dto.recipient,
    phone: dto.phone,
    addressLine: dto.addressLine,
    ward,
    wardCode: dto.wardCode ?? '',
    district,
    districtCode: dto.districtCode ?? '',
    province,
    provinceCode: dto.provinceCode,
    isDefault: dto.isDefault,
    version: dto.version,
    fullAddress: joinAddressParts([dto.addressLine, ward, district, province]),
  };
}

export interface AddressFormValues {
  recipient: string;
  phone: string;
  isDefault: boolean;
  location: SelectedAddressData;
}

/**
 * Gửi **cả tên lẫn mã** địa giới.
 *
 * Hãng vận chuyển định tuyến bằng mã quận/phường. Bản cũ chỉ gửi tên, nên địa chỉ khách lưu trong
 * sổ không tạo được vận đơn và mở lại form thì hai ô quận/phường trống vì không có mã để nạp danh
 * sách. Mã lấy từ danh mục địa giới của backend (`/shipping/areas/*`), tức là mã của chính hãng.
 */
export function toCreateAddressPayload(values: AddressFormValues): CreateCustomerAddressDto {
  const { location } = values;

  return {
    recipient: values.recipient.trim(),
    phone: values.phone.trim(),
    addressLine: location.streetAddress.trim(),
    ward: location.wardName || undefined,
    wardCode: location.wardCode ?? undefined,
    district: location.districtName || undefined,
    districtCode: location.districtCode ?? undefined,
    province: location.provinceName || undefined,
    provinceCode: location.provinceCode ?? '',
    isDefault: values.isDefault,
  };
}

export function toUpdateAddressPayload(
  values: AddressFormValues,
  expectedVersion: number,
): UpdateCustomerAddressDto {
  return { ...toCreateAddressPayload(values), expectedVersion };
}

/**
 * Khôi phục đủ ba cấp cho selector khi sửa địa chỉ cũ (`toSelectedAddressData` của `@/features/address`).
 * Địa chỉ cũ thiếu mã quận/phường thì để trống hai ô cấp dưới để người dùng chọn lại.
 */
export function toSelectorInitialData(address: AddressView): SelectedAddressData {
  return toSelectedAddressData(address, { dropNamesWithoutCode: true });
}
