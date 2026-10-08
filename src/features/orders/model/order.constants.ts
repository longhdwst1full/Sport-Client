import { OrderFulfillmentStatus, OrderStatus } from '@/generated/api/orders/orders.schemas';
import { PaymentEvidenceStatus, PaymentMethod, PaymentStatus } from '@/generated/api/payments/payments.schemas';

/** Mã trạng thái thanh toán. Re-export enum generated từ contract (`payments.schemas`). */
export const PAYMENT_STATUS = PaymentStatus;
export type { PaymentStatus };

/** Mã phương thức thanh toán. Re-export enum generated từ contract (`payments.schemas`). */
export const PAYMENT_METHOD = PaymentMethod;
export type { PaymentMethod };

/** Mã trạng thái giao hàng. Re-export enum generated từ contract (`orders.schemas`). */
export const FULFILLMENT_STATUS = OrderFulfillmentStatus;
export type { OrderFulfillmentStatus };

/** Mã trạng thái đơn hàng. Re-export enum generated từ contract (`orders.schemas`). */
export const ORDER_STATUS = OrderStatus;
export type { OrderStatus };

/**
 * Nhãn hiển thị cho khách. Kiểu `Record<Enum, …>` bắt lỗi compile khi contract
 * thêm trạng thái mà quên nhãn (theo đúng pattern `returns/model/return.constants.ts`).
 */
export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PICKING: 'Đang lấy hàng',
  PACKED: 'Đã đóng gói',
  SHIPPED: 'Đang giao hàng',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

/** Màu nhãn trạng thái đơn trên nền sáng: chờ = amber, đang xử lý = sky, xong = success, huỷ = slate. */
export const orderStatusTone: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: 'bg-amber-50 text-amber-800 ring-amber-200',
  CONFIRMED: 'bg-sky-50 text-sky-800 ring-sky-200',
  PICKING: 'bg-sky-50 text-sky-800 ring-sky-200',
  PACKED: 'bg-sky-50 text-sky-800 ring-sky-200',
  SHIPPED: 'bg-slate-50 text-slate-950 ring-slate-200',
  DELIVERED: 'bg-success-50 text-success-800 ring-success-200',
  COMPLETED: 'bg-success-50 text-success-800 ring-success-200',
  CANCELLED: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: 'Chờ thanh toán',
  AWAITING_CONFIRMATION: 'Chờ đối soát',
  NEED_REVIEW: 'Cần kiểm tra lại',
  SUCCESS: 'Đã thanh toán',
  FAILED: 'Thanh toán thất bại',
  CANCELLED: 'Đã hủy thanh toán',
  REFUNDED: 'Đã hoàn tiền',
};

export const fulfillmentStatusLabels: Record<OrderFulfillmentStatus, string> = {
  PENDING: 'Chờ xử lý',
  PICKING: 'Đang lấy hàng',
  PACKED: 'Đã đóng gói',
  SHIPPED: 'Đang giao hàng',
  DELIVERED: 'Đã giao',
  FAILED: 'Giao hàng thất bại',
  RETURNED: 'Đã hoàn về kho',
  CANCELLED: 'Đã hủy',
};

export const paymentEvidenceStatusLabels: Record<PaymentEvidenceStatus, string> = {
  PENDING_REVIEW: 'Chờ duyệt',
  ACCEPTED: 'Đã chấp nhận',
  REJECTED: 'Bị từ chối',
  CANCELLED: 'Đã huỷ',
};

/**
 * Nhà cung cấp thanh toán trong `PaymentInstructionDto.provider` (contract để `string`).
 * Mã lạ rơi về chính mã đó khi hiển thị.
 */
export const paymentProviderLabels: Record<string, string> = {
  INTERNAL_COD: 'Thu hộ khi nhận hàng (COD)',
  VNPAY: 'Cổng thanh toán VNPay',
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
