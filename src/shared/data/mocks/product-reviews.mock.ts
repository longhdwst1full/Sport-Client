export interface ReviewItem {
  id: string;
  authorName: string;
  isVerifiedPurchase: boolean;
  rating: number;
  date: string;
  variantName?: string;
  content: string;
  pros?: string;
  cons?: string;
  images?: string[];
  helpfulCount: number;
  officialReply?: {
    author: string;
    date: string;
    content: string;
  };
}

export const MOCK_INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    authorName: 'Trần Quang Huy',
    isVerifiedPurchase: true,
    rating: 5,
    date: '2 ngày trước',
    variantName: 'Bản Tiêu Chuẩn',
    content:
      'Thiết bị tập rất đầm và êm ái, khung thép dày dặn chắc chắn. Kháng lực từ chuyển nấc mượt mà không hề có tiếng rít như dòng xích cơ cũ. Giao hàng hỏa tốc trong 2h tại Q7 đúng như cam kết. Rất hài lòng với dịch vụ lắp đặt của Bảo An Sport!',
    pros: 'Chạy êm ái dưới 25dB, màn hình LED sắc nét, sơn tĩnh điện đẹp.',
    cons: 'Khung xe đầm và nặng nên khiêng lên lầu cần 2 người.',
    images: [
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=600&q=80',
    ],
    helpfulCount: 24,
    officialReply: {
      author: 'Chăm Sóc Khách Hàng Bảo An Sport',
      date: '1 ngày trước',
      content:
        'Bảo An Sport chân thành cảm ơn anh Huy đã tin tưởng lựa chọn sản phẩm! Chúc anh cùng gia đình luôn tràn đầy năng lượng và đạt mục tiêu sức khỏe tốt nhất. Đội ngũ CSKH luôn sẵn sàng hỗ trợ anh bảo dưỡng định kỳ miễn phí ạ!',
    },
  },
  {
    id: 'rev-2',
    authorName: 'Lê Minh Tuấn (HLV Gym)',
    isVerifiedPurchase: true,
    rating: 5,
    date: '1 tuần trước',
    variantName: 'Bản Cao Cấp Pro',
    content:
      'Đã mua cho phòng tập cá nhân của mình. Độ hoàn thiện cơ khí rất cao, chịu tải 150kg thoải mái khi tập HIIT cường độ cao. Tích hợp kết nối Kinomap và Zwift đạp xe ảo qua Bluetooth mượt mà.',
    pros: 'Bánh đà thép đúc cân bằng tốt, yên ngồi công thái học êm.',
    helpfulCount: 19,
  },
  {
    id: 'rev-3',
    authorName: 'Nguyễn Thị Mai',
    isVerifiedPurchase: true,
    rating: 5,
    date: '2 tuần trước',
    variantName: 'Bản Tiêu Chuẩn',
    content:
      'Mình mua tặng ba mẹ tập thể dục mỗi sáng. Xe đạp rất êm không gây ồn ào ảnh hưởng phòng khách. Bàn đạp có quai cài chân chống trượt an toàn cho người lớn tuổi. Kỹ thuật viên giao hàng mang tận phòng và hướng dẫn sử dụng rất chu đáo.',
    pros: 'Êm ái bảo vệ khớp gối, chiều cao yên tùy chỉnh linh hoạt.',
    images: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80',
    ],
    helpfulCount: 15,
  },
  {
    id: 'rev-4',
    authorName: 'Hoàng Quốc Việt',
    isVerifiedPurchase: true,
    rating: 4,
    date: '3 tuần trước',
    variantName: 'Bản Tiêu Chuẩn',
    content:
      'Sản phẩm đẹp đúng như trên mô phỏng 3D của website. Đóng gói thùng xốp 3 lớp cẩn thận. Trừ 1 sao nhỏ vì bên vận chuyển giao trễ 30 phút so với giờ hẹn, nhưng bạn kỹ thuật viên hỗ trợ nhiệt tình bù lại.',
    pros: 'Thiết kế đẹp hiện đại, giá hợp lý trong phân khúc.',
    cons: 'Giao hàng cần căn đúng giờ hẹn hơn.',
    helpfulCount: 8,
    officialReply: {
      author: 'Chăm Sóc Khách Hàng Bảo An Sport',
      date: '3 tuần trước',
      content:
        'Chào anh Việt, Bảo An Sport chân thành xin lỗi vì sự bất tiện giao hàng trễ 30 phút do kẹt xe giờ cao điểm tại khu vực. Chúng tôi đã ghi nhận và tối ưu lộ trình điều phối tốt hơn. Cảm ơn anh đã đánh giá công tâm!',
    },
  },
];
