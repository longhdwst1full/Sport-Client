'use client';

import { useRouter } from 'next/navigation';
import { useCartActions } from '@/features/cart';
import { toQuickAddCartItem } from '../model/assistant-quick-add';
import type { AssistantProductCardView } from '../model/assistant.types';

/**
 * "Mua ngay" từ thẻ sản phẩm của trợ lý, cùng ngữ nghĩa `useCardBuyNow` của Catalog: thẻ có biến thể mặc
 * định còn hàng (`quickAdd`) thì thêm 1 vào giỏ bằng thẳng `productId`/`variantId` của thẻ rồi sang checkout
 * `buyNow`; không có thì mở trang sản phẩm để khách tự chọn biến thể.
 */
export function useAssistantQuickAdd() {
  const router = useRouter();
  const { addItem } = useCartActions();

  const buyNow = (card: AssistantProductCardView) => {
    const item = toQuickAddCartItem(card);
    if (!item) {
      router.push(`/products/${encodeURIComponent(card.slug)}`);
      return;
    }
    addItem(item);
    router.push(`/checkout?buyNow=${encodeURIComponent(item.variantId)}`);
  };

  return { buyNow };
}
