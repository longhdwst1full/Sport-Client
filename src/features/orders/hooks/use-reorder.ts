'use client';

import { useCartActions } from '@/features/cart';
import type { OrderDetailDto, OrderItemDto } from '@/generated/api/orders/orders.schemas';

/** Dòng đơn → dòng giỏ. Dùng `productVariantId` (không phải id dòng đơn) để giỏ/checkout nhận đúng biến thể. */
function toCartItem(item: OrderItemDto) {
  return {
    productId: item.productId ?? item.productVariantId,
    variantId: item.productVariantId,
    sku: item.sku,
    productType: item.itemType === 'BUNDLE' ? ('BUNDLE' as const) : ('STANDARD' as const),
    name: item.variantName && item.variantName !== item.productName ? `${item.productName} — ${item.variantName}` : item.productName,
    slug: item.productSlug ?? undefined,
    imageUrl: item.imageUrl ?? undefined,
    // Giá lúc mua chỉ là ảnh chụp hiển thị; checkout luôn báo giá lại theo giá hiện hành.
    price: Number(item.unitPrice) || 0,
    quantity: item.quantity || 1,
  };
}

/**
 * Mua lại cả đơn hoặc từng dòng: thêm vào giỏ trên máy rồi báo bằng toast của màn đơn. Một biến thể có
 * thể nằm ở hai dòng (dòng giá flash + dòng giá thường khi mua vượt suất): giỏ gộp theo biến thể.
 */
export function useReorder({
  order,
  triggerToast,
}: {
  order: OrderDetailDto | undefined;
  triggerToast: (msg: string) => void;
}) {
  const { addItem } = useCartActions();

  const handleReorderAll = () => {
    if (!order || !order.items.length) return;
    order.items.forEach((item) => addItem(toCartItem(item)));
    const variantCount = new Set(order.items.map((item) => item.productVariantId)).size;
    triggerToast(`Đã thêm ${variantCount} sản phẩm vào giỏ hàng!`);
  };

  const handleReorderItem = (orderItemId: string) => {
    const item = order?.items.find((candidate) => candidate.id === orderItemId);
    if (!item) return;
    addItem(toCartItem(item));
    triggerToast(`Đã thêm "${item.productName}" vào giỏ hàng!`);
  };

  return { handleReorderAll, handleReorderItem };
}
