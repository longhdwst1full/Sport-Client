import type { PaymentDetailDto } from '@/generated/api/payments/models';
import { vndMoney } from '@/shared/format/money';
import { formatDateTime } from '@/shared/format/date-time';
import { paymentStatusLabels } from './order.constants';

export interface PaymentEvidenceView {
  id: string;
  fileUrl: string;
  thumbnailUrl: string;
  statusCode: string;
  submittedLabel: string;
  reviewReason: string | null;
}

export interface PaymentDetailView {
  id: string;
  paymentRef: string;
  /** Mã ổn định cho so sánh nghiệp vụ; nhãn chỉ để hiển thị. */
  statusCode: string;
  statusLabel: string;
  methodCode: string;
  expectedAmountLabel: string;
  /** Null khi phương thức không có hạn thanh toán (COD, tiền mặt tại quầy). */
  expiresLabel: string | null;
  failureReason: string | null;
  providerLabel: string;
  customerMessage: string;
  redirectUrl: string | null;
  version: string;
  evidences: PaymentEvidenceView[];
}

/** Nguồn duy nhất đọc tên trường của `PaymentDetailDto`. */
export function toPaymentDetailView(dto: PaymentDetailDto): PaymentDetailView {
  return {
    id: dto.id,
    paymentRef: dto.paymentRef,
    statusCode: dto.status,
    statusLabel: paymentStatusLabels[dto.status] ?? dto.status,
    methodCode: dto.method,
    expectedAmountLabel: vndMoney.format(Number(dto.expectedAmount)),
    expiresLabel: dto.expiresAt ? formatDateTime(dto.expiresAt) : null,
    failureReason: dto.failureReason ?? null,
    providerLabel: dto.instruction.provider,
    customerMessage: dto.instruction.customerMessage,
    redirectUrl: dto.instruction.redirectUrl ?? null,
    version: dto.version,
    evidences: dto.evidences.map((evidence) => ({
      id: evidence.id,
      fileUrl: evidence.fileUrl,
      thumbnailUrl: evidence.thumbnailUrl,
      statusCode: evidence.status,
      submittedLabel: formatDateTime(evidence.createdAt),
      reviewReason: evidence.reviewReason ?? null,
    })),
  };
}
