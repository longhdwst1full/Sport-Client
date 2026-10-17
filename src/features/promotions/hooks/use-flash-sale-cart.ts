'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCartActions } from '@/features/cart';
import { useToast } from '@/shared/components/global-toast';
import type { FlashSaleDealView } from '../model/flash-sale.mapper';

/**
 * Thêm vào giỏ / Mua ngay cho thẻ suất flash (khối trang chủ, trang flash sale). SKU và variantId lấy
 * từ suất thật; giá phải trả cuối cùng vẫn do checkout báo giá lại với server
 * (`07-state-tools-performance.md`). Suất chỉ được giữ khi thanh toán, không phải khi thêm vào giỏ.
 */
export function useFlashSaleCart() {
  const router = useRouter();
  const { addItem } = useCartActions();
  const { cart: toastCart } = useToast();

  const add = useCallback(
    (deal: FlashSaleDealView) =>
      addItem({
        variantId: deal.variantId,
        productId: deal.variantId,
        name: deal.name,
        sku: deal.sku,
        productType: 'STANDARD',
        price: deal.price,
        regularPrice: deal.originalPrice ?? undefined,
        quantity: 1,
        imageUrl: deal.imageUrl ?? undefined,
        slug: deal.slug,
      }),
    [addItem],
  );

  const addToCart = useCallback(
    (deal: FlashSaleDealView) => {
      add(deal);
      toastCart('Đã thêm vào giỏ hàng', deal.name);
    },
    [add, toastCart],
  );

  const buyNow = useCallback(
    (deal: FlashSaleDealView) => {
      add(deal);
      router.push(`/checkout?buyNow=${deal.variantId}`);
    },
    [add, router],
  );

  return { addToCart, buyNow };
}
