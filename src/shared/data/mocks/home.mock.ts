import {
  Award,
  Building2,
  Dumbbell,
  Footprints,
  HeartPulse,
  Home,
  Layers,
  LucideIcon,
  MapPin,
  Package,
  Trophy,
  Users,
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
    subtitle: 'Nâng dốc tự động 15%, giảm chấn 8 lớp bảo vệ khớp gối. Tặng kèm đai massage 1.500.000đ.',
    badge: 'GIẢM TỚI 40% · BẢO HÀNH 5 NĂM',
    ctaText: 'Xem Ưu Đãi Máy Chạy',
    ctaLink: '/catalog?category=may-chay-bo',
    imageUrl: '/images/banners/slide-may-chay-bo.jpg',
    theme: 'emerald',
  },
  {
    id: 'slide-2',
    title: 'Xe Đạp Tập Kháng Lực Từ',
    highlight: 'Êm Ái Tuyệt Đối Tại Gia',
    subtitle: 'Bánh đà thép 18kg, đồng hồ đo nhịp tim & calo tiêu chuẩn quốc tế. Giao lắp hỏa tốc 2h.',
    badge: 'HOT SALE MÙA THU 2026',
    ctaText: 'Khám Phá Xe Đạp Tập',
    ctaLink: '/catalog?category=xe-dap-tap',
    imageUrl: '/images/banners/slide-xe-dap-tap.jpg',
    theme: 'amber',
  },
  {
    id: 'slide-3',
    title: 'Trọn Bộ Home Gym Chuyên Nghiệp',
    highlight: 'Giàn Tạ Smith 3 Vị Trí',
    subtitle: 'Tích hợp xô đôi, gánh đùi, đẩy ngực. Giải pháp phòng tập thể hình toàn diện ngay tại nhà.',
    badge: 'MIỄN PHÍ KHẢO SÁT & LẮP ĐẶT',
    ctaText: 'Xem Combo Home Gym',
    ctaLink: '/#products',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
    theme: 'cyan',
  },
  {
    id: 'slide-4',
    title: 'Dụng Cụ Bóng Bàn & Bóng Rổ',
    highlight: 'Tiêu Chuẩn Thi Đấu ITTF',
    subtitle: 'Bàn bóng bàn Song Ngư Double Fish, vợt Stiga chính hãng, trụ bóng rổ học đường & gia đình.',
    badge: 'CHÍNH HÃNG 100% · GIÁ TỐT NHẤT',
    ctaText: 'Mua Ngay Giá Tốt',
    ctaLink: '/catalog?category=dung-cu-bong-ban',
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

export const MOCK_BRAND_PARTNERS = [
  'Nike',
  'Adidas',
  'Stiga',
  'Double Fish',
  'Under Armour',
  'Life Fitness',
  'Technogym',
  'Matrix',
  'Impulse',
  'BH Fitness',
  'Bảo An Sport',
  'Fairtex',
  'Manduka',
  'TRX',
];

export interface HomeStatItem {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
}

export const MOCK_HOME_STATS: HomeStatItem[] = [
  { icon: MapPin, value: 5, suffix: '+', label: 'Showroom & Chi nhánh' },
  { icon: Award, value: 3, suffix: '+', label: 'Năm kinh nghiệm' },
  { icon: Package, value: 500, suffix: '+', label: 'Sản phẩm chính hãng' },
  { icon: Users, value: 10000, suffix: '+', label: 'Khách hàng tin tưởng' },
];

export interface HomeSportCategory {
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
}

export const MOCK_HOME_SPORT_CATEGORIES: HomeSportCategory[] = [
  {
    title: 'Gym & Fitness',
    description: 'Tạ tay, giàn tạ và ghế tập đa năng',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
    icon: Dumbbell,
  },
  {
    title: 'Chạy bộ & Cardio',
    description: 'Máy chạy bộ, xe đạp tập tại nhà',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=85',
    icon: Footprints,
  },
  {
    title: 'Bóng bàn & Đối kháng',
    description: 'Bàn bóng bàn thi đấu, trụ bóng rổ, bao cát',
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=900&q=85',
    icon: Trophy,
  },
  {
    title: 'Yoga & Phục hồi',
    description: 'Thảm định tuyến, súng massage cơ',
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=85',
    icon: HeartPulse,
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
