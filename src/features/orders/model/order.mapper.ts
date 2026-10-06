import type { OrderDetailDto, OrderSummaryDto } from '@/generated/api/orders/orders.schemas';
import { vndMoney, formatVnd } from '@/shared/format/money';
import { formatDateTime } from '@/shared/format/date-time';
import { orderStatusLabels, orderStatusTone, paymentStatusLabels } from './order.constants';

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
  key: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  label: string;
  subLabel?: string;
  state: OrderMilestoneState;
  /** Thời điểm hiển thị khi mốc đã xong và API có mốc thời gian. */
  occurredLabel: string | null;
}

export interface OrderShipmentView {
  carrierCode: string | null;
  carrierLabel: string;
  trackingNo: string | null;
  trackingUrl: string | null;
  shippedAtLabel: string | null;
  deliveredAtLabel: string | null;
  estimatedDeliveryLabel: string;
  statusText: string;
  hasTracking: boolean;
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
  statusDescription: string;
  lastUpdatedLabel: string;
  paymentStatusCode: string;
  paymentStatusLabel: string;
  paymentMethodCode: string;
  paymentMethodLabel: string;
  fulfillmentStatusCode: string;
  branchName: string;
  warehouseName: string;
  placedLabel: string;
  grandTotalLabel: string;
  subtotalLabel: string;
  shippingTotalLabel: string;
  /** So sánh trên số tiền gốc, không so chuỗi đã định dạng. */
  isShippingFree: boolean;
  discountTotalLabel: string;
  hasDiscount: boolean;
  itemCount: number;
  customerNote: string | null;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  version: number;
  items: OrderLineView[];
  /** Lịch sử chi tiết từng lần đổi trạng thái đơn. */
  timeline: OrderTimelineEntryView[];
  /** Các mốc chính cho khách: đặt hàng → xác nhận → xuất kho → đang giao → đã giao. */
  milestones: OrderMilestoneView[];
  shipment: OrderShipmentView;
}

const CARRIER_LABELS: Record<string, string> = {
  GHN: 'Giao Hàng Nhanh (GHN)',
  GHTK: 'Giao Hàng Tiết Kiệm (GHTK)',
  VIETTELPOST: 'Viettel Post',
  VNPOST: 'VNPost',
};

const at = (value?: string | null) => (value ? formatDateTime(value) : null);

export function getOrderStatusDescription(status: string, branchName?: string): string {
  switch (status) {
    case 'PENDING_CONFIRMATION':
      return 'Đơn hàng đã được tiếp nhận và đang chờ tư vấn viên kiểm tra xác nhận.';
    case 'CONFIRMED':
      return `Đơn hàng đã được xác nhận bởi ${branchName || 'Bảo An Sport'}. Đang chuyển giao bộ phận kho xử lý.`;
    case 'PICKING':
      return 'Nhân viên kho đang tiến hành lấy hàng và kiểm tra chất lượng sản phẩm.';
    case 'PACKED':
      return 'Đơn hàng đã được đóng gói hoàn tất và sẵn sàng bàn giao cho đơn vị vận chuyển.';
    case 'SHIPPED':
      return 'Đơn hàng đã được bàn giao cho đối tác vận chuyển và đang trên đường giao tới bạn.';
    case 'DELIVERED':
      return 'Đơn hàng đã được giao thành công tới người nhận. Cảm ơn bạn đã mua sắm tại Bảo An Sport!';
    case 'COMPLETED':
      return 'Đơn hàng đã hoàn tất thành công. Chúc bạn có trải nghiệm tuyệt vời cùng sản phẩm!';
    case 'CANCELLED':
      return 'Đơn hàng này đã bị hủy. Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ CSKH.';
    default:
      return 'Đơn hàng đang trong quy trình xử lý của hệ thống.';
  }
}

/**
 * Dựng 5 mốc tiến trình giao nhận thực tế: Đặt hàng → Xác nhận → Xuất kho/Đóng gói → Đang giao → Đã giao.
 * Tách biệt hoàn toàn với trạng thái thanh toán (đặc biệt là COD) để tránh gây hiểu nhầm cho khách hàng.
 */
export function toOrderMilestones(dto: OrderDetailDto): OrderMilestoneView[] {
  const fulfillment = dto.shipment?.status ?? dto.fulfillmentStatus;
  const isCancelled = dto.status === 'CANCELLED';

  const confirmedAt = dto.statusHistory.find((e) => e.toStatus === 'CONFIRMED')?.createdAt;
  const packedAt = dto.shipment?.shippedAt ?? dto.statusHistory.find((e) => e.toStatus === 'PACKED' || e.toStatus === 'PICKING')?.createdAt;
  const shippedAt = dto.shipment?.shippedAt ?? dto.statusHistory.find((e) => e.toStatus === 'SHIPPED')?.createdAt;
  const deliveredAt = dto.shipment?.deliveredAt ?? dto.statusHistory.find((e) => e.toStatus === 'DELIVERED' || e.toStatus === 'COMPLETED')?.createdAt;
  const cancelledAt = dto.statusHistory.find((e) => e.toStatus === 'CANCELLED')?.createdAt;

  const hasConfirmed = [
    'CONFIRMED', 'PICKING', 'PACKED', 'SHIPPED', 'DELIVERED', 'COMPLETED',
  ].includes(dto.status);

  const hasPacked = [
    'PACKED', 'SHIPPED', 'DELIVERED', 'COMPLETED',
  ].includes(dto.status) || Boolean(dto.shipment?.trackingNo) || ['PACKED', 'SHIPPED', 'DELIVERED'].includes(fulfillment);

  const hasShipped = [
    'SHIPPED', 'DELIVERED', 'COMPLETED',
  ].includes(dto.status) || fulfillment === 'SHIPPED' || fulfillment === 'DELIVERED';

  const hasDelivered = [
    'DELIVERED', 'COMPLETED',
  ].includes(dto.status) || fulfillment === 'DELIVERED';

  const isDeliveryFailed = fulfillment === 'FAILED' || fulfillment === 'DELIVERY_FAILED';

  const steps: Array<Omit<OrderMilestoneView, 'state'> & { done: boolean; failed?: boolean }> = [
    {
      key: 'PLACED',
      label: 'Đặt hàng thành công',
      subLabel: 'Đã nhận thông tin đơn hàng',
      done: true,
      occurredLabel: at(dto.placedAt),
    },
    {
      key: 'CONFIRMED',
      label: 'Đã xác nhận đơn hàng',
      subLabel: 'Bảo An Sport xác nhận',
      done: hasConfirmed,
      occurredLabel: at(confirmedAt),
    },
    {
      key: 'PACKED',
      label: dto.shipment?.trackingNo ? 'Đã xuất kho' : 'Đã đóng gói',
      subLabel: 'Sẵn sàng vận chuyển',
      done: hasPacked,
      occurredLabel: at(packedAt),
    },
    {
      key: 'IN_TRANSIT',
      label: 'Đang giao hàng',
      subLabel: hasShipped ? 'Đang trên đường giao' : 'Chờ cập nhật',
      done: hasDelivered,
      occurredLabel: at(shippedAt),
    },
    {
      key: 'DELIVERED',
      label: isDeliveryFailed ? 'Giao không thành công' : 'Đã giao hàng',
      subLabel: isDeliveryFailed ? 'Chờ hỗ trợ giao lại' : hasDelivered ? 'Đã nhận hàng' : 'Chờ hoàn tất',
      done: hasDelivered,
      failed: isDeliveryFailed,
      occurredLabel: at(deliveredAt),
    },
  ];

  const firstPending = isCancelled ? undefined : steps.find((s) => !s.done && !s.failed);

  const milestones: OrderMilestoneView[] = steps.map(({ done, failed, ...step }) => {
    let state: OrderMilestoneState = 'todo';
    if (failed) {
      state = 'failed';
    } else if (done) {
      state = 'done';
    } else if (step.key === firstPending?.key || (step.key === 'IN_TRANSIT' && hasShipped && !hasDelivered)) {
      state = 'current';
    }
    return { ...step, state };
  });

  if (isCancelled) {
    milestones.push({
      key: 'CANCELLED',
      label: 'Đơn đã hủy',
      subLabel: 'Giao dịch đã dừng',
      state: 'failed',
      occurredLabel: at(cancelledAt),
    });
  }

  return milestones;
}

export interface OrderListItemView {
  id: string;
  orderNo: string;
  placedAtLabel: string;
  branchName: string;
  statusCode: string;
  statusLabel: string;
  statusToneClass: string;
  paymentStatusLabel: string;
  recipientName: string;
  grandTotalLabel: string;
}

/** Danh sách đơn dùng nhãn ngắn gọn cho item card; chi tiết đầy đủ dùng `toOrderDetailView`. */
export function toOrderListItemView(order: OrderSummaryDto): OrderListItemView {
  return {
    id: order.id,
    orderNo: order.orderNo,
    placedAtLabel: formatDateTime(order.placedAt),
    branchName: order.branchName,
    statusCode: order.status,
    statusLabel: orderStatusLabels[order.status] ?? order.status,
    statusToneClass: orderStatusTone[order.status] ?? 'bg-slate-100 text-slate-700 ring-slate-200',
    paymentStatusLabel: paymentStatusLabels[order.paymentStatus] ?? order.paymentStatus,
    recipientName: order.recipient.name,
    grandTotalLabel: formatVnd(Number(order.grandTotal)),
  };
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

  const lastHistoryEntry = dto.statusHistory.length > 0
    ? dto.statusHistory[dto.statusHistory.length - 1]
    : undefined;
  const lastUpdatedTime = lastHistoryEntry?.createdAt
    ?? dto.shipment?.deliveredAt
    ?? dto.shipment?.shippedAt
    ?? dto.paidAt
    ?? dto.placedAt;

  const shipmentDto = dto.shipment;
  const hasTracking = Boolean(shipmentDto?.trackingNo);
  const carrierLabel = shipmentDto?.carrierCode
    ? (CARRIER_LABELS[shipmentDto.carrierCode] ?? shipmentDto.carrierCode)
    : (hasTracking ? 'Đối tác vận chuyển' : 'Đang điều phối');

  let estimatedDeliveryLabel = 'Đang xác nhận lịch giao';
  if (dto.status === 'DELIVERED' || dto.status === 'COMPLETED') {
    estimatedDeliveryLabel = shipmentDto?.deliveredAt ? `Đã giao lúc ${formatDateTime(shipmentDto.deliveredAt)}` : 'Đã giao thành công';
  } else if (dto.status === 'SHIPPED' || shipmentDto?.status === 'SHIPPED') {
    estimatedDeliveryLabel = 'Dự kiến 1 - 3 ngày làm việc';
  } else if (dto.status === 'CANCELLED') {
    estimatedDeliveryLabel = 'Đơn đã hủy';
  } else {
    estimatedDeliveryLabel = 'Dự kiến 2 - 4 ngày làm việc sau khi xuất kho';
  }

  let statusText = 'Đang chuẩn bị bàn giao cho đơn vị vận chuyển';
  if (dto.status === 'DELIVERED' || dto.status === 'COMPLETED') {
    statusText = 'Đơn hàng đã được giao thành công';
  } else if (dto.status === 'SHIPPED') {
    statusText = 'Đơn hàng đã bàn giao cho đơn vị vận chuyển và đang trên đường giao';
  } else if (dto.status === 'PACKED' || dto.status === 'PICKING') {
    statusText = 'Đã chuẩn bị hàng, đang chờ đơn vị vận chuyển đến lấy';
  } else if (dto.status === 'CANCELLED') {
    statusText = 'Đơn hàng đã bị hủy';
  } else if (dto.status === 'CONFIRMED') {
    statusText = 'Đã xác nhận đơn hàng, đang chuyển phiếu cho kho';
  } else {
    statusText = 'Đơn hàng đang chờ nhân viên kiểm tra xác nhận';
  }

  const shipmentView: OrderShipmentView = {
    carrierCode: shipmentDto?.carrierCode ?? null,
    carrierLabel,
    trackingNo: shipmentDto?.trackingNo ?? null,
    trackingUrl: shipmentDto?.trackingUrl ?? null,
    shippedAtLabel: at(shipmentDto?.shippedAt),
    deliveredAtLabel: at(shipmentDto?.deliveredAt),
    estimatedDeliveryLabel,
    statusText,
    hasTracking,
  };

  return {
    id: dto.id,
    orderNo: dto.orderNo,
    statusCode: dto.status,
    statusLabel: orderStatusLabels[dto.status] ?? dto.status,
    statusDescription: getOrderStatusDescription(dto.status, dto.branchName),
    lastUpdatedLabel: formatDateTime(lastUpdatedTime),
    paymentStatusCode: dto.paymentStatus,
    paymentStatusLabel: paymentStatusLabels[dto.paymentStatus] ?? dto.paymentStatus,
    paymentMethodCode: dto.paymentMethod,
    paymentMethodLabel: paymentMethodLabels[dto.paymentMethod] ?? dto.paymentMethod,
    fulfillmentStatusCode: dto.fulfillmentStatus,
    branchName: dto.branchName,
    warehouseName: dto.warehouseName || dto.branchName,
    placedLabel: formatDateTime(dto.placedAt),
    grandTotalLabel: money(dto.grandTotal),
    subtotalLabel: money(dto.subtotal),
    shippingTotalLabel: money(dto.shippingTotal),
    isShippingFree: Number(dto.shippingTotal ?? 0) === 0,
    discountTotalLabel: money(dto.discountTotal),
    hasDiscount: Number(dto.discountTotal ?? 0) > 0,
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
    shipment: shipmentView,
    timeline: dto.statusHistory.map((entry) => ({
      key: `${entry.sequenceNo}-${entry.toStatus}`,
      statusCode: entry.toStatus,
      statusLabel: orderStatusLabels[entry.toStatus] ?? entry.toStatus,
      occurredLabel: formatDateTime(entry.createdAt),
      note: entry.reason ?? null,
    })),
  };
}
