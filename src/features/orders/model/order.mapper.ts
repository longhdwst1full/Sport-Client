import type { OrderDetailDto } from '@/generated/api/orders/models';
import { vndMoney } from '@/shared/format/money';
import { formatDateTime } from '@/shared/format/date-time';
import { orderStatusLabels, paymentStatusLabels } from './order.constants';

/** Nhãn tách khỏi mã để đổi chữ hiển thị không làm đổi so sánh nghiệp vụ. */
export const paymentMethodLabels: Record<string, string> = {
  COD: 'Khi nhận hàng',
  BANK_TRANSFER: 'Chuyển khoản',
  VNPAY: 'VNPay',
  CASH: 'Tiền mặt tại quầy',
};

export interface OrderLineView {
  id: string;
  sku: string;
  productName: string;
  variantName: string;
  imageUrl: string | null;
  quantity: number;
  unitPriceLabel: string;
  lineTotalLabel: string;
}

export interface OrderTimelineEntryView {
  key: string;
  statusCode: string;
  statusLabel: string;
  occurredLabel: string;
  note: string | null;
}

export interface OrderDetailView {
  id: string;
  orderNo: string;
  /** Mã ổn định để so sánh; nhãn chỉ để hiển thị (`08-enums-constants.md`). */
  statusCode: string;
  statusLabel: string;
  paymentStatusCode: string;
  paymentStatusLabel: string;
  paymentMethodCode: string;
  paymentMethodLabel: string;
  fulfillmentStatusCode: string;
  branchName: string;
  placedLabel: string;
  grandTotalLabel: string;
  subtotalLabel: string;
  shippingTotalLabel: string;
  itemCount: number;
  customerNote: string | null;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  version: number;
  items: OrderLineView[];
  timeline: OrderTimelineEntryView[];
}

function money(value: string | null | undefined): string {
  return vndMoney.format(Number(value ?? 0));
}

/**
 * Nguồn duy nhất đọc tên trường của `OrderDetailDto`. Component nhận view model,
 * không nhận DTO thô — đổi contract thì chỉ sửa ở đây (`09-data-transformation.md`).
 */
export function toOrderDetailView(dto: OrderDetailDto): OrderDetailView {
  const recipient = dto.recipient;
  const addressParts = [
    recipient.addressLine,
    recipient.ward,
    recipient.district,
    recipient.province,
  ].filter((part): part is string => Boolean(part));

  return {
    id: dto.id,
    orderNo: dto.orderNo,
    statusCode: dto.status,
    statusLabel: orderStatusLabels[dto.status] ?? dto.status,
    paymentStatusCode: dto.paymentStatus,
    paymentStatusLabel: paymentStatusLabels[dto.paymentStatus] ?? dto.paymentStatus,
    paymentMethodCode: dto.paymentMethod,
    paymentMethodLabel: paymentMethodLabels[dto.paymentMethod] ?? dto.paymentMethod,
    fulfillmentStatusCode: dto.fulfillmentStatus,
    branchName: dto.branchName,
    placedLabel: formatDateTime(dto.placedAt),
    grandTotalLabel: money(dto.grandTotal),
    subtotalLabel: money(dto.subtotal),
    shippingTotalLabel: money(dto.shippingTotal),
    itemCount: dto.itemCount,
    customerNote: dto.customerNote ?? null,
    recipientName: recipient.name,
    recipientPhone: recipient.phone,
    recipientAddress: addressParts.join(', '),
    version: dto.version,
    items: dto.items.map((item) => ({
      id: item.id,
      sku: item.sku,
      productName: item.productName,
      variantName: item.variantName,
      imageUrl: item.imageUrl ?? null,
      quantity: item.quantity,
      unitPriceLabel: money(item.unitPrice),
      lineTotalLabel: money(item.lineTotal),
    })),
    timeline: dto.statusHistory.map((entry) => ({
      key: `${entry.sequenceNo}-${entry.toStatus}`,
      statusCode: entry.toStatus,
      statusLabel: orderStatusLabels[entry.toStatus] ?? entry.toStatus,
      occurredLabel: formatDateTime(entry.createdAt),
      note: entry.reason ?? null,
    })),
  };
}
