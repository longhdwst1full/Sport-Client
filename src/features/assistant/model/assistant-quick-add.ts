import type { CartItem } from '@/features/cart';
import type { AssistantProductCardView } from './assistant.types';

/**
 * Dòng giỏ cho "Thêm vào giỏ" từ thẻ sản phẩm; `null` khi thẻ không đủ điều kiện (mapper đã áp INVARIANT
 * còn hàng + có giá + có biến thể mặc định vào `quickAdd`).
 *
 * CONTRACT: thẻ chat chưa có `productType` nên ghi `STANDARD`. Server cart chỉ nhận `variantId` + số lượng, và giỏ
 * tài khoản đọc lại `productType` thật khi đồng bộ. Đổi ngay khi contract thẻ có field này.
 */
export function toQuickAddCartItem(card: AssistantProductCardView): CartItem | null {
  const option = card.quickAdd;
  if (!option) return null;
  return {
    productId: card.productId,
    variantId: option.variantId,
    sku: option.sku,
    productType: 'STANDARD',
    name: card.variants.length > 1 ? `${card.name} — ${option.variantName}` : card.name,
    slug: card.slug,
    imageUrl: card.imageUrl ?? undefined,
    // Giá chỉ là snapshot hiển thị; checkout luôn báo giá lại từ server.
    price: option.price,
    quantity: 1,
  };
}
