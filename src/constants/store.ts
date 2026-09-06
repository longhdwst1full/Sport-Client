import { Dumbbell, Goal, HeartPulse, type LucideIcon } from 'lucide-react';

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
// 2. CATEGORY SLUG ENUMS
// ==========================================
export enum CategorySlug {
  MAY_TAP_THE_DUC = 'may-tap-the-duc',
  MAY_CHAY_BO = 'may-chay-bo',
  XE_DAP_TAP = 'xe-dap-tap',
  MAY_TAP_BUNG = 'may-tap-bung',
  MAY_TAP_CHAN = 'may-tap-chan',
  DUNG_CU_TAP_GYM = 'dung-cu-tap-gym',
  GIAN_TA_DA_NANG = 'gian-ta-da-nang',
  GHE_TAP_TA = 'ghe-tap-ta',
  TA_TAY = 'ta-tay',
  XA_DON_XA_KEP = 'xa-don-xa-kep',
  PHU_KIEN_GYM = 'phu-kien-gym',
  DUNG_CU_VO_THUAT = 'dung-cu-vo-thuat',
  BAO_CAT = 'bao-cat',
  GANG_TAY_BOXING = 'gang-tay-boxing',
  DICH_DA_DICH_DAM = 'dich-da-dich-dam',
  DUNG_CU_THE_LUC = 'dung-cu-the-luc',
  DUNG_CU_BONG_BAN = 'dung-cu-bong-ban',
  BAN_BONG_BAN = 'ban-bong-ban',
  VOT_BONG_BAN = 'vot-bong-ban',
  QUA_BONG_BAN = 'qua-bong-ban',
  PHU_KIEN_BONG_BAN = 'phu-kien-bong-ban',
  YOGA_PHUC_HOI = 'yoga-phuc-hoi',
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

export const QUICK_LINKS = [
  'Máy chạy bộ',
  'Xe đạp tập',
  'Gym & sức mạnh',
  'Dụng cụ võ thuật',
  'Bóng bàn',
  'Combo home gym',
] as const;

// ==========================================
// 8. POLICIES & GUARANTEES
// ==========================================
export const STORE_POLICIES = [
  {
    title: 'Hàng chính hãng 100%',
    description: 'Cam kết chất lượng đạt chuẩn, đầy đủ CO-CQ, đền bù 200% nếu phát hiện hàng nhái.',
  },
  {
    title: 'Giao hàng & Lắp đặt 2H',
    description: 'Đội ngũ kỹ thuật viên chuyên nghiệp giao hỏa tốc và lắp ráp hoàn thiện tại nhà.',
  },
  {
    title: 'Đổi mới trong 7 ngày',
    description: 'Đổi mới 1 - 1 miễn phí trong 7 ngày đầu nếu thiết bị có lỗi kỹ thuật phát sinh.',
  },
  {
    title: 'Bảo hành 2 - 5 năm',
    description: 'Bảo hành chính hãng khung sườn đến 5 năm, bảo dưỡng định kỳ và hỗ trợ trọn đời.',
  },
  {
    title: 'Trả góp 0% lãi suất',
    description: 'Thanh toán linh hoạt qua thẻ tín dụng và đối tác tài chính với lãi suất 0%.',
  },
] as const;

// ==========================================
// 9. MEGA MENU CATEGORIES (HEADER NAVIGATION)
// ==========================================
export interface MegaMenuCategory {
  label: string;
  href: string;
  icon: LucideIcon;
  image: string;
  children: { label: string; href: string }[];
}

export const MEGA_MENU_CATEGORIES: MegaMenuCategory[] = [
  {
    label: 'Máy Tập Thể Dục',
    href: `/category/${CategorySlug.MAY_TAP_THE_DUC}`,
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80',
    children: [
      { label: 'Máy chạy bộ', href: `/category/${CategorySlug.MAY_CHAY_BO}` },
      { label: 'Xe đạp tập thể dục', href: `/category/${CategorySlug.XE_DAP_TAP}` },
      { label: 'Máy tập bụng', href: `/category/${CategorySlug.MAY_TAP_BUNG}` },
      { label: 'Máy tập chân', href: `/category/${CategorySlug.MAY_TAP_CHAN}` },
    ],
  },
  {
    label: 'Dụng Cụ Tập Gym',
    href: `/category/${CategorySlug.DUNG_CU_TAP_GYM}`,
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
    children: [
      { label: 'Ghế tập tạ', href: `/category/${CategorySlug.GHE_TAP_TA}` },
      { label: 'Giàn tạ đa năng', href: `/category/${CategorySlug.GIAN_TA_DA_NANG}` },
      { label: 'Tạ tay - Tạ đơn', href: `/category/${CategorySlug.TA_TAY}` },
      { label: 'Xà đơn - Xà kép', href: `/category/${CategorySlug.XA_DON_XA_KEP}` },
      { label: 'Phụ kiện Gym', href: `/category/${CategorySlug.PHU_KIEN_GYM}` },
    ],
  },
  {
    label: 'Dụng Cụ Võ Thuật',
    href: `/category/${CategorySlug.DUNG_CU_VO_THUAT}`,
    icon: Goal,
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=400&q=80',
    children: [
      { label: 'Bao cát đấm bốc', href: `/category/${CategorySlug.BAO_CAT}` },
      { label: 'Găng tay Boxing', href: `/category/${CategorySlug.GANG_TAY_BOXING}` },
      { label: 'Đích đá - Đích đấm', href: `/category/${CategorySlug.DICH_DA_DICH_DAM}` },
      { label: 'Dụng cụ tập thể lực', href: `/category/${CategorySlug.DUNG_CU_THE_LUC}` },
    ],
  },
  {
    label: 'Dụng Cụ Bóng Bàn',
    href: `/category/${CategorySlug.DUNG_CU_BONG_BAN}`,
    icon: HeartPulse,
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=400&q=80',
    children: [
      { label: 'Bàn bóng bàn', href: `/category/${CategorySlug.BAN_BONG_BAN}` },
      { label: 'Vợt bóng bàn', href: `/category/${CategorySlug.VOT_BONG_BAN}` },
      { label: 'Quả bóng bàn', href: `/category/${CategorySlug.QUA_BONG_BAN}` },
      { label: 'Phụ kiện bóng bàn', href: `/category/${CategorySlug.PHU_KIEN_BONG_BAN}` },
    ],
  },
];

// ==========================================
// 10. STORE CATEGORIES LIST (CARDS & DIRECTORY)
// ==========================================
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  href: string;
  badge?: string;
  image: string;
  description: string;
  subcategories: { name: string; slug: string; href: string }[];
}

export const STORE_CATEGORIES: CategoryItem[] = [
  {
    id: 'may-tap-the-duc',
    name: 'Máy Tập Thể Dục',
    slug: CategorySlug.MAY_TAP_THE_DUC,
    href: `/category/${CategorySlug.MAY_TAP_THE_DUC}`,
    badge: 'Phổ biến nhất',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    description: 'Máy chạy bộ, xe đạp tập, máy rung giảm mỡ và thiết bị cardio gia đình cao cấp.',
    subcategories: [
      { name: 'Máy chạy bộ điện', slug: CategorySlug.MAY_CHAY_BO, href: `/category/${CategorySlug.MAY_CHAY_BO}` },
      { name: 'Xe đạp tập thể dục', slug: CategorySlug.XE_DAP_TAP, href: `/category/${CategorySlug.XE_DAP_TAP}` },
      { name: 'Máy tập bụng đa năng', slug: CategorySlug.MAY_TAP_BUNG, href: `/category/${CategorySlug.MAY_TAP_BUNG}` },
      { name: 'Máy tập chân & mông', slug: CategorySlug.MAY_TAP_CHAN, href: `/category/${CategorySlug.MAY_TAP_CHAN}` },
    ],
  },
  {
    id: 'dung-cu-tap-gym',
    name: 'Dụng Cụ Tập Gym',
    slug: CategorySlug.DUNG_CU_TAP_GYM,
    href: `/category/${CategorySlug.DUNG_CU_TAP_GYM}`,
    badge: 'Chuyên nghiệp',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    description: 'Ghế tập tạ, giàn tạ đa năng, tạ tay đơn, tạ đĩa và phụ kiện tập gym đầy đủ.',
    subcategories: [
      { name: 'Ghế tập tạ điều chỉnh', slug: CategorySlug.GHE_TAP_TA, href: `/category/${CategorySlug.GHE_TAP_TA}` },
      { name: 'Giàn tạ đa năng All-in-One', slug: CategorySlug.GIAN_TA_DA_NANG, href: `/category/${CategorySlug.GIAN_TA_DA_NANG}` },
      { name: 'Tạ tay - Tạ đơn cao su', slug: CategorySlug.TA_TAY, href: `/category/${CategorySlug.TA_TAY}` },
      { name: 'Xà đơn - Xà kép', slug: CategorySlug.XA_DON_XA_KEP, href: `/category/${CategorySlug.XA_DON_XA_KEP}` },
      { name: 'Phụ kiện Gym & Găng tay', slug: CategorySlug.PHU_KIEN_GYM, href: `/category/${CategorySlug.PHU_KIEN_GYM}` },
    ],
  },
  {
    id: 'dung-cu-vo-thuat',
    name: 'Dụng Cụ Võ Thuật',
    slug: CategorySlug.DUNG_CU_VO_THUAT,
    href: `/category/${CategorySlug.DUNG_CU_VO_THUAT}`,
    badge: 'Bền bỉ',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=600&q=80',
    description: 'Bao cát đấm bốc, găng tay boxing, đích đá đấm và dụng cụ rèn luyện thể lực.',
    subcategories: [
      { name: 'Bao cát đấm bốc treo & trụ đứng', slug: CategorySlug.BAO_CAT, href: `/category/${CategorySlug.BAO_CAT}` },
      { name: 'Găng tay Boxing & Muay Thái', slug: CategorySlug.GANG_TAY_BOXING, href: `/category/${CategorySlug.GANG_TAY_BOXING}` },
      { name: 'Đích đá - Đích đấm', slug: CategorySlug.DICH_DA_DICH_DAM, href: `/category/${CategorySlug.DICH_DA_DICH_DAM}` },
      { name: 'Dụng cụ tập thể lực võ thuật', slug: CategorySlug.DUNG_CU_THE_LUC, href: `/category/${CategorySlug.DUNG_CU_THE_LUC}` },
    ],
  },
  {
    id: 'dung-cu-bong-ban',
    name: 'Dụng Cụ Bóng Bàn',
    slug: CategorySlug.DUNG_CU_BONG_BAN,
    href: `/category/${CategorySlug.DUNG_CU_BONG_BAN}`,
    badge: 'Chuẩn thi đấu',
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=600&q=80',
    description: 'Bàn bóng bàn tiêu chuẩn thi đấu ITTF, vợt dán sẵn, cốt vợt, mặt vợt và lưới.',
    subcategories: [
      { name: 'Bàn bóng bàn gấp gọn', slug: CategorySlug.BAN_BONG_BAN, href: `/category/${CategorySlug.BAN_BONG_BAN}` },
      { name: 'Vợt bóng bàn cao cấp', slug: CategorySlug.VOT_BONG_BAN, href: `/category/${CategorySlug.VOT_BONG_BAN}` },
      { name: 'Quả bóng bàn thi đấu 3 sao', slug: CategorySlug.QUA_BONG_BAN, href: `/category/${CategorySlug.QUA_BONG_BAN}` },
      { name: 'Phụ kiện & Lưới bóng bàn', slug: CategorySlug.PHU_KIEN_BONG_BAN, href: `/category/${CategorySlug.PHU_KIEN_BONG_BAN}` },
    ],
  },
  {
    id: 'yoga-phuc-hoi',
    name: 'Yoga & Phục Hồi',
    slug: CategorySlug.YOGA_PHUC_HOI,
    href: `/category/${CategorySlug.YOGA_PHUC_HOI}`,
    badge: 'Chăm sóc sức khỏe',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    description: 'Thảm tập yoga định tuyến, bóng tập, con lăn foam roller, súng massage cơ bắp.',
    subcategories: [
      { name: 'Thảm yoga định tuyến PU', slug: 'tham-yoga', href: '/category/tham-yoga' },
      { name: 'Con lăn Foam Roller giãn cơ', slug: 'con-lan-foam-roller', href: '/category/con-lan-foam-roller' },
      { name: 'Súng massage cơ bắp trị liệu', slug: 'sung-massage', href: '/category/sung-massage' },
      { name: 'Dây kháng lực tập mông đùi', slug: 'day-khang-luc', href: '/category/day-khang-luc' },
    ],
  },
];

// ==========================================
// 11. FOOTER LINKS
// ==========================================
export const FOOTER_SHOP_LINKS = [
  { label: 'Theo môn thể thao', href: AppRoute.CATEGORY },
  { label: 'Sản phẩm nổi bật', href: '/#products' },
  { label: 'Combo Home Gym', href: '/#products' },
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
