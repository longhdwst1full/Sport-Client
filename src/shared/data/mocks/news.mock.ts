export interface MockArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverUrl: string;
  date: string;
  readTime: string;
  author: string;
}

export const MOCK_NEWS_CATEGORIES = [
  'Tất cả',
  'Hướng dẫn tập luyện',
  'Tư vấn thiết bị',
  'Dinh dưỡng & Phục hồi',
  'Không gian Home Gym',
];

export const MOCK_FALLBACK_ARTICLES: MockArticle[] = [
  {
    id: '1',
    slug: 'huong-dan-chon-ta-tay-home-gym',
    title: 'Cách chọn bộ tạ tay đa năng tối ưu cho diện tích nhà phố',
    excerpt: 'Phân tích chi tiết ưu nhược điểm giữa tạ điều chỉnh thông minh Quick-Lock và tạ đĩa truyền thống khi tập tại nhà.',
    category: 'Tư vấn thiết bị',
    coverUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
    date: '04/09/2026',
    readTime: '6 phút đọc',
    author: 'HLV Minh Tuấn',
  },
  {
    id: '2',
    slug: '5-sai-lam-khi-chay-bo-tren-may',
    title: '5 sai lầm phổ biến khi tập máy chạy bộ khiến bạn nhanh đau khớp',
    excerpt: 'Tư thế tiếp đất, độ dốc thảm chạy và nhịp tim hi-intensity: Hướng dẫn kỹ thuật chuẩn phòng ngừa chấn thương gối.',
    category: 'Hướng dẫn tập luyện',
    coverUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=85',
    date: '01/09/2026',
    readTime: '8 phút đọc',
    author: 'Bs. Thể thao Hoàng Nam',
  },
  {
    id: '3',
    slug: 'setup-goc-tap-15m2-hoan-hao',
    title: 'Bản vẽ mẫu setup góc tập thể hình 15m² chuẩn Olympic',
    excerpt: 'Tối ưu hóa không gian phòng ngủ hoặc ban công kín: Cách bố trí rack gánh tạ, ghế tập và thảm sàn cao su giảm chấn.',
    category: 'Không gian Home Gym',
    coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
    date: '28/08/2026',
    readTime: '5 phút đọc',
    author: 'KTS. Thể thao Bảo An',
  },
  {
    id: '4',
    slug: 'phuc-hoi-co-bap-sau-buoi-tap-nang',
    title: 'Bí quyết phục hồi cơ bắp cấp tốc sau các buổi tập tạ nặng',
    excerpt: 'Tận dụng con lăn bọt Foam Roller, súng massage cơ và dinh dưỡng Protein: Lịch trình 48h vàng hồi phục thể lực.',
    category: 'Dinh dưỡng & Phục hồi',
    coverUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=85',
    date: '25/08/2026',
    readTime: '7 phút đọc',
    author: 'HLV Thu Trang',
  },
];
