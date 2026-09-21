import {
  listShippingDistricts,
  listShippingProvinces,
  listShippingWards,
} from '@/generated/api/shipping/shipping';

export interface AddressDivision {
  code: number;
  name: string;
}

export type Province = AddressDivision;

export interface District extends AddressDivision {
  province_code?: number;
}

export interface Ward extends AddressDivision {
  district_code?: number;
}

/**
 * Danh mục địa giới lấy từ Backend, tức là **mã của hãng vận chuyển**.
 *
 * Trước đây màn này gọi thẳng `provinces.open-api.vn` (mã hành chính nhà nước) và còn bịa mã dự
 * phòng kiểu `provinceCode * 100 + 1` khi mạng hỏng. Hai bộ mã đó không khớp nhau, nên địa chỉ lưu
 * xong không tạo được vận đơn và phí giao tính sai — sai lặng lẽ, chỉ lộ ra ở bước đẩy đơn sang hãng.
 *
 * Vì vậy ở đây **không có fallback**: thà báo lỗi để người dùng thử lại còn hơn lưu một địa chỉ có
 * mã không tồn tại bên hãng vận chuyển.
 */
const cache = {
  provinces: null as Province[] | null,
  districts: new Map<number, District[]>(),
  wards: new Map<number, Ward[]>(),
};

/** Mã của hãng là chuỗi số; component đang dùng number nên quy đổi tại ranh giới này. */
const toDivision = (item: { code: string; name: string }): AddressDivision => ({
  code: Number(item.code),
  name: item.name,
});

export async function fetchVietnamProvinces(): Promise<Province[]> {
  if (cache.provinces?.length) return cache.provinces;
  const { items } = await listShippingProvinces();
  const provinces = items.map(toDivision);
  cache.provinces = provinces;
  return provinces;
}

export async function fetchVietnamDistricts(provinceCode: number): Promise<District[]> {
  const cached = cache.districts.get(provinceCode);
  if (cached) return cached;
  const { items } = await listShippingDistricts({ provinceCode: String(provinceCode) });
  const districts = items.map((item) => ({ ...toDivision(item), province_code: provinceCode }));
  cache.districts.set(provinceCode, districts);
  return districts;
}

export async function fetchVietnamWards(districtCode: number): Promise<Ward[]> {
  const cached = cache.wards.get(districtCode);
  if (cached) return cached;
  const { items } = await listShippingWards({ districtCode: String(districtCode) });
  const wards = items.map((item) => ({ ...toDivision(item), district_code: districtCode }));
  cache.wards.set(districtCode, wards);
  return wards;
}
