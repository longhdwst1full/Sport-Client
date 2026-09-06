export interface SearchableProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  badge?: string;
  keywords?: string[];
}

export const SEARCHABLE_PRODUCTS: SearchableProduct[] = [
  // BÓNG BÀN & BÓNG RỔ (Khớp trực tiếp với hình ảnh người dùng gửi - Demo CDN data)
  {
    id: 'sp-bb-1',
    name: 'Vợt bóng bàn Stiga Crystal 4 sao',
    slug: 'vot-bong-ban-stiga-crystal-4-sao',
    category: 'Dụng cụ bóng bàn',
    price: 950000,
    originalPrice: 1200000,
    imageUrl: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=800&q=80',
    badge: 'Chính hãng Stiga',
    keywords: ['bóng', 'bóng bàn', 'vợt', 'stiga', 'crystal', 'vợt bóng bàn'],
  },
  {
    id: 'sp-bb-2',
    name: 'Vợt bóng bàn Stiga Tube 5 sao',
    slug: 'vot-bong-ban-stiga-tube-5-sao',
    category: 'Dụng cụ bóng bàn',
    price: 1350000,
    originalPrice: 1650000,
    imageUrl: 'https://images.unsplash.com/photo-1511067007798-44672d7b52b0?auto=format&fit=crop&w=800&q=80',
    badge: '5 Sao Thi Đấu',
    keywords: ['bóng', 'bóng bàn', 'vợt', 'stiga', 'tube', 'vợt 5 sao'],
  },
  {
    id: 'sp-bb-3',
    name: 'Bàn bóng bàn Double Fish DF 201C',
    slug: 'ban-bong-ban-double-fish-df-201c',
    category: 'Dụng cụ bóng bàn',
    price: 9200000,
    originalPrice: 11500000,
    imageUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80',
    badge: 'Chuẩn ITTF',
    keywords: ['bóng', 'bóng bàn', 'bàn bóng bàn', 'double fish', 'song ngư', '201c'],
  },
  {
    id: 'sp-bb-4',
    name: 'Vợt bóng bàn Stiga Bounce 3 sao',
    slug: 'vot-bong-ban-stiga-bounce-3-sao',
    category: 'Dụng cụ bóng bàn',
    price: 680000,
    originalPrice: 850000,
    imageUrl: 'https://images.unsplash.com/photo-1611255894596-10ed6428402c?auto=format&fit=crop&w=800&q=80',
    badge: 'Tập luyện',
    keywords: ['bóng', 'bóng bàn', 'vợt', 'stiga', 'bounce', 'vợt 3 sao'],
  },
  {
    id: 'sp-bb-5',
    name: 'Trụ bóng rổ S206',
    slug: 'tru-bong-ro-s206',
    category: 'Dụng cụ bóng rổ',
    price: 3450000,
    originalPrice: 4200000,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    badge: 'Điều chỉnh độ cao',
    keywords: ['bóng', 'bóng rổ', 'trụ bóng rổ', 's206'],
  },
  {
    id: 'sp-bb-6',
    name: 'Hộp bóng bàn Song Ngư Double Fish 3 sao (Hộp 6 quả)',
    slug: 'hop-bong-ban-double-fish-3-sao',
    category: 'Dụng cụ bóng bàn',
    price: 120000,
    originalPrice: 150000,
    imageUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=200&q=80',
    badge: '3 Sao Thi Đấu',
    keywords: ['bóng', 'quả bóng bàn', 'song ngư', 'double fish'],
  },

  // XE ĐẠP TẬP THỂ DỤC
  {
    id: 'sp-bike-1',
    name: 'Xe Đạp Tập Thể Dục Kháng Lực Từ Bảo An AirBike Pro',
    slug: 'xe-dap-tap-the-duc-spin-bike',
    category: 'Xe đạp tập',
    price: 6200000,
    originalPrice: 8200000,
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80',
    badge: 'Bán chạy nhất',
    keywords: ['xe đạp', 'xe dap', 'xe đạp tập', 'airbike', 'spin bike', 'cardio'],
  },
  {
    id: 'sp-bike-2',
    name: 'Xe Đạp Tập Thể Thao Spinning Bike Speed-7 Vô Cấp',
    slug: 'xe-dap-tap-the-thao-spinning-speed7',
    category: 'Xe đạp tập',
    price: 7850000,
    originalPrice: 9900000,
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80',
    badge: 'Bánh đà 16kg',
    keywords: ['xe đạp', 'xe dap', 'spinning', 'speed 7'],
  },
  {
    id: 'sp-bike-3',
    name: 'Xe Đạp Trượt Tuyết Toàn Thân Elliptical Cross-Trainer',
    slug: 'may-truot-tuyet-toan-than-elliptical-orbit',
    category: 'Xe đạp tập',
    price: 8900000,
    originalPrice: 11500000,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    badge: 'Êm khớp gối',
    keywords: ['xe đạp', 'trượt tuyết', 'elliptical', 'orbit'],
  },

  // MÁY CHẠY BỘ
  {
    id: 'sp-treadmill-1',
    name: 'Máy Chạy Bộ Điện Đa Năng Bảo An Pro X1 Động Cơ 3.5HP',
    slug: 'may-chay-bo-dctd-pro-x1',
    category: 'Máy chạy bộ',
    price: 14500000,
    originalPrice: 18900000,
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
    badge: 'Nâng dốc 15%',
    keywords: ['máy chạy bộ', 'may chay bo', 'chạy bộ', 'pro x1'],
  },
  {
    id: 'sp-treadmill-2',
    name: 'Máy Chạy Bộ Điện Pro Fitness PF-113DA Đa Năng',
    slug: 'may-chay-bo-pro-fitness-pf-113da',
    category: 'Máy chạy bộ',
    price: 12400000,
    originalPrice: 14500000,
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
    badge: 'Pro Fitness',
    keywords: ['máy chạy bộ', 'may chay bo', 'pro fitness', 'pf 113da'],
  },
  {
    id: 'sp-treadmill-3',
    name: 'Máy Chạy Bộ Điện Phòng Gym Sakura V8 Chuyên Nghiệp',
    slug: 'may-chay-bo-sakura-v8',
    category: 'Máy chạy bộ',
    price: 38000000,
    originalPrice: 42500000,
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
    badge: 'Động cơ AC 5.0HP',
    keywords: ['máy chạy bộ', 'may chay bo', 'sakura', 'v8', 'phòng gym'],
  },

  // GYM & TẠ TAY
  {
    id: 'sp-gym-1',
    name: 'Bộ Tạ Tay Điều Chỉnh Thông Minh 24KG Pro (15 Cặp Trong 1)',
    slug: 'bo-ta-tay-dieu-chinh-24kg',
    category: 'Gym & Sức mạnh',
    price: 3850000,
    originalPrice: 4800000,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=200&q=80',
    badge: 'Thay 15 cặp tạ',
    keywords: ['tạ', 'ta', 'tạ tay', 'tạ đơn', 'bowflex', '24kg'],
  },
  {
    id: 'sp-gym-2',
    name: 'Bộ Tạ Đa Năng 4 in 1 Biến Hình Đòn Dài 30KG',
    slug: 'bo-ta-da-nang-4-in-1',
    category: 'Gym & Sức mạnh',
    price: 1700000,
    originalPrice: 2000000,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=200&q=80',
    badge: '4 in 1',
    keywords: ['tạ', 'ta', 'tạ đa năng', 'tạ ấm', 'đòn tạ'],
  },
  {
    id: 'sp-gym-3',
    name: 'Ghế Tập Tạ Đa Năng Điều Chỉnh 7 Cấp Độ Chịu Tải 400kg',
    slug: 'ghe-tap-ta-dieu-chinh-gap-gon',
    category: 'Gym & Sức mạnh',
    price: 2150000,
    originalPrice: 2800000,
    imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=200&q=80',
    badge: 'Gập gọn 7 góc',
    keywords: ['ghế tập tạ', 'ghe tap ta', 'ghế tạ', 'ghế vớt tạ', 'bench'],
  },
  {
    id: 'sp-gym-4',
    name: 'Giàn Tạ Đa Năng 3 Vị Trí Olympic Pro Kèm Xô Đôi',
    slug: 'gian-ta-da-nang-olympic-pro',
    category: 'Gym & Sức mạnh',
    price: 18900000,
    originalPrice: 24500000,
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=200&q=80',
    badge: 'Kèm xô đôi',
    keywords: ['giàn tạ', 'gian ta', 'giàn tạ đa năng', 'smith', 'xô đôi'],
  },
  {
    id: 'sp-gym-5',
    name: 'Combo Home Gym Trọn Bộ Smith Machine + Ghế + 100kg Đĩa Tạ',
    slug: 'combo-home-gym-smith-machine',
    category: 'Combo Home Gym',
    price: 28900000,
    originalPrice: 36000000,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&q=80',
    badge: 'Tiết kiệm 7.1Tr',
    keywords: ['combo', 'home gym', 'smith machine', 'giàn tạ smith'],
  },

  // VÕ THUẬT & YOGA
  {
    id: 'sp-box-1',
    name: 'Bao Cát Đấm Bốc Da PU 3 Lớp Kèm Xích Treo Chịu Lực',
    slug: 'bao-cat-dam-boc-da-pu',
    category: 'Dụng cụ võ thuật',
    price: 650000,
    originalPrice: 850000,
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=200&q=80',
    badge: 'Da 3 lớp',
    keywords: ['bao cát', 'boxing', 'võ thuật', 'đấm bốc'],
  },
  {
    id: 'sp-box-2',
    name: 'Găng Tay Boxing Thi Đấu Đối Kháng Fairtex Da Thật',
    slug: 'gang-tay-boxing-fairtex',
    category: 'Dụng cụ võ thuật',
    price: 1250000,
    originalPrice: 1550000,
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=200&q=80',
    badge: 'Da thật 100%',
    keywords: ['găng tay', 'gang tay', 'boxing', 'fairtex'],
  },
  {
    id: 'sp-yoga-1',
    name: 'Thảm Yoga Định Tuyến Cao Su Tự Nhiên PU 5mm Chống Trượt',
    slug: 'tham-yoga-dinh-tuyen-cao-su',
    category: 'Yoga & Phục hồi',
    price: 890000,
    originalPrice: 1150000,
    imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=200&q=80',
    badge: 'Cao su tự nhiên',
    keywords: ['thảm yoga', 'tham yoga', 'định tuyến', 'pu 5mm'],
  },
];

/**
 * Normalizes Vietnamese string to remove accents and special characters
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Searches products by keyword with Vietnamese accent tolerance
 */
export function searchProducts(query: string, limit = 8): SearchableProduct[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const normalizedQuery = removeVietnameseAccents(trimmed);
  const words = normalizedQuery.split(/\s+/).filter(Boolean);

  return SEARCHABLE_PRODUCTS.filter((prod) => {
    const rawName = prod.name.toLowerCase();
    const rawCategory = prod.category.toLowerCase();
    const normalizedName = removeVietnameseAccents(prod.name);
    const normalizedCategory = removeVietnameseAccents(prod.category);
    const keywords = (prod.keywords || []).map((k) => removeVietnameseAccents(k));

    // Check direct match
    if (
      rawName.includes(trimmed.toLowerCase()) ||
      normalizedName.includes(normalizedQuery) ||
      normalizedCategory.includes(normalizedQuery)
    ) {
      return true;
    }

    // Check if every word matches in name or keywords
    return words.every(
      (w) =>
        normalizedName.includes(w) ||
        normalizedCategory.includes(w) ||
        keywords.some((k) => k.includes(w)),
    );
  }).slice(0, limit);
}
