/**
 * Centralized Enums & Constants for Bảo An Sport (baoansport.vn)
 */

// ==========================================
// 1. ROUTE ENUMS
// ==========================================
export enum AppRoute {
  HOME = '/',
  PRODUCTS = '/products',
  CATEGORY = '/category',
  CART = '/cart',
  CHECKOUT = '/checkout',
  CONTACT = '/contact',
  NEWS = '/news',
  LOGIN = '/login',
  REGISTER = '/register',
  SEARCH = '/search',
  FLASH_SALE = '/flash-sale',
  ABOUT = '/#about',
  BENEFITS = '/#benefits',
}

// ==========================================
// 3. ORDER & PAYMENT ENUMS
// ==========================================
export enum PaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOMO = 'MOMO',
  VNPAY = 'VNPAY',
  INSTALLMENT_CREDIT = 'INSTALLMENT_CREDIT',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum ProductType {
  SIMPLE = 'SIMPLE',
  BUNDLE = 'BUNDLE',
  CONFIGURABLE = 'CONFIGURABLE',
}

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  YOUTUBE = 'youtube',
  ZALO = 'zalo',
  TIKTOK = 'tiktok',
}

// ==========================================
// 4. STORE BRAND CONFIGURATION
// ==========================================
export const STORE_CONFIG = {
  name: 'Bảo An Sport',
  legalName: 'Công ty TNHH Dụng Cụ Thể Thao Bảo An Việt Nam',
  shortName: 'Bảo An Sport',
  domain: 'https://baoansport.vn',
  tagline: 'Dụng Cụ & Thiết Bị Thể Thao Chính Hãng Hàng Đầu',
  slogan: 'Đồng hành cùng sức khỏe & thể lực Việt',
  description:
    'Bảo An Sport chuyên cung cấp dụng cụ thể thao, thiết bị thể dục và thể hình chính hãng. Máy chạy bộ, xe đạp tập, giàn tạ đa năng, bàn bóng bàn, dụng cụ võ thuật giá tốt nhất, giao hàng lắp đặt tận nơi toàn quốc.',
  sinceYear: 2016,
} as const;

// ==========================================
// 5. CONTACT, HOTLINES & SOCIAL
// ==========================================
export const STORE_CONTACT = {
  // Hotline HN
  hotlineHn: '0939 987 456',
  hotlineHnRaw: '0939987456',
  // Hotline HCM
  hotlineHcm: '0969 131 990',
  hotlineHcmRaw: '0969131990',
  // Primary hotline
  primaryHotline: '0939 987 456',
  primaryHotlineRaw: '0939987456',
  // Secondary phone
  secondaryPhone: '0983 916 255',
  secondaryPhoneRaw: '0983916255',
  // Emails
  email: 'info@baoansport.vn',
  salesEmail: 'sales@baoansport.vn',
  supportEmail: 'support@baoansport.vn',
  // Social links
  zaloUrl: 'https://zalo.me/0939987456',
  facebookUrl: 'https://www.facebook.com/baoansportvn/',
  youtubeUrl: 'https://www.youtube.com/@baoansport',
  tiktokUrl: 'https://www.tiktok.com/@baoansport',
  // Working Hours
  openingHours: '08:30 - 21:30 (Tất cả các ngày trong tuần)',
} as const;

// ==========================================
// 6. SHOWROOMS LOCATIONS
// ==========================================
export interface Showroom {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  phoneRaw: string;
  hours: string;
  isHeadquarter?: boolean;
}

export const STORE_SHOWROOMS: Showroom[] = [
  {
    id: 'hn-dinhcong',
    city: 'Hà Nội',
    name: 'Showroom Bảo An Sport Hà Nội (Trụ sở)',
    address: 'Số 234 Định Công, Phường Định Công, Quận Hoàng Mai, Hà Nội',
    phone: STORE_CONTACT.hotlineHn,
    phoneRaw: STORE_CONTACT.hotlineHnRaw,
    hours: STORE_CONTACT.openingHours,
    isHeadquarter: true,
  },
  {
    id: 'hcm-q6',
    city: 'TP. Hồ Chí Minh',
    name: 'Showroom Bảo An Sport TP. Hồ Chí Minh',
    address: 'Số 34 Đường số 2, Cư xá Đài Ra Đa, Phường 11, Quận 6, TP. Hồ Chí Minh',
    phone: STORE_CONTACT.hotlineHcm,
    phoneRaw: STORE_CONTACT.hotlineHcmRaw,
    hours: STORE_CONTACT.openingHours,
    isHeadquarter: false,
  },
];

// ==========================================
// 7. ANNOUNCEMENTS & QUICK LINKS
// ==========================================
export const STORE_ANNOUNCEMENTS = [
  'Giao từ kho gần nhất · Giá hiển thị đã gồm VAT',
  `Miễn phí tư vấn không gian tập · Hotline: ${STORE_CONTACT.primaryHotline}`,
  'Đổi trả trong 7 ngày · Bảo hành chính hãng 2-5 năm',
] as const;

// ==========================================
// 8. POLICIES & GUARANTEES
// ==========================================
// Đã gỡ `STORE_POLICIES` (đền bù 200%, giao lắp 2H, trả góp 0%) và `STORE_CATEGORIES` (danh mục
// viết cứng kèm ảnh stock): không nơi nào dùng và không có nguồn dữ liệu xác nhận. Nội dung
// chính sách lấy từ bài POLICY của CMS; danh mục lấy từ `listCatalogCategories`.
/**
 * Trang chính sách CMS thật (`/chinh-sach/<slug>`, bài `POLICY`). Màn sản phẩm dẫn sang đây
 * thay vì tự khai mức cam kết (số giờ giao, số tháng bảo hành...) cho từng sản phẩm.
 */
export const STORE_POLICY_PAGES = {
  SHIPPING: { title: 'Vận chuyển & lắp đặt', href: '/chinh-sach/van-chuyen-giao-hang' },
  WARRANTY: { title: 'Chính sách bảo hành', href: '/chinh-sach/chinh-sach-bao-hanh' },
  RETURNS: { title: 'Chính sách đổi trả', href: '/chinh-sach/chinh-sach-doi-tra' },
  PAYMENT: { title: 'Phương thức thanh toán', href: '/chinh-sach/phuong-thuc-thanh-toan' },
  TERMS: { title: 'Điều khoản & quy định', href: '/chinh-sach/dieu-khoan-quy-dinh' },
} as const;

// ==========================================
// 9. MEGA MENU CATEGORIES (HEADER NAVIGATION)
// ==========================================

// ==========================================
// 11. FOOTER LINKS
// ==========================================
export const FOOTER_SHOP_LINKS = [
  { label: 'Theo môn thể thao', href: AppRoute.CATEGORY },
  { label: 'Tất cả sản phẩm', href: AppRoute.PRODUCTS },
  { label: 'Kiến thức luyện tập', href: AppRoute.NEWS },
  { label: 'Hệ thống Showroom', href: AppRoute.CONTACT },
] as const;

export const FOOTER_POLICY_LINKS = [
  { label: 'Chính sách vận chuyển', href: AppRoute.BENEFITS },
  { label: 'Chính sách đổi trả', href: AppRoute.BENEFITS },
  { label: 'Chính sách bảo hành', href: AppRoute.BENEFITS },
  { label: 'Câu hỏi thường gặp', href: AppRoute.ABOUT },
  { label: 'Điều khoản sử dụng', href: AppRoute.ABOUT },
] as const;
