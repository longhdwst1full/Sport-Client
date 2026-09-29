'use client';

import { useCartActions } from '@/features/cart';
import { useToast } from '@/shared/components/global-toast';
import { toQuickAddCartItem } from '../model/assistant-quick-add';
import type { AssistantProductCardView } from '../model/assistant.types';

/** "Thêm vào giỏ" từ thẻ sản phẩm của trợ lý, dùng thẳng `productId`/`variantId` của thẻ (không gọi thêm Catalog). */
export function useAssistantQuickAdd() {
  const { addItem } = useCartActions();
  const toast = useToast();

  const add = (card: AssistantProductCardView) => {
    const item = toQuickAddCartItem(card);
    if (!item) return;
    addItem(item);
    toast.cart('Đã thêm vào giỏ hàng', item.name);
  };

  return { add };
}
