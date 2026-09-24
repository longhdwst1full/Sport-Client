import type {
  CreateAccountReturnDto,
  CreateAccountReturnDtoReasonCode,
  ReturnDetailDto,
  ReturnEligibilityLineDto,
} from '@/generated/api/returns/models';
import { RETURN_PROGRESS_STEPS } from './return.constants';

export interface UploadedEvidence {
  publicId: string;
  providerVersion: number;
  providerSignature: string;
  previewUrl: string;
}

export type ProgressState = 'done' | 'current' | 'upcoming';

export interface ReturnProgressStep {
  key: string;
  label: string;
  state: ProgressState;
}

const STEP_INDEX: Record<string, number> = { REQUESTED: 0, APPROVED: 1, RECEIVED: 2, REFUNDED: 3, CLOSED: 4 };

/**
 * Tiến trình 5 mốc cho khách. Phiếu bị từ chối/huỷ dừng ở mốc hiện tại (không vẽ tiếp các mốc sau).
 * Phiếu đóng mà không có tiền hoàn (ví dụ hàng không nhận được) không đánh dấu mốc "Đã hoàn tiền".
 */
export function toReturnProgress(detail: Pick<ReturnDetailDto, 'status' | 'refundedAmount' | 'history'>): ReturnProgressStep[] {
  if (detail.status === 'REJECTED' || detail.status === 'CANCELLED') {
    const reached = Math.max(
      0,
      ...detail.history.map((entry) => STEP_INDEX[entry.toStatus] ?? -1).filter((index) => index >= 0),
    );
    return RETURN_PROGRESS_STEPS.slice(0, reached + 1).map((step) => ({ ...step, state: 'done' as const }));
  }
  const current = STEP_INDEX[detail.status] ?? 0;
  const refunded = Number(detail.refundedAmount) > 0;
  return RETURN_PROGRESS_STEPS.map((step, index) => {
    if (step.key === 'REFUNDED' && detail.status === 'CLOSED' && !refunded) return { ...step, state: 'upcoming' as const };
    if (index < current || (index === current && detail.status === 'CLOSED')) return { ...step, state: 'done' as const };
    return { ...step, state: index === current ? ('current' as const) : ('upcoming' as const) };
  });
}

/** Khách tự huỷ được khi cửa hàng chưa nhận hàng; API kiểm lại. */
export function canCustomerCancel(status: ReturnDetailDto['status']): boolean {
  return status === 'REQUESTED' || status === 'APPROVED';
}

export interface CreateReturnFormState {
  reasonCode: CreateAccountReturnDtoReasonCode | '';
  description: string;
  /** Số lượng muốn trả theo `orderItemId`; 0 là không trả dòng đó. */
  quantities: Record<string, number>;
}

/**
 * Gom form thành request. Combo luôn gửi đúng `returnableQuantity` (API từ chối trả lẻ); dòng bị chặn
 * hoặc số lượng 0 bị bỏ. Ghi chú và ảnh đều không bắt buộc.
 */
export function toCreateReturnPayload(
  orderNo: string,
  lines: readonly ReturnEligibilityLineDto[],
  form: CreateReturnFormState,
  images: readonly UploadedEvidence[],
): CreateAccountReturnDto {
  const items = lines.flatMap((line) => {
    const requested = form.quantities[line.orderItemId] ?? 0;
    if (line.returnableQuantity <= 0 || requested <= 0) return [];
    const quantity = line.isBundle ? line.returnableQuantity : Math.min(requested, line.returnableQuantity);
    return [{ orderItemId: line.orderItemId, quantity }];
  });
  return {
    orderNo,
    reasonCode: form.reasonCode as CreateAccountReturnDtoReasonCode,
    items,
    ...(form.description.trim() ? { description: form.description.trim() } : {}),
    ...(images.length
      ? { evidenceImages: images.map(({ publicId, providerVersion, providerSignature }) => ({ publicId, providerVersion, providerSignature })) }
      : {}),
  };
}

/** Tiền hoàn ước tính cho lựa chọn hiện tại, chỉ để hiển thị; số chính thức chốt khi kiểm hàng. */
export function estimateSelection(lines: readonly ReturnEligibilityLineDto[], quantities: Record<string, number>): number {
  return lines.reduce((total, line) => {
    const requested = quantities[line.orderItemId] ?? 0;
    if (line.returnableQuantity <= 0 || requested <= 0) return total;
    if (line.isBundle || requested >= line.returnableQuantity) return total + Number(line.maxRefundEstimate);
    return total + Number(line.unitRefundEstimate) * requested;
  }, 0);
}
