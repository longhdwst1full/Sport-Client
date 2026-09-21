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

function joinAddress(parts: Array<string | null | undefined>): string {
  return parts.map((part) => part?.trim()).filter(Boolean).join(', ');
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
    fullAddress: joinAddress([dto.addressLine, ward, district, province]),
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
    wardCode: location.wardCode == null ? undefined : String(location.wardCode),
    district: location.districtName || undefined,
    districtCode: location.districtCode == null ? undefined : String(location.districtCode),
    province: location.provinceName || undefined,
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

/** Mã lưu dạng chuỗi; selector làm việc bằng số nên quy đổi tại ranh giới này. */
function toCode(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Khôi phục đủ ba cấp cho selector khi sửa địa chỉ cũ.
 *
 * Địa chỉ lưu trước khi contract có `district_code`/`ward_code` sẽ không có mã: hai ô cấp dưới để
 * trống và người dùng chọn lại. Điền tên mà thiếu mã còn tệ hơn — nhìn như đã chọn xong nhưng lưu
 * lại vẫn không tạo được vận đơn.
 */
export function toSelectorInitialData(address: AddressView): SelectedAddressData {
  const districtCode = toCode(address.districtCode);
  const wardCode = toCode(address.wardCode);

  return {
    ...EMPTY_LOCATION,
    provinceCode: toCode(address.provinceCode),
    provinceName: address.province,
    districtCode,
    districtName: districtCode === null ? '' : address.district,
    wardCode,
    wardName: wardCode === null ? '' : address.ward,
    streetAddress: address.addressLine,
    fullAddress: address.fullAddress,
  };
}
