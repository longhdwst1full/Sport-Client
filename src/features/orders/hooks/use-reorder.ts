'use client';

import { useCartActions } from '@/features/cart';
import type { OrderDetailDto } from '@/generated/api/orders/orders.schemas';

/** Mua lại cả đơn hoặc từng dòng: thêm vào giỏ trên máy rồi báo bằng toast của màn đơn. */
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
    order.items.forEach((item) => {
      addItem({
          productId: item.id,
          variantId: item.id,
          sku: item.sku,
          productType: item.itemType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
          name: item.productName,
          imageUrl: item.imageUrl ?? undefined,
          price: Number(item.unitPrice) || 0,
          quantity: item.quantity || 1,
        });
    });
    triggerToast(`Đã thêm ${order.items.length} sản phẩm vào giỏ hàng!`);
  };

  const handleReorderItem = (item: { id: string; sku: string; productName: string; imageUrl: string | null; quantity: number }, unitPrice: number) => {
    addItem({
        productId: item.id,
        variantId: item.id,
        sku: item.sku,
        productType: 'STANDARD',
        name: item.productName,
        imageUrl: item.imageUrl ?? undefined,
        price: unitPrice,
        quantity: item.quantity || 1,
      });
    triggerToast(`Đã thêm "${item.productName}" vào giỏ hàng!`);
  };

  return { handleReorderAll, handleReorderItem };
}
