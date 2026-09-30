import type { SupportTicketStatus } from '@/features/support';
import type { ChatMessageFeedback, ChatMessageRole, ProductType } from '@/generated/api/assistant/assistant.schemas';

/**
 * View model của trợ lý mua sắm. `assistant.mapper.ts` là nơi duy nhất đọc tên field của `ChatMessageDto`.
 */
export type AssistantMessageRole = ChatMessageRole;
export type AssistantFeedback = ChatMessageFeedback;

export type AssistantProductVariantView = {
  variantId: string;
  sku: string;
  name: string;
  price: number | null;
  inStock: boolean | null;
};

/**
 * INVARIANT (D75): tồn kho phía khách chỉ là `inStock` (còn/hết, `null` = API không nói). View model cố ý không có
 * field số lượng, để không component nào có thể hiển thị hay suy ra số tồn.
 */
/** Biến thể được phép "Thêm vào giỏ" thẳng từ thẻ; đủ dữ liệu dựng dòng giỏ mà không phải gọi Catalog. */
export type AssistantQuickAddView = {
  variantId: string;
  sku: string;
  variantName: string;
  price: number;
};

export type AssistantProductCardView = {
  kind: 'product';
  productId: string;
  /** Loại sản phẩm theo contract (STANDARD/BUNDLE) — ghi đúng vào dòng giỏ. */
  productType: ProductType;
  slug: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  /** Giá thấp nhất (VND, đã gồm VAT) — chỉ là snapshot hiển thị, checkout báo giá lại. */
  price: number | null;
  inStock: boolean | null;
  variants: AssistantProductVariantView[];
  /**
   * INVARIANT: chỉ có khi biến thể mặc định (`variantId` của thẻ) nằm trong danh sách, `inStock === true` và có giá.
   * Tồn kho không rõ (`null`) hay hết hàng thì khách chọn trên trang sản phẩm.
   */
  quickAdd: AssistantQuickAddView | null;
};

export type AssistantOrderCardView = {
  kind: 'order';
  orderNo: string;
  statusLabel: string;
  paymentStatusLabel: string;
  fulfillmentStatusLabel: string;
  grandTotal: number | null;
  placedAt: string;
  /** "Hãng · mã vận đơn" khi đã có vận đơn. */
  shipmentLabel: string | null;
};

export type AssistantTicketCardView = {
  kind: 'ticket';
  ticketNo: string;
  /** `null` khi API trả trạng thái client chưa biết; UI hiện mã thô. */
  status: SupportTicketStatus | null;
  statusCode: string;
};

export type AssistantCardView = AssistantProductCardView | AssistantOrderCardView | AssistantTicketCardView;

export type AssistantSourceView = { key: string; title: string };

export type AssistantMessageView = {
  id: string;
  role: AssistantMessageRole;
  content: string;
  createdAt: string;
  feedback: AssistantFeedback | null;
  cards: AssistantCardView[];
  sources: AssistantSourceView[];
};
