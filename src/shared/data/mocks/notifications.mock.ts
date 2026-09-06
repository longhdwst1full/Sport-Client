export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'promo' | 'system';
  unread: boolean;
  link: string;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Đơn hàng #BA-89214 đã được đóng gói',
    message: 'Kiện hàng Bàn bóng bàn Song Ngư DF 201C đang được bàn giao cho đối tác vận chuyển hỏa tốc.',
    time: '10 phút trước',
    type: 'order',
    unread: true,
    link: '/profile?tab=orders',
  },
  {
    id: 'n-2',
    title: 'Mã giảm giá độc quyền: BAOAN500',
    message: 'Tặng bạn voucher 500.000đ cho đơn hàng thiết bị tập gym, giàn tạ từ 5 triệu. Hạn dùng 24h.',
    time: '1 giờ trước',
    type: 'promo',
    unread: true,
    link: '/checkout',
  },
  {
    id: 'n-3',
    title: 'Flash Sale thể thao ca 18:00 chuẩn bị mở',
    message: 'Hơn 50 dụng cụ bóng bàn, boxing, tạ tay giảm sốc đến 45%. Hãy đặt lịch săn sale ngay!',
    time: '3 giờ trước',
    type: 'promo',
    unread: true,
    link: '/flash-sale',
  },
  {
    id: 'n-4',
    title: 'Chào mừng bạn đến với Bảo An Sport',
    message: 'Hoàn thiện hồ sơ hội viên để nhận 100 điểm thưởng tích lũy và voucher miễn phí vận chuyển.',
    time: 'Hôm qua',
    type: 'system',
    unread: false,
    link: '/profile',
  },
];
