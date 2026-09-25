import type { CheckoutQuoteDto } from '@/generated/api/checkout/models';
import type { VnpayReturnDto } from '@/generated/api/payments/models';
import { vndMoney } from '@/shared/format/money';
import { formatDateTime } from '@/shared/format/date-time';

/**
 * Nhãn tách khỏi mã phương thức giao (`08-enums-constants.md`): đổi chữ hiển thị
 * không được làm đổi so sánh nghiệp vụ.
 */
export const shippingMethodLabels: Record<string, string> = {
  BRANCH_FREE: 'Shop tự giao miễn phí (dưới 10 km)',
  STANDARD_DELIVERY: 'Phí giao mặc định',
  THIRD_PARTY: 'Đối tác vận chuyển',
  MANUAL_EXTERNAL: 'Shop gửi, phí báo riêng',
};

export interface CheckoutLineView {
  productVariantId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPriceLabel: string;
  lineTotalLabel: string;
}

export interface CheckoutQuoteView {
  checkoutToken: string;
  statusCode: string;
  branchName: string;
  shippingMethodCode: string;
  shippingMethodLabel: string;
  itemSubtotalLabel: string;
  shippingTotalLabel: string;
  /** Null khi Backend ẩn phí (chờ tư vấn); 0 nghĩa là miễn phí thật. */
  shippingTotalAmount: number | null;
  grandTotalLabel: string;
  /** Null khi chờ tư vấn phí: chưa có số thì không dựng ra số 0 gây hiểu nhầm. */
  grandTotalAmount: number | null;
  etaLabel: string;
  requiresShippingConsultation: boolean;
  expiresLabel: string;
  items: CheckoutLineView[];
}

function money(value: string | null | undefined): string {
  return value === null || value === undefined ? 'Chờ báo giá' : vndMoney.format(Number(value));
}

function etaLabel(min: number | null | undefined, max: number | null | undefined): string {
  if (min === null || min === undefined || max === null || max === undefined) {
    return 'Cửa hàng báo lại sau';
  }
  return min === max ? `${min} ngày` : `${min}–${max} ngày`;
}

/** Nguồn duy nhất đọc tên trường của `CheckoutQuoteDto`. */
export function toCheckoutQuoteView(dto: CheckoutQuoteDto): CheckoutQuoteView {
  return {
    checkoutToken: dto.checkoutToken,
    statusCode: dto.status,
    branchName: dto.branchName,
    shippingMethodCode: dto.shippingMethod,
    shippingMethodLabel: shippingMethodLabels[dto.shippingMethod] ?? dto.shippingMethod,
    itemSubtotalLabel: money(dto.itemSubtotal),
    shippingTotalLabel: money(dto.shippingTotal),
    shippingTotalAmount: dto.shippingTotal === null || dto.shippingTotal === undefined
      ? null
      : Number(dto.shippingTotal),
    grandTotalLabel: money(dto.grandTotal),
    grandTotalAmount: dto.grandTotal === null || dto.grandTotal === undefined
      ? null
      : Number(dto.grandTotal),
    etaLabel: etaLabel(dto.etaMinDays, dto.etaMaxDays),
    requiresShippingConsultation: dto.requiresShippingConsultation,
    expiresLabel: formatDateTime(dto.expiresAt),
    items: dto.items.map((item) => ({
      productVariantId: item.productVariantId,
      sku: item.sku,
      name: item.name,
      quantity: item.quantity,
      unitPriceLabel: vndMoney.format(Number(item.unitPrice)),
      lineTotalLabel: vndMoney.format(Number(item.lineTotal)),
    })),
  };
}

export type VnpayDisplayStatus = 'SUCCESS' | 'FAILED' | 'INVALID';

export interface VnpayReturnView {
  displayStatus: VnpayDisplayStatus;
  message: string;
  paymentRef: string | null;
}

/**
 * Kết quả VNPay gửi kèm khi trình duyệt quay về. Chỉ để hiển thị — trạng thái thật
 * của đơn do IPN quyết định, nên view model không mang theo bất kỳ số tiền nào.
 */
export function toVnpayReturnView(dto: VnpayReturnDto): VnpayReturnView {
  return {
    displayStatus: dto.displayStatus,
    message: dto.message,
    paymentRef: dto.paymentRef ?? null,
  };
}
