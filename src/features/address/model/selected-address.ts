/** Giá trị của `VietnamAddressSelector`: mã + tên ba cấp địa giới, số nhà và địa chỉ đầy đủ đã ghép. */
export interface SelectedAddressData {
  provinceCode: string | null;
  provinceName: string;
  districtCode: string | null;
  districtName: string;
  wardCode: string | null;
  wardName: string;
  streetAddress: string;
  fullAddress: string;
}

/**
 * Không điền sẵn địa chỉ nào (dùng chung cho checkout và form sổ địa chỉ).
 *
 * Trước đây checkout mặc định Quận 7, TP.HCM với mã hành chính nhà nước — vừa sai mã so với danh mục
 * của hãng vận chuyển, vừa khiến khách ở tỉnh khác dễ đặt nhầm nơi giao vì ô trông như đã chọn.
 */
export const EMPTY_SELECTED_ADDRESS: SelectedAddressData = {
  provinceCode: null,
  provinceName: '',
  districtCode: null,
  districtName: '',
  wardCode: null,
  wardName: '',
  streetAddress: '',
  fullAddress: '',
};

/** Mã của hãng vận chuyển giữ nguyên chuỗi (mã phường GHN có thể chứa chữ, vd. `1B2729`); rỗng → `null` để bắt chọn lại. */
export function toDivisionCode(value?: string | null): string | null {
  return value?.trim() || null;
}

/** Ghép các phần địa chỉ khác rỗng (sau trim) bằng `, `. */
export function joinAddressParts(parts: ReadonlyArray<string | null | undefined>): string {
  return parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(', ');
}

/** Hình dạng tối thiểu của một địa chỉ đã lưu (khớp cả DTO sổ địa chỉ lẫn view model của profile). */
export interface SavedAddressParts {
  addressLine: string;
  province?: string | null;
  provinceCode?: string | null;
  district?: string | null;
  districtCode?: string | null;
  ward?: string | null;
  wardCode?: string | null;
}

/**
 * Địa chỉ đã lưu → giá trị khởi tạo cho `VietnamAddressSelector`.
 *
 * `dropNamesWithoutCode`: địa chỉ lưu trước khi contract có `district_code`/`ward_code` không có mã;
 * khi sửa trong sổ địa chỉ thì để trống tên cấp dưới để người dùng chọn lại — điền tên mà thiếu mã
 * nhìn như đã chọn xong nhưng lưu lại vẫn không tạo được vận đơn. Checkout giữ tên (mặc định `false`).
 */
export function toSelectedAddressData(
  saved: SavedAddressParts,
  { dropNamesWithoutCode = false }: { dropNamesWithoutCode?: boolean } = {},
): SelectedAddressData {
  const districtCode = toDivisionCode(saved.districtCode);
  const wardCode = toDivisionCode(saved.wardCode);
  const districtName = saved.district ?? '';
  const wardName = saved.ward ?? '';

  return {
    provinceCode: toDivisionCode(saved.provinceCode),
    provinceName: saved.province ?? '',
    districtCode,
    districtName: dropNamesWithoutCode && districtCode === null ? '' : districtName,
    wardCode,
    wardName: dropNamesWithoutCode && wardCode === null ? '' : wardName,
    streetAddress: saved.addressLine,
    fullAddress: joinAddressParts([saved.addressLine, wardName, districtName, saved.province]),
  };
}
