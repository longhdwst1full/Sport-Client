/** Mã trạng thái thanh toán. Khớp `PAYMENT_STATUS` ở backend. */
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  AWAITING_CONFIRMATION: 'AWAITING_CONFIRMATION',
  NEED_REVIEW: 'NEED_REVIEW',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

/** Mã phương thức thanh toán. Khớp ràng buộc `payments_method_check` ở database. */
export const PAYMENT_METHOD = {
  COD: 'COD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  VNPAY: 'VNPAY',
  CASH: 'CASH',
} as const;

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

/** Mã trạng thái giao hàng dùng ở Storefront. */
export const FULFILLMENT_STATUS = {
  PENDING: 'PENDING',
  PICKING: 'PICKING',
  PACKED: 'PACKED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

/** Mã trạng thái đơn hàng dùng ở Storefront. */
export const ORDER_STATUS = {
  PENDING_CONFIRMATION: 'PENDING_CONFIRMATION',
  CONFIRMED: 'CONFIRMED',
  PICKING: 'PICKING',
  PACKED: 'PACKED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

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

/**
 * Trạng thái thanh toán còn cho phép khách gửi bằng chứng chuyển khoản.
 * `NEED_REVIEW` vẫn cho gửi lại vì lần trước bị từ chối do ảnh không đọc được.
 */
export const EVIDENCE_SUBMITTABLE_PAYMENT_STATUSES = [
  PAYMENT_STATUS.PENDING,
  PAYMENT_STATUS.FAILED,
  PAYMENT_STATUS.NEED_REVIEW,
] as const;

/** Trạng thái còn cho phép bấm sang cổng VNPay để trả lại. */
export const VNPAY_RETRYABLE_PAYMENT_STATUSES = [
  PAYMENT_STATUS.PENDING,
  PAYMENT_STATUS.FAILED,
] as const;

/** Trạng thái thanh toán còn cho phép khách tự huỷ đơn. */
export const CANCELLABLE_PAYMENT_STATUSES = [
  PAYMENT_STATUS.PENDING,
  PAYMENT_STATUS.FAILED,
] as const;

/**
 * Đơn đã chốt: gỡ token tra cứu của khách vãng lai vì không còn thao tác nào cần tới.
 */
export const GUEST_ACCESS_RETIRED_ORDER_STATUSES = [
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
] as const;

/** Dùng cho mọi kiểm tra ở trên; nhận mảng `as const` mà không cần ép kiểu. */
export function statusIn(statuses: readonly string[], value: string): boolean {
  return statuses.includes(value);
}
