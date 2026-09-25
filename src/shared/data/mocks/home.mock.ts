import {
  Building2,
  Dumbbell,
  Footprints,
  HeartPulse,
  Home,
  Layers,
  LucideIcon,
  Trophy,
  Warehouse,
} from 'lucide-react';

export interface HeroSlideItem {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  theme: 'emerald' | 'amber' | 'cyan' | 'rose';
}

export const MOCK_HERO_SLIDES: HeroSlideItem[] = [
  {
    id: 'slide-1',
    title: 'Máy Chạy Bộ Điện Chính Hãng',
    highlight: 'Động Cơ Siêu Bền AC/DC',
    // Không khai % giảm giá hay quà tặng kèm trị giá cụ thể: chưa có chương trình khuyến mãi
    // nào trong API đứng sau các con số đó.
    subtitle: 'Nâng dốc tự động, giảm chấn bảo vệ khớp gối. Tư vấn chọn máy theo diện tích và mục tiêu tập.',
    badge: 'MÁY CHẠY BỘ ĐIỆN',
    ctaText: 'Xem Máy Chạy Bộ',
    ctaLink: '/category/may-chay-bo',
    imageUrl: '/images/banners/slide-may-chay-bo.jpg',
    theme: 'emerald',
  },
  {
    id: 'slide-2',
    title: 'Xe Đạp Tập Kháng Lực Từ',
    highlight: 'Êm Ái Tuyệt Đối Tại Gia',
    subtitle: 'Kháng lực từ vận hành êm, đồng hồ theo dõi nhịp tim & calo cho tập luyện tại nhà.',
    badge: 'MÁY TẬP THỂ DỤC',
    ctaText: 'Khám Phá Máy Tập',
    // Cây danh mục hiện không có nhánh xe đạp tập riêng; dẫn về danh mục cha có thật.
    ctaLink: '/category/may-tap-the-duc',
    imageUrl: '/images/banners/slide-xe-dap-tap.jpg',
    theme: 'amber',
  },
  {
    id: 'slide-3',
    title: 'Trọn Bộ Home Gym Chuyên Nghiệp',
    highlight: 'Giàn Tạ Smith 3 Vị Trí',
    subtitle: 'Tích hợp xô đôi, gánh đùi, đẩy ngực. Giải pháp phòng tập thể hình toàn diện ngay tại nhà.',
    badge: 'MIỄN PHÍ KHẢO SÁT & LẮP ĐẶT',
    ctaText: 'Xem Dụng Cụ Tập Gym',
    ctaLink: '/category/dung-cu-tap-gym',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
    theme: 'cyan',
  },
  {
    id: 'slide-4',
    title: 'Dụng Cụ Bóng Bàn & Bóng Rổ',
    highlight: 'Tiêu Chuẩn Thi Đấu ITTF',
    subtitle: 'Bàn bóng bàn Song Ngư Double Fish, vợt Stiga chính hãng, trụ bóng rổ học đường & gia đình.',
    badge: 'DỤNG CỤ BÓNG BÀN',
    ctaText: 'Xem Dụng Cụ Bóng Bàn',
    ctaLink: '/category/dung-cu-bong-ban',
    imageUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1200&q=80',
    theme: 'rose',
  },
];

export interface HomeVoucherItem {
  code: string;
  discount: string;
  minSpend: string;
  desc: string;
  expiry: string;
}

export const MOCK_HOME_VOUCHERS: HomeVoucherItem[] = [
  {
    code: 'BAOAN200',
    discount: '200.000 đ',
    minSpend: 'Đơn từ 2.000.000 đ',
    desc: 'Giảm trực tiếp vào giỏ hàng',
    expiry: 'HSD: 30/09/2026',
  },
  {
    code: 'BAOAN500',
    discount: '500.000 đ',
    minSpend: 'Đơn từ 5.000.000 đ',
    desc: 'Áp dụng máy tập & giàn tạ',
    expiry: 'HSD: 30/09/2026',
  },
];

export interface HomeSportCategory {
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
  /** Slug danh mục ứng viên; trang chủ chỉ dẫn tới đó khi slug có trong cây danh mục API. */
  categorySlug: string;
}

export const MOCK_HOME_SPORT_CATEGORIES: HomeSportCategory[] = [
  {
    title: 'Gym & Fitness',
    description: 'Tạ tay, giàn tạ và ghế tập đa năng',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
    icon: Dumbbell,
    categorySlug: 'dung-cu-tap-gym',
  },
  {
    title: 'Chạy bộ & Cardio',
    description: 'Máy chạy bộ, xe đạp tập tại nhà',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=85',
    icon: Footprints,
    categorySlug: 'may-tap-the-duc',
  },
  {
    title: 'Bóng bàn & Đối kháng',
    description: 'Bàn bóng bàn thi đấu, trụ bóng rổ, bao cát',
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=900&q=85',
    icon: Trophy,
    categorySlug: 'dung-cu-bong-ban',
  },
  {
    title: 'Yoga & Phục hồi',
    description: 'Thảm định tuyến, súng massage cơ',
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=85',
    icon: HeartPulse,
    categorySlug: 'dung-cu-tap-yoga',
  },
];

export const MOCK_POPULAR_SEARCH_KEYWORDS = [
  'Máy chạy bộ gia đình',
  'Bộ tạ điều chỉnh 24kg',
  'Bàn bóng bàn Double Fish',
  'Trụ bóng rổ S206',
  'Bao cát Boxing Fairtex',
  'Combo giàn tạ Smith',
  'Thảm yoga định tuyến',
  'Xe đạp tập AirBike',
];

export interface GymPackageItem {
  id: string;
  title: string;
  space: string;
  budget: string;
  badge: string;
  featured?: boolean;
  icon: LucideIcon;
  image: string;
  description: string;
  equipment: string[];
}

export const MOCK_GYM_PACKAGES: GymPackageItem[] = [
  {
    id: 'pkg-condo',
    title: 'Gói Căn Hộ & Phòng Ngủ',
    space: '10m² - 15m²',
    budget: 'Từ 25.000.000đ',
    badge: 'Tối ưu diện tích',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    description: 'Bố trí gọn gàng, cách âm sàn chung cư và triệt tiêu rung chấn bằng đệm EPDM đa tầng.',
    equipment: [
      'Bộ tạ tay tháo lắp Quick-Lock 20kg',
      'Ghế tập tạ điều chỉnh 7 góc độ phẳng/dốc',
      'Xà đơn gắn tường chịu lực 250kg',
      'Thảm sàn cao su giảm chấn cách âm 15mm',
    ],
  },
  {
    id: 'pkg-villa',
    title: 'Gói Biệt Thự & Tầng Thượng',
    space: '20m² - 35m²',
    budget: 'Từ 65.000.000đ',
    badge: 'Được chọn nhiều nhất',
    featured: true,
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    description: 'Tổ hợp tập luyện toàn diện thân trên, thân dưới và cardio tốc độ cao chuẩn vận động viên.',
    equipment: [
      'Giàn tạ đa năng 3 vị trí Olympic Pro (kèm kéo xô)',
      'Máy chạy bộ điện gia đình King-Pro 3.5HP',
      'Bộ tạ đòn Olympic + 80kg tạ đĩa bọc cao su',
      'Giá đỡ tạ chữ A + Gương tràn viền LED',
    ],
  },
  {
    id: 'pkg-commercial',
    title: 'Gói Doanh Nghiệp & Khách Sạn',
    space: '50m² - 120m²',
    budget: 'Từ 160.000.000đ',
    badge: 'Chuẩn thương mại',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    description: 'Thiết kế theo nhận diện thương hiệu doanh nghiệp, phục vụ nhiều nhân sự cùng tập luyện đồng thời.',
    equipment: [
      'Cụm máy khối đôi Dual-Cable Column thương mại',
      '2 Máy chạy bộ thương mại AC 5.0HP công suất lớn',
      'Dàn tạ tay Urethane nguyên khối từ 2.5kg - 30kg',
      'Khu chức năng sàn cao su phòng gym chuyên dụng',
    ],
  },
];

export interface TrainingSpaceItem {
  icon: LucideIcon;
  title: string;
  meta: string;
  description: string;
}

export const MOCK_TRAINING_SPACES: TrainingSpaceItem[] = [
  {
    icon: Home,
    title: 'Góc tập nhỏ',
    meta: 'Dưới 8 m²',
    description: 'Ưu tiên thiết bị gấp gọn, tạ điều chỉnh và phụ kiện đa năng.',
  },
  {
    icon: Building2,
    title: 'Home gym gia đình',
    meta: 'Từ 8–20 m²',
    description: 'Kết hợp cardio và sức mạnh cho nhiều thành viên cùng sử dụng.',
  },
  {
    icon: Warehouse,
    title: 'Studio & phòng tập',
    meta: 'Trên 20 m²',
    description: 'Chọn theo công suất, tần suất vận hành và khả năng mở rộng.',
  },
];
