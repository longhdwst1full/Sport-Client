export interface CatalogProductSummary {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  categoryGroup: 'cardio' | 'gym' | 'combo' | 'table_tennis' | 'martial_arts';
  primaryCategory: string;
  imageUrl: string;
  minPrice: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  badge?: string;
  specs: string[];
  installmentMonthly: number;
}

export interface RelatedFlashDeal {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  imageUrl: string;
  sold: number;
  total: number;
  gift: string;
  badge: string;
  specs: string;
}

// Curated high-quality catalog products with studio photography and precise specifications
export const MOCK_RELATED_CATALOG_PRODUCTS: CatalogProductSummary[] = [
  {
    id: 'prod-bike-1',
    slug: 'xe-dap-tap-the-duc-spin-bike',
    name: 'Xe Đạp Tập Thể Dục Kháng Lực Từ Bảo An AirBike Pro',
    brand: 'Bảo An Sport',
    categoryGroup: 'cardio',
    primaryCategory: 'Xe đạp tập',
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80',
    minPrice: 6200000,
    originalPrice: 8200000,
    rating: 5.0,
    reviewCount: 96,
    soldCount: 148,
    badge: 'Bán chạy nhất',
    specs: ['Bánh đà 12kg', 'Kháng từ êm ái <25dB', 'Bảo hành 5 năm'],
    installmentMonthly: 516000,
  },
  {
    id: 'prod-bike-2',
    slug: 'xe-dap-tap-the-thao-spinning-speed7',
    name: 'Xe Đạp Tập Thể Thao Spinning Bike Speed-7 Vô Cấp',
    brand: 'Bảo An Sport',
    categoryGroup: 'cardio',
    primaryCategory: 'Xe đạp tập',
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80',
    minPrice: 7850000,
    originalPrice: 9900000,
    rating: 4.9,
    reviewCount: 64,
    soldCount: 89,
    badge: 'Kết nối Kinomap',
    specs: ['Bánh đà thép đúc 16kg', 'Khung chữ V chịu lực 160kg', 'Kháng lực vô cấp'],
    installmentMonthly: 654000,
  },
  {
    id: 'prod-treadmill-1',
    slug: 'may-chay-bo-dctd-pro-x1',
    name: 'Máy Chạy Bộ Điện Đa Năng Bảo An Pro X1 Động Cơ 3.5HP',
    brand: 'Bảo An Sport',
    categoryGroup: 'cardio',
    primaryCategory: 'Máy chạy bộ',
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
    minPrice: 14500000,
    originalPrice: 18900000,
    rating: 5.0,
    reviewCount: 118,
    soldCount: 210,
    badge: 'Nâng dốc tự động',
    specs: ['Motor 3.5HP biến tần', 'Thảm Diamond 7 lớp 140x52cm', 'Gập thủy lực'],
    installmentMonthly: 1208000,
  },
  {
    id: 'prod-elliptical-1',
    slug: 'may-truot-tuyet-toan-than-elliptical-orbit',
    name: 'Xe Đạp Trượt Tuyết Toàn Thân Elliptical Cross-Trainer',
    brand: 'Bảo An Sport',
    categoryGroup: 'cardio',
    primaryCategory: 'Xe đạp tập',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    minPrice: 8900000,
    originalPrice: 11500000,
    rating: 4.9,
    reviewCount: 52,
    soldCount: 75,
    badge: 'Bảo vệ khớp gối',
    specs: ['Kháng lực từ 16 cấp', 'Chuyển động tự nhiên', 'Đo nhịp tim tay cầm'],
    installmentMonthly: 741000,
  },
  {
    id: 'prod-gym-1',
    slug: 'gian-ta-da-nang-olympic-pro',
    name: 'Giàn Tạ Đa Năng 3 Vị Trí Olympic Pro Kèm Xô Đôi',
    brand: 'Bảo An Sport',
    categoryGroup: 'gym',
    primaryCategory: 'Gym & Sức mạnh',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    minPrice: 18900000,
    originalPrice: 24500000,
    rating: 5.0,
    reviewCount: 82,
    soldCount: 94,
    badge: 'Đầy đủ bài tập',
    specs: ['Thép hộp 50x100mm dày 2.5mm', 'Xô đôi + Ép ngực + Đạp đùi', 'Tải trọng 500kg'],
    installmentMonthly: 1575000,
  },
  {
    id: 'prod-gym-2',
    slug: 'bo-ta-tay-dieu-chinh-24kg',
    name: 'Bộ Tạ Tay Điều Chỉnh Thông Minh 24KG Pro (15 Cặp Trong 1)',
    brand: 'Bảo An Sport',
    categoryGroup: 'gym',
    primaryCategory: 'Gym & Sức mạnh',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    minPrice: 3850000,
    originalPrice: 4800000,
    rating: 4.9,
    reviewCount: 142,
    soldCount: 320,
    badge: 'Thay thế 15 cặp tạ',
    specs: ['Chuyển nấc xoay 1 giây', 'Dải tạ 2.5kg - 24kg', 'Đế khay chống va đập'],
    installmentMonthly: 320000,
  },
  {
    id: 'prod-gym-3',
    slug: 'ghe-tap-ta-dieu-chinh-gap-gon',
    name: 'Ghế Tập Tạ Đa Năng Điều Chỉnh 7 Cấp Độ Chịu Tải 400kg',
    brand: 'Bảo An Sport',
    categoryGroup: 'gym',
    primaryCategory: 'Gym & Sức mạnh',
    imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80',
    minPrice: 2150000,
    originalPrice: 2800000,
    rating: 4.8,
    reviewCount: 95,
    soldCount: 230,
    badge: 'Gập gọn thông minh',
    specs: ['Đệm da PU êm chống trượt', '7 nấc góc nghiêng & dốc âm', 'Khung thép tam giác'],
    installmentMonthly: 179000,
  },
  {
    id: 'prod-combo-1',
    slug: 'combo-home-gym-smith-machine',
    name: 'Combo Home Gym Trọn Bộ Smith Machine + Ghế + 100kg Đĩa Tạ',
    brand: 'Bảo An Sport',
    categoryGroup: 'combo',
    primaryCategory: 'Combo Home Gym',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    minPrice: 28900000,
    originalPrice: 36000000,
    rating: 5.0,
    reviewCount: 45,
    soldCount: 68,
    badge: 'Tiết kiệm 7.1 triệu',
    specs: ['Ray trượt tuyến tính siêu êm', 'Tặng thảm cao su EPDM', 'Bảo hành khung 10 năm'],
    installmentMonthly: 2408000,
  },
];

// Curated Flash Deals for promotion under product detail
export const MOCK_RELATED_FLASH_DEALS: RelatedFlashDeal[] = [
  {
    id: 'fs-detail-bike',
    slug: 'xe-dap-tap-the-duc-spin-bike',
    name: 'Xe Đạp Tập Thể Dục Kháng Lực Từ Bảo An AirBike Bánh Đà 12kg',
    price: 6200000,
    originalPrice: 8200000,
    discount: 24,
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80',
    sold: 14,
    total: 18,
    gift: 'Tặng thảm lót chống ồn + Bình nước thể thao',
    badge: 'Giảm sốc 24%',
    specs: 'Bánh đà 12kg · Kháng từ êm ái',
  },
  {
    id: 'fs-detail-treadmill',
    slug: 'may-chay-bo-dctd-pro-x1',
    name: 'Máy Chạy Bộ Điện Đa Năng Bảo An Pro X1 Động Cơ 3.5HP Nâng Dốc',
    price: 14500000,
    originalPrice: 18900000,
    discount: 23,
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
    sold: 17,
    total: 20,
    gift: 'Tặng cân điện tử thông minh + Đai massage',
    badge: 'Giao nhanh 2H',
    specs: 'Động cơ 3.5HP · Nâng dốc 15%',
  },
  {
    id: 'fs-detail-elliptical',
    slug: 'may-truot-tuyet-toan-than-elliptical-orbit',
    name: 'Xe Đạp Trượt Tuyết Toàn Thân Elliptical Cross-Trainer Bảo An Sport',
    price: 8900000,
    originalPrice: 11500000,
    discount: 23,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    sold: 9,
    total: 15,
    gift: 'Tặng găng tay thể thao + Dầu tra bảo dưỡng',
    badge: 'Sắp cháy hàng',
    specs: 'Kháng lực từ 16 nấc · Êm khớp gối',
  },
  {
    id: 'fs-detail-weights',
    slug: 'bo-ta-tay-dieu-chinh-24kg',
    name: 'Bộ Tạ Tay Điều Chỉnh Thông Minh 24KG Pro Kèm Khay Chống Va',
    price: 3850000,
    originalPrice: 4800000,
    discount: 20,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    sold: 26,
    total: 30,
    gift: 'Tặng đôi găng tay nâng tạ Pro Grip',
    badge: 'Giá độc quyền',
    specs: 'Thay thế 15 cặp tạ · Thép carbon',
  },
];
