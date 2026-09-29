import { isSupportTicketStatus } from '@/features/support';
import { fulfillmentStatusLabels, orderStatusLabels, paymentStatusLabels } from '@/features/orders';
import type {
  ChatCardDto,
  ChatMessageDto,
  ChatOrderCardDto,
  ChatProductCardDto,
} from '@/generated/api/assistant/assistant.schemas';
import type { AssistantCardView, AssistantMessageView, AssistantProductCardView } from './assistant.types';

/** Giá VND dạng chuỗi thập phân → số; null/rỗng/0 = chưa có giá bán (không bao giờ hiển thị "0 đ"). */
function toPrice(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

/** Nhãn theo mã contract; mã client chưa biết thì hiện mã thô thay vì nhãn sai. */
function labelOf(labels: Record<string, string>, code: string): string {
  return labels[code] ?? code;
}

function toProductCard(dto: ChatProductCardDto): AssistantProductCardView {
  const variants = dto.variants.map((variant) => ({
    variantId: variant.variantId,
    sku: variant.sku,
    name: variant.name,
    price: toPrice(variant.effectivePrice),
    inStock: variant.inStock,
  }));
  // INVARIANT: thêm nhanh chỉ khi API chỉ định biến thể mặc định, biến thể đó CÒN HÀNG (true, không phải null),
  // có giá hiệu lực và sản phẩm không báo hết hàng. Mọi trường hợp khác: khách chọn trên trang sản phẩm.
  const defaultVariant = dto.variantId ? variants.find((variant) => variant.variantId === dto.variantId) : undefined;
  const quickAdd =
    defaultVariant && defaultVariant.inStock === true && defaultVariant.price !== null && dto.inStock !== false
      ? { variantId: defaultVariant.variantId, sku: defaultVariant.sku, variantName: defaultVariant.name, price: defaultVariant.price }
      : null;
  return {
    kind: 'product',
    productId: dto.productId,
    slug: dto.slug,
    name: dto.name,
    brand: dto.brand,
    imageUrl: dto.imageUrl,
    price: toPrice(dto.price),
    inStock: dto.inStock,
    variants,
    quickAdd,
  };
}

function toOrderCard(dto: ChatOrderCardDto): AssistantCardView {
  const shipment = [dto.carrierCode, dto.trackingNo].filter(Boolean).join(' · ');
  return {
    kind: 'order',
    orderNo: dto.orderNo,
    statusLabel: labelOf(orderStatusLabels, dto.status),
    paymentStatusLabel: labelOf(paymentStatusLabels, dto.paymentStatus),
    fulfillmentStatusLabel: labelOf(fulfillmentStatusLabels, dto.fulfillmentStatus),
    grandTotal: toPrice(dto.grandTotal),
    placedAt: dto.placedAt,
    shipmentLabel: shipment || null,
  };
}

function toCard(dto: ChatCardDto): AssistantCardView | null {
  // CONTRACT: `type` chọn đúng một payload; thiếu payload tương ứng thì bỏ thẻ, không dựng thẻ rỗng.
  if (dto.type === 'PRODUCT' && dto.product) return toProductCard(dto.product);
  if (dto.type === 'ORDER' && dto.order) return toOrderCard(dto.order);
  if (dto.type === 'TICKET' && dto.ticket) {
    return {
      kind: 'ticket',
      ticketNo: dto.ticket.ticketNo,
      status: isSupportTicketStatus(dto.ticket.status) ? dto.ticket.status : null,
      statusCode: dto.ticket.status,
    };
  }
  return null;
}

export function toAssistantMessageView(dto: ChatMessageDto): AssistantMessageView {
  return {
    id: dto.id,
    role: dto.role,
    content: dto.content,
    createdAt: dto.createdAt,
    feedback: dto.feedback,
    cards: dto.cards.map(toCard).filter((card): card is AssistantCardView => card !== null),
    // Nhiều đoạn của cùng một bài chỉ hiện một nguồn.
    sources: dto.sources
      .filter((source, index, all) => all.findIndex((other) => other.documentId === source.documentId) === index)
      .map((source) => ({ key: source.documentId, title: source.title })),
  };
}
