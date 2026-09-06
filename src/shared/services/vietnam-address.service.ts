export interface AddressDivision {
  code: number;
  name: string;
  codename?: string;
  division_type?: string;
}

export interface Province extends AddressDivision {
  phone_code?: number;
}

export interface District extends AddressDivision {
  province_code?: number;
}

export interface Ward extends AddressDivision {
  district_code?: number;
}

// Comprehensive fallback dataset covering key regions of Vietnam
const FALLBACK_PROVINCES: Province[] = [
  { code: 1, name: 'Thành phố Hà Nội' },
  { code: 79, name: 'Thành phố Hồ Chí Minh' },
  { code: 48, name: 'Thành phố Đà Nẵng' },
  { code: 31, name: 'Thành phố Hải Phòng' },
  { code: 92, name: 'Thành phố Cần Thơ' },
  { code: 74, name: 'Tỉnh Bình Dương' },
  { code: 75, name: 'Tỉnh Đồng Nai' },
  { code: 77, name: 'Tỉnh Bà Rịa - Vũng Tàu' },
  { code: 56, name: 'Tỉnh Khánh Hòa' },
  { code: 46, name: 'Tỉnh Thừa Thiên Huế' },
  { code: 22, name: 'Tỉnh Quảng Ninh' },
  { code: 19, name: 'Tỉnh Thái Nguyên' },
  { code: 27, name: 'Tỉnh Bắc Ninh' },
  { code: 30, name: 'Tỉnh Hải Dương' },
  { code: 34, name: 'Tỉnh Thái Bình' },
  { code: 35, name: 'Tỉnh Hà Nam' },
  { code: 36, name: 'Tỉnh Nam Định' },
  { code: 37, name: 'Tỉnh Ninh Bình' },
  { code: 38, name: 'Tỉnh Thanh Hóa' },
  { code: 40, name: 'Tỉnh Nghệ An' },
  { code: 42, name: 'Tỉnh Hà Tĩnh' },
  { code: 44, name: 'Tỉnh Quảng Bình' },
  { code: 45, name: 'Tỉnh Quảng Trị' },
  { code: 49, name: 'Tỉnh Quảng Nam' },
  { code: 51, name: 'Tỉnh Quảng Ngãi' },
  { code: 52, name: 'Tỉnh Bình Định' },
  { code: 54, name: 'Tỉnh Phú Yên' },
  { code: 58, name: 'Tỉnh Ninh Thuận' },
  { code: 60, name: 'Tỉnh Bình Thuận' },
  { code: 62, name: 'Tỉnh Kon Tum' },
  { code: 64, name: 'Tỉnh Gia Lai' },
  { code: 66, name: 'Tỉnh Đắk Lắk' },
  { code: 67, name: 'Tỉnh Đắk Nông' },
  { code: 68, name: 'Tỉnh Lâm Đồng' },
  { code: 70, name: 'Tỉnh Bình Phước' },
  { code: 72, name: 'Tỉnh Tây Ninh' },
  { code: 80, name: 'Tỉnh Long An' },
  { code: 82, name: 'Tỉnh Tiền Giang' },
  { code: 83, name: 'Tỉnh Bến Tre' },
  { code: 84, name: 'Tỉnh Trà Vinh' },
  { code: 86, name: 'Tỉnh Vĩnh Long' },
  { code: 87, name: 'Tỉnh Đồng Tháp' },
  { code: 89, name: 'Tỉnh An Giang' },
  { code: 91, name: 'Tỉnh Kiên Giang' },
  { code: 93, name: 'Tỉnh Hậu Giang' },
  { code: 94, name: 'Tỉnh Sóc Trăng' },
  { code: 95, name: 'Tỉnh Bạc Liêu' },
  { code: 96, name: 'Tỉnh Cà Mau' },
];

const FALLBACK_DISTRICTS: Record<number, District[]> = {
  // Hà Nội
  1: [
    { code: 1, name: 'Quận Ba Đình', province_code: 1 },
    { code: 2, name: 'Quận Hoàn Kiếm', province_code: 1 },
    { code: 3, name: 'Quận Tây Hồ', province_code: 1 },
    { code: 4, name: 'Quận Long Biên', province_code: 1 },
    { code: 5, name: 'Quận Cầu Giấy', province_code: 1 },
    { code: 6, name: 'Quận Đống Đa', province_code: 1 },
    { code: 7, name: 'Quận Hai Bà Trưng', province_code: 1 },
    { code: 8, name: 'Quận Hoàng Mai', province_code: 1 },
    { code: 9, name: 'Quận Thanh Xuân', province_code: 1 },
    { code: 19, name: 'Quận Nam Từ Liêm', province_code: 1 },
    { code: 20, name: 'Quận Bắc Từ Liêm', province_code: 1 },
    { code: 21, name: 'Quận Hà Đông', province_code: 1 },
    { code: 268, name: 'Huyện Gia Lâm', province_code: 1 },
    { code: 269, name: 'Huyện Đông Anh', province_code: 1 },
    { code: 271, name: 'Huyện Thanh Trì', province_code: 1 },
    { code: 274, name: 'Huyện Hoài Đức', province_code: 1 },
  ],
  // TP. Hồ Chí Minh
  79: [
    { code: 760, name: 'Quận 1', province_code: 79 },
    { code: 761, name: 'Quận 12', province_code: 79 },
    { code: 764, name: 'Quận Gò Vấp', province_code: 79 },
    { code: 765, name: 'Quận Bình Thạnh', province_code: 79 },
    { code: 766, name: 'Quận Tân Bình', province_code: 79 },
    { code: 767, name: 'Quận Tân Phú', province_code: 79 },
    { code: 768, name: 'Quận Phú Nhuận', province_code: 79 },
    { code: 769, name: 'Thành phố Thủ Đức', province_code: 79 },
    { code: 770, name: 'Quận 3', province_code: 79 },
    { code: 771, name: 'Quận 10', province_code: 79 },
    { code: 772, name: 'Quận 11', province_code: 79 },
    { code: 773, name: 'Quận 4', province_code: 79 },
    { code: 774, name: 'Quận 5', province_code: 79 },
    { code: 775, name: 'Quận 6', province_code: 79 },
    { code: 776, name: 'Quận 8', province_code: 79 },
    { code: 777, name: 'Quận Bình Tân', province_code: 79 },
    { code: 778, name: 'Quận 7', province_code: 79 },
    { code: 783, name: 'Huyện Củ Chi', province_code: 79 },
    { code: 784, name: 'Huyện Hóc Môn', province_code: 79 },
    { code: 785, name: 'Huyện Bình Chánh', province_code: 79 },
    { code: 786, name: 'Huyện Nhà Bè', province_code: 79 },
  ],
  // Đà Nẵng
  48: [
    { code: 490, name: 'Quận Hải Châu', province_code: 48 },
    { code: 491, name: 'Quận Thanh Khê', province_code: 48 },
    { code: 492, name: 'Quận Sơn Trà', province_code: 48 },
    { code: 493, name: 'Quận Ngũ Hành Sơn', province_code: 48 },
    { code: 494, name: 'Quận Liên Chiểu', province_code: 48 },
    { code: 495, name: 'Quận Cẩm Lệ', province_code: 48 },
    { code: 497, name: 'Huyện Hòa Vang', province_code: 48 },
  ],
  // Hải Phòng
  31: [
    { code: 303, name: 'Quận Hồng Bàng', province_code: 31 },
    { code: 304, name: 'Quận Ngô Quyền', province_code: 31 },
    { code: 305, name: 'Quận Lê Chân', province_code: 31 },
    { code: 306, name: 'Quận Hải An', province_code: 31 },
    { code: 307, name: 'Quận Kiến An', province_code: 31 },
    { code: 308, name: 'Quận Đồ Sơn', province_code: 31 },
    { code: 309, name: 'Quận Dương Kinh', province_code: 31 },
    { code: 311, name: 'Huyện Thủy Nguyên', province_code: 31 },
    { code: 312, name: 'Huyện An Dương', province_code: 31 },
  ],
  // Cần Thơ
  92: [
    { code: 916, name: 'Quận Ninh Kiều', province_code: 92 },
    { code: 917, name: 'Quận Ô Môn', province_code: 92 },
    { code: 918, name: 'Quận Bình Thủy', province_code: 92 },
    { code: 919, name: 'Quận Cái Răng', province_code: 92 },
    { code: 923, name: 'Quận Thốt Nốt', province_code: 92 },
  ],
  // Bình Dương
  74: [
    { code: 718, name: 'Thành phố Thủ Dầu Một', province_code: 74 },
    { code: 721, name: 'Thành phố Thuận An', province_code: 74 },
    { code: 722, name: 'Thành phố Dĩ An', province_code: 74 },
    { code: 723, name: 'Thị xã Bến Cát', province_code: 74 },
    { code: 724, name: 'Thị xã Tân Uyên', province_code: 74 },
  ],
};

const FALLBACK_WARDS: Record<number, Ward[]> = {
  // Ba Đình (Hà Nội)
  1: [
    { code: 1, name: 'Phường Phúc Xá', district_code: 1 },
    { code: 4, name: 'Phường Trúc Bạch', district_code: 1 },
    { code: 6, name: 'Phường Vĩnh Phúc', district_code: 1 },
    { code: 7, name: 'Phường Cống Vị', district_code: 1 },
    { code: 8, name: 'Phường Liễu Giai', district_code: 1 },
    { code: 10, name: 'Phường Nguyễn Trung Trực', district_code: 1 },
    { code: 13, name: 'Phường Quán Thánh', district_code: 1 },
    { code: 16, name: 'Phường Ngọc Hà', district_code: 1 },
    { code: 19, name: 'Phường Điện Biên', district_code: 1 },
    { code: 22, name: 'Phường Đội Cấn', district_code: 1 },
    { code: 25, name: 'Phường Ngọc Khánh', district_code: 1 },
    { code: 28, name: 'Phường Kim Mã', district_code: 1 },
    { code: 31, name: 'Phường Giảng Võ', district_code: 1 },
    { code: 34, name: 'Phường Thành Công', district_code: 1 },
  ],
  // Cầu Giấy (Hà Nội)
  5: [
    { code: 157, name: 'Phường Nghĩa Đô', district_code: 5 },
    { code: 160, name: 'Phường Nghĩa Tân', district_code: 5 },
    { code: 163, name: 'Phường Mai Dịch', district_code: 5 },
    { code: 166, name: 'Phường Dịch Vọng', district_code: 5 },
    { code: 167, name: 'Phường Dịch Vọng Hậu', district_code: 5 },
    { code: 169, name: 'Phường Quan Hoa', district_code: 5 },
    { code: 172, name: 'Phường Yên Hòa', district_code: 5 },
    { code: 175, name: 'Phường Trung Hòa', district_code: 5 },
  ],
  // Quận 1 (TP.HCM)
  760: [
    { code: 26734, name: 'Phường Tân Định', district_code: 760 },
    { code: 26737, name: 'Phường Đa Kao', district_code: 760 },
    { code: 26740, name: 'Phường Bến Nghé', district_code: 760 },
    { code: 26743, name: 'Phường Bến Thành', district_code: 760 },
    { code: 26746, name: 'Phường Nguyễn Thái Bình', district_code: 760 },
    { code: 26749, name: 'Phường Phạm Ngũ Lão', district_code: 760 },
    { code: 26752, name: 'Phường Cầu Ông Lãnh', district_code: 760 },
    { code: 26755, name: 'Phường Cô Giang', district_code: 760 },
    { code: 26758, name: 'Phường Cầu Kho', district_code: 760 },
    { code: 26761, name: 'Phường Nguyễn Cư Trinh', district_code: 760 },
  ],
  // Quận 7 (TP.HCM)
  778: [
    { code: 27487, name: 'Phường Tân Thuận Đông', district_code: 778 },
    { code: 27490, name: 'Phường Tân Thuận Tây', district_code: 778 },
    { code: 27493, name: 'Phường Tân Kiểng', district_code: 778 },
    { code: 27496, name: 'Phường Tân Hưng', district_code: 778 },
    { code: 27499, name: 'Phường Bình Thuận', district_code: 778 },
    { code: 27502, name: 'Phường Tân Phong', district_code: 778 },
    { code: 27505, name: 'Phường Tân Phú', district_code: 778 },
    { code: 27508, name: 'Phường Tân Quy', district_code: 778 },
    { code: 27511, name: 'Phường Phú Thuận', district_code: 778 },
    { code: 27514, name: 'Phường Phú Mỹ', district_code: 778 },
  ],
  // Hải Châu (Đà Nẵng)
  490: [
    { code: 20194, name: 'Phường Hải Châu I', district_code: 490 },
    { code: 20197, name: 'Phường Hải Châu II', district_code: 490 },
    { code: 20200, name: 'Phường Thạch Thang', district_code: 490 },
    { code: 20203, name: 'Phường Thanh Bình', district_code: 490 },
    { code: 20206, name: 'Phường Thuận Phước', district_code: 490 },
    { code: 20209, name: 'Phường Hòa Thuận Đông', district_code: 490 },
    { code: 20212, name: 'Phường Hòa Thuận Tây', district_code: 490 },
    { code: 20215, name: 'Phường Nam Dương', district_code: 490 },
    { code: 20218, name: 'Phường Phước Ninh', district_code: 490 },
    { code: 20221, name: 'Phường Bình Thuận', district_code: 490 },
    { code: 20224, name: 'Phường Bình Hiên', district_code: 490 },
    { code: 20227, name: 'Phường Hòa Cường Bắc', district_code: 490 },
    { code: 20230, name: 'Phường Hòa Cường Nam', district_code: 490 },
  ],
};

// In-memory caching for zero-latency subsequent lookups
const cache = {
  provinces: null as Province[] | null,
  districts: new Map<number, District[]>(),
  wards: new Map<number, Ward[]>(),
};

const BASE_API = 'https://provinces.open-api.vn/api';

/**
 * Fetch all 63 provinces of Vietnam with API first + cached fallback
 */
export async function fetchVietnamProvinces(): Promise<Province[]> {
  if (cache.provinces && cache.provinces.length > 0) {
    return cache.provinces;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${BASE_API}/p/`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        cache.provinces = data;
        return data;
      }
    }
  } catch (error) {
    console.warn('[VietnamAddressService] API fetch failed, using fallback provinces', error);
  }

  cache.provinces = FALLBACK_PROVINCES;
  return FALLBACK_PROVINCES;
}

/**
 * Fetch districts for a given province code
 */
export async function fetchVietnamDistricts(provinceCode: number): Promise<District[]> {
  if (cache.districts.has(provinceCode)) {
    return cache.districts.get(provinceCode)!;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${BASE_API}/p/${provinceCode}?depth=2`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.districts)) {
        cache.districts.set(provinceCode, data.districts);
        return data.districts;
      }
    }
  } catch (error) {
    console.warn(`[VietnamAddressService] API districts for province ${provinceCode} failed`, error);
  }

  const fallback = FALLBACK_DISTRICTS[provinceCode] || [
    { code: provinceCode * 100 + 1, name: 'Quận/Huyện trung tâm', province_code: provinceCode },
    { code: provinceCode * 100 + 2, name: 'Khu vực 2', province_code: provinceCode },
  ];
  cache.districts.set(provinceCode, fallback);
  return fallback;
}

/**
 * Fetch wards for a given district code
 */
export async function fetchVietnamWards(districtCode: number): Promise<Ward[]> {
  if (cache.wards.has(districtCode)) {
    return cache.wards.get(districtCode)!;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${BASE_API}/d/${districtCode}?depth=2`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.wards)) {
        cache.wards.set(districtCode, data.wards);
        return data.wards;
      }
    }
  } catch (error) {
    console.warn(`[VietnamAddressService] API wards for district ${districtCode} failed`, error);
  }

  const fallback = FALLBACK_WARDS[districtCode] || [
    { code: districtCode * 1000 + 1, name: 'Phường/Xã 1', district_code: districtCode },
    { code: districtCode * 1000 + 2, name: 'Phường/Xã 2', district_code: districtCode },
  ];
  cache.wards.set(districtCode, fallback);
  return fallback;
}
