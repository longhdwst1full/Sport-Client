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

export type OrderMilestoneState = 'done' | 'current' | 'todo' | 'failed';

export interface OrderMilestoneView {
  key: 'PLACED' | 'PAID' | 'SHIPMENT_CREATED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  label: string;
  state: OrderMilestoneState;
  /** Thời điểm hiển thị khi mốc đã xong và API có mốc thời gian. */
  occurredLabel: string | null;
}

export interface OrderShipmentView {
  carrierLabel: string;
  trackingNo: string | null;
  trackingUrl: string | null;
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
  /** Lịch sử chi tiết từng lần đổi trạng thái đơn. */
  timeline: OrderTimelineEntryView[];
  /** Các mốc chính cho khách: đặt hàng → thanh toán → tạo vận đơn → đang giao → đã giao. */
  milestones: OrderMilestoneView[];
  shipment: OrderShipmentView | null;
}

const PREPAID_METHODS = new Set(['BANK_TRANSFER', 'VNPAY']);
const CARRIER_LABELS: Record<string, string> = { GHN: 'Giao Hàng Nhanh (GHN)' };
const at = (value?: string | null) => (value ? formatDateTime(value) : null);

/**
 * Dựng mốc tiến trình từ trạng thái đơn, thanh toán và fulfillment. Mốc đầu tiên chưa xong là "current";
 * đơn huỷ thì các mốc chưa xong dừng lại và thêm mốc "Đã huỷ".
 */
export function toOrderMilestones(dto: OrderDetailDto): OrderMilestoneView[] {
  const fulfillment = dto.shipment?.status ?? dto.fulfillmentStatus;
  const shipped = fulfillment === 'SHIPPED' || fulfillment === 'DELIVERED';
  const delivered = fulfillment === 'DELIVERED';
  const prepaid = PREPAID_METHODS.has(dto.paymentMethod);
  const paid = dto.paymentStatus === 'SUCCESS' || dto.paymentStatus === 'REFUNDED';
  const paymentFailed = prepaid && (dto.paymentStatus === 'FAILED' || dto.paymentStatus === 'CANCELLED');
  const hasTracking = Boolean(dto.shipment?.trackingNo);

  const steps: Array<Omit<OrderMilestoneView, 'state'> & { done: boolean; failed?: boolean }> = [
    { key: 'PLACED', label: 'Đặt hàng thành công', done: true, occurredLabel: at(dto.placedAt) },
    {
      key: 'PAID',
      // COD thu khi giao: mốc này xong cùng lúc nhận hàng, không chặn các mốc giao.
      label: prepaid ? (paid ? 'Đã thanh toán' : paymentFailed ? 'Thanh toán chưa thành công' : 'Chờ thanh toán') : paid ? 'Đã thu tiền khi giao' : 'Thanh toán khi nhận hàng',
      done: paid,
      failed: paymentFailed,
      occurredLabel: at(dto.paidAt),
    },
    {
      key: 'SHIPMENT_CREATED',
      label: hasTracking ? 'Đã tạo vận đơn' : 'Đã xuất kho',
      done: shipped || hasTracking,
      occurredLabel: at(dto.shipment?.shippedAt),
    },
    { key: 'IN_TRANSIT', label: 'Đang giao hàng', done: delivered, occurredLabel: null },
    { key: 'DELIVERED', label: fulfillment === 'FAILED' ? 'Giao không thành công' : 'Đã giao', done: delivered, failed: fulfillment === 'FAILED', occurredLabel: at(dto.shipment?.deliveredAt) },
  ];
  const cancelled = dto.status === 'CANCELLED';
  // COD: mốc thanh toán không phải bước chặn — tính "current" trên các mốc giao hàng.
  const blocking = steps.filter((step) => prepaid || step.key !== 'PAID');
  const firstPending = cancelled ? undefined : blocking.find((step) => !step.done && !step.failed);
  const milestones: OrderMilestoneView[] = steps.map(({ done, failed, ...step }) => ({
    ...step,
    state: failed ? 'failed' : done ? 'done' : step.key === firstPending?.key || (step.key === 'IN_TRANSIT' && shipped && !delivered) ? 'current' : 'todo',
  }));
  if (cancelled) milestones.push({ key: 'CANCELLED', label: 'Đơn đã huỷ', state: 'failed', occurredLabel: null });
  return milestones;
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
    milestones: toOrderMilestones(dto),
    shipment: dto.shipment && (dto.shipment.trackingNo || dto.shipment.carrierCode)
      ? {
          carrierLabel: dto.shipment.carrierCode ? CARRIER_LABELS[dto.shipment.carrierCode] ?? dto.shipment.carrierCode : 'Shop tự giao',
          trackingNo: dto.shipment.trackingNo ?? null,
          trackingUrl: dto.shipment.trackingUrl ?? null,
        }
      : null,
    timeline: dto.statusHistory.map((entry) => ({
      key: `${entry.sequenceNo}-${entry.toStatus}`,
      statusCode: entry.toStatus,
      statusLabel: orderStatusLabels[entry.toStatus] ?? entry.toStatus,
      occurredLabel: formatDateTime(entry.createdAt),
      note: entry.reason ?? null,
    })),
  };
}
