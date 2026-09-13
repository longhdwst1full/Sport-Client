export const orderStatusLabels: Record<string, string> = {
  PENDING_CONFIRMATION: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PICKING: 'Đang lấy hàng',
  PACKED: 'Đã đóng gói',
  SHIPPED: 'Đang giao hàng',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

export const paymentStatusLabels: Record<string, string> = {
  PENDING: 'Chờ thanh toán',
  AWAITING_CONFIRMATION: 'Chờ đối soát',
  SUCCESS: 'Đã thanh toán',
  FAILED: 'Thanh toán thất bại',
  CANCELLED: 'Đã hủy thanh toán',
  REFUNDED: 'Đã hoàn tiền',
};
