import type {
  ReturnReasonCode,
  RefundMethod,
  ReturnStatus,
  ReturnIneligibleReason,
  ReturnCondition,
} from '@/generated/api/returns/returns.schemas';

export const RETURN_PAGE_SIZE = 10;
export const MAX_EVIDENCE_IMAGES = 5;

/**
 * Nhãn cho khách: không lộ trạng thái nội bộ; "RECEIVED" với khách là "đã nhận và kiểm hàng".
 * Kiểu `Record<Enum, …>` bắt lỗi compile khi contract thêm trạng thái mà quên nhãn.
 */
export const returnStatusLabels: Record<ReturnStatus, string> = {
  REQUESTED: 'Đã gửi yêu cầu',
  APPROVED: 'Đã duyệt – vui lòng gửi hàng về',
  REJECTED: 'Yêu cầu không được duyệt',
  RECEIVED: 'Cửa hàng đã nhận và kiểm hàng',
  REFUNDED: 'Đã hoàn tiền',
  CLOSED: 'Hoàn tất',
  CANCELLED: 'Đã huỷ',
};

export const returnStatusTone: Record<ReturnStatus, string> = {
  REQUESTED: 'bg-amber-50 text-amber-800',
  APPROVED: 'bg-sky-50 text-sky-800',
  REJECTED: 'bg-rose-50 text-rose-800',
  RECEIVED: 'bg-violet-50 text-violet-800',
  REFUNDED: 'bg-emerald-50 text-emerald-800',
  CLOSED: 'bg-emerald-50 text-emerald-800',
  CANCELLED: 'bg-slate-100 text-slate-600',
};

/** Các mốc tiến trình khách nhìn thấy, theo đúng thứ tự xử lý. */
export const RETURN_PROGRESS_STEPS = [
  { key: 'REQUESTED', label: 'Đã gửi yêu cầu' },
  { key: 'APPROVED', label: 'Đã duyệt' },
  { key: 'RECEIVED', label: 'Đã nhận & kiểm hàng' },
  { key: 'REFUNDED', label: 'Đã hoàn tiền' },
  { key: 'CLOSED', label: 'Hoàn tất' },
] as const;

export const returnReasonLabels: Record<ReturnReasonCode, string> = {
  DEFECTIVE: 'Hàng lỗi',
  WRONG_ITEM: 'Giao sai hàng',
  NOT_AS_DESCRIBED: 'Không đúng mô tả',
  WRONG_SIZE: 'Sai size',
  CHANGED_MIND: 'Đổi ý',
  OTHER: 'Khác',
};

export const returnConditionLabels: Record<NonNullable<ReturnCondition>, string> = {
  SELLABLE: 'Đạt yêu cầu',
  DAMAGED: 'Hàng bị hư hỏng',
  MISSING: 'Cửa hàng không nhận được',
};

export const refundMethodLabels: Record<RefundMethod, string> = {
  CASH: 'Tiền mặt tại cửa hàng',
  BANK_TRANSFER: 'Chuyển khoản',
};

export const returnEligibilityReasonLabels: Record<NonNullable<ReturnIneligibleReason>, string> = {
  ORDER_NOT_RETURNABLE: 'Đơn chưa giao thành công nên chưa thể yêu cầu trả hàng.',
  OPEN_RETURN_EXISTS: 'Đơn đang có một yêu cầu trả hàng chưa xử lý xong.',
  WINDOW_EXPIRED: 'Đơn đã quá thời hạn đổi trả.',
  NOTHING_RETURNABLE: 'Không còn sản phẩm nào có thể trả trong đơn này.',
};

/** Tiêu đề các khối/cột hiển thị, gom một chỗ thay vì viết rải trong JSX. */
export const RETURN_FIELD_LABELS = {
  returnNo: 'Mã yêu cầu',
  orderNo: 'Đơn hàng',
  reason: 'Lý do',
  createdAt: 'Ngày gửi',
  itemCount: 'Số sản phẩm',
  status: 'Trạng thái',
  product: 'Sản phẩm',
  purchased: 'Đã mua',
  returnable: 'Còn trả được',
  requested: 'Số lượng trả',
  quantity: 'Số lượng',
  inspection: 'Kết quả kiểm',
  estimatedRefund: 'Số tiền hoàn dự kiến',
  refunded: 'Đã hoàn',
  deadline: 'Hạn đổi trả',
  description: 'Ghi chú',
  evidence: 'Ảnh minh chứng',
  refunds: 'Hoàn tiền',
  history: 'Lịch sử',
} as const;

export const RETURN_ESTIMATE_NOTE = 'Số tiền dự kiến, có thể thay đổi sau khi cửa hàng kiểm hàng.';
