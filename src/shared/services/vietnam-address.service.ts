import {
  listShippingDistricts,
  listShippingProvinces,
  listShippingWards,
} from '@/generated/api/shipping/shipping';

export interface AddressDivision {
  /**
   * CONTRACT: mã của hãng vận chuyển, giữ nguyên dạng chuỗi. Mã phường GHN có thể chứa chữ
   * (vd. `1B2729` ở Hà Nội); ép sang số sẽ thành NaN và mọi phường đó trùng nhau/không chọn được.
   */
  code: string;
  name: string;
}

export type Province = AddressDivision;

export interface District extends AddressDivision {
  province_code?: string;
}

export interface Ward extends AddressDivision {
  district_code?: string;
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
  provinces: new Map<string, Promise<Province[]>>(),
  districts: new Map<string, Promise<District[]>>(),
  wards: new Map<string, Promise<Ward[]>>(),
};

/**
 * Giữ **promise** thay vì kết quả: hai form địa chỉ cùng mở (checkout + popup sổ địa chỉ) hoặc
 * React StrictMode chạy effect hai lần sẽ dùng chung một lượt gọi đang bay thay vì bắn hai request.
 * Lỗi thì bỏ khỏi cache để lần chọn sau gọi lại được; không nhớ một lỗi mạng suốt phiên.
 */
function memoize<T>(store: Map<string, Promise<T>>, key: string, load: () => Promise<T>): Promise<T> {
  const existing = store.get(key);
  if (existing) return existing;
  const pending = load().catch((error: unknown) => {
    store.delete(key);
    throw error;
  });
  store.set(key, pending);
  return pending;
}

/** @internal Chỉ cho test: xoá cache module giữa các ca. */
export function resetVietnamAddressCache(): void {
  cache.provinces.clear();
  cache.districts.clear();
  cache.wards.clear();
}

const toDivision = (item: { code: string; name: string }): AddressDivision => ({
  code: item.code,
  name: item.name,
});

export function fetchVietnamProvinces(): Promise<Province[]> {
  return memoize(cache.provinces, 'all', async () => {
    const { items } = await listShippingProvinces();
    // Danh sách tỉnh rỗng chỉ có thể là API/hãng vận chuyển trục trặc: không giữ, lần sau gọi lại.
    if (items.length === 0) queueMicrotask(() => cache.provinces.delete('all'));
    return items.map(toDivision);
  });
}

export function fetchVietnamDistricts(provinceCode: string): Promise<District[]> {
  return memoize(cache.districts, provinceCode, async () => {
    const { items } = await listShippingDistricts({ provinceCode });
    return items.map((item) => ({ ...toDivision(item), province_code: provinceCode }));
  });
}

export function fetchVietnamWards(districtCode: string): Promise<Ward[]> {
  return memoize(cache.wards, districtCode, async () => {
    const { items } = await listShippingWards({ districtCode });
    return items.map((item) => ({ ...toDivision(item), district_code: districtCode }));
  });
}
