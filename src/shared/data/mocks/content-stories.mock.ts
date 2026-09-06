export interface StoryArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverUrl: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  views: number;
}

export const MOCK_CURATED_STORIES: StoryArticle[] = [
  {
    id: 'story-1',
    slug: 'huong-dan-chon-ta-tay-home-gym',
    title: 'Bí quyết chọn bộ tạ tay đa năng tối ưu cho không gian nhà phố',
    excerpt:
      'So sánh chi tiết tạ tay điều chỉnh thông minh 24kg với 15 cặp tạ đơn truyền thống: Khả năng tiết kiệm 80% diện tích, cơ chế khóa đĩa an toàn và lộ trình tăng tải khoa học.',
    category: 'Tư vấn thiết bị',
    coverUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
    date: '04/09/2026',
    readTime: '6 phút',
    author: 'HLV Minh Tuấn',
    authorRole: 'Chuyên gia thể hình Bảo An Sport',
    views: 1420,
  },
  {
    id: 'story-2',
    slug: '5-sai-lam-khi-chay-bo-tren-may',
    title: '5 sai lầm phổ biến khi tập máy chạy bộ khiến bạn nhanh đau khớp',
    excerpt:
      'Hướng dẫn kỹ thuật tiếp đất bằng nửa bàn chân trước, tận dụng thảm chạy đệm khí Air-Cushioning và cách căn chỉnh nhịp tim đốt mỡ HIIT chuẩn y khoa thể thao.',
    category: 'Hướng dẫn tập luyện',
    coverUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=85',
    date: '02/09/2026',
    readTime: '8 phút',
    author: 'Bs. Hoàng Nam',
    authorRole: 'Bác sĩ Y học Thể thao',
    views: 2150,
  },
  {
    id: 'story-3',
    slug: 'setup-goc-tap-15m2-hoan-hao',
    title: 'Bản vẽ chi tiết setup góc Home Gym 15m² đa năng cho cả gia đình',
    excerpt:
      'Phương án kết hợp giàn tạ Smith, xe đạp kháng lực từ và thảm cao su EPDM giảm chấn chống ồn tầng dưới. Tối ưu chi phí chỉ từ 25 triệu đồng.',
    category: 'Không gian Home Gym',
    coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
    date: '28/08/2026',
    readTime: '5 phút',
    author: 'KTS. Quang Huy',
    authorRole: 'Kỹ sư dự án Gym Bảo An',
    views: 1890,
  },
  {
    id: 'story-4',
    slug: 'bi-quyet-chon-ban-bong-ban-chuan-ittf',
    title: 'Kinh nghiệm chọn bàn bóng bàn gia đình & cơ quan đạt chuẩn ITTF',
    excerpt:
      'Tiêu chuẩn độ dày mặt bàn gỗ MDF 18mm - 25mm, độ nảy đồng đều 23-26cm, chân sắt hộp sơn tĩnh điện và cơ chế gập đôi bánh xe di chuyển tiện lợi.',
    category: 'Tư vấn thiết bị',
    coverUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=900&q=85',
    date: '24/08/2026',
    readTime: '7 phút',
    author: 'HLV Đình Trọng',
    authorRole: 'Cựu VĐV Bóng bàn Quốc Gia',
    views: 1650,
  },
];
