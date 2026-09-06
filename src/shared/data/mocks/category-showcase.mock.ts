export interface VisualCategoryItem {
  id: string;
  name: string;
  count: string;
  href: string;
  imageUrl: string;
  badge?: string;
  color?: string;
}

export const MOCK_VISUAL_CATEGORIES: VisualCategoryItem[] = [
  {
    id: 'cat-may-chay-bo',
    name: 'Máy Chạy Bộ',
    count: '35+ mẫu máy',
    href: '/catalog?category=may-chay-bo',
    imageUrl: '/images/categories/may-chay-bo.jpg',
    badge: 'Bán chạy',
    color: 'from-amber-500/20 to-orange-500/10',
  },
  {
    id: 'cat-xe-dap-tap',
    name: 'Xe Đạp Tập',
    count: '28+ mẫu xe',
    href: '/catalog?category=xe-dap-tap',
    imageUrl: '/images/categories/xe-dap-tap.jpg',
    badge: 'Ưu đãi 30%',
    color: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    id: 'cat-gym',
    name: 'Dụng Cụ Gym',
    count: '64+ thiết bị',
    href: '/catalog?category=dung-cu-tap-gym',
    imageUrl: '/images/categories/dung-cu-tap-gym.jpg',
    badge: 'Chuyên nghiệp',
    color: 'from-blue-500/20 to-indigo-500/10',
  },
  {
    id: 'cat-bong-ban',
    name: 'Dụng Cụ Bóng Bàn',
    count: '42+ sản phẩm',
    href: '/catalog?category=dung-cu-bong-ban',
    imageUrl: '/images/categories/dung-cu-bong-ban.jpg',
    badge: 'Chuẩn ITTF',
    color: 'from-rose-500/20 to-red-500/10',
  },
  {
    id: 'cat-bong-ro',
    name: 'Dụng Cụ Bóng Rổ',
    count: '25+ sản phẩm',
    href: '/catalog?category=dung-cu-bong-ro',
    imageUrl: '/images/categories/dung-cu-bong-ro.jpg',
    color: 'from-amber-500/20 to-yellow-500/10',
  },
  {
    id: 'cat-vo-thuat',
    name: 'Dụng Cụ Võ Thuật',
    count: '30+ sản phẩm',
    href: '/catalog?category=dung-cu-vo-thuat',
    imageUrl: '/images/categories/dung-cu-vo-thuat.jpg',
    color: 'from-purple-500/20 to-violet-500/10',
  },
  {
    id: 'cat-yoga',
    name: 'Dụng Cụ Yoga',
    count: '18+ sản phẩm',
    href: '/catalog?category=dung-cu-yoga',
    imageUrl: '/images/categories/dung-cu-yoga.jpg',
    color: 'from-emerald-500/20 to-green-500/10',
  },
  {
    id: 'cat-cau-long',
    name: 'Dụng Cụ Cầu Lông',
    count: '22+ sản phẩm',
    href: '/catalog?category=dung-cu-cau-long',
    imageUrl: '/images/categories/dung-cu-cau-long.jpg',
    color: 'from-sky-500/20 to-cyan-500/10',
  },
  {
    id: 'cat-bong-da',
    name: 'Dụng Cụ Bóng Đá',
    count: '19+ sản phẩm',
    href: '/catalog?category=dung-cu-bong-da',
    imageUrl: '/images/categories/dung-cu-bong-da.jpg',
    color: 'from-lime-500/20 to-emerald-500/10',
  },
  {
    id: 'cat-may-bung',
    name: 'Máy Tập Cơ Bụng',
    count: '16+ sản phẩm',
    href: '/catalog?category=may-tap-the-duc',
    imageUrl: '/images/categories/may-tap-bung.jpg',
    color: 'from-cyan-500/20 to-blue-500/10',
  },
  {
    id: 'cat-may-chan',
    name: 'Máy Tập Cơ Chân',
    count: '12+ sản phẩm',
    href: '/catalog?category=may-tap-the-duc',
    imageUrl: '/images/categories/may-tap-co-chan.jpg',
    color: 'from-indigo-500/20 to-violet-500/10',
  },
];
