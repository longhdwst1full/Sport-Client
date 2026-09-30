import type { CartItem } from '@/features/cart';
import type { AssistantProductCardView } from './assistant.types';

/**
 * Dòng giỏ cho "Thêm vào giỏ" từ thẻ sản phẩm; `null` khi thẻ không đủ điều kiện (mapper đã áp INVARIANT
 * còn hàng + có giá + có biến thể mặc định vào `quickAdd`).
 */
export function toQuickAddCartItem(card: AssistantProductCardView): CartItem | null {
  const option = card.quickAdd;
  if (!option) return null;
  return {
    productId: card.productId,
    variantId: option.variantId,
    sku: option.sku,
    productType: card.productType,
    name: card.variants.length > 1 ? `${card.name} — ${option.variantName}` : card.name,
    slug: card.slug,
    imageUrl: card.imageUrl ?? undefined,
    // Giá chỉ là snapshot hiển thị; checkout luôn báo giá lại từ server.
    price: option.price,
    quantity: 1,
  };
}
