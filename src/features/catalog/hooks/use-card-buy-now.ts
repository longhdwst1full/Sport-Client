'use client';

import { useCallback, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCartActions } from '@/features/cart';
import type { ProductShowcaseItem } from '../model/product.mapper';

/**
 * "Mua ngay" trên thẻ sản phẩm (lưới trưng bày, trang danh mục, sản phẩm liên quan): thẻ chưa đủ dữ
 * liệu biến thể mặc định thì mở chi tiết để khách tự chọn; đủ thì thêm 1 vào giỏ rồi sang checkout
 * `buyNow` đúng biến thể đó.
 */
export function useCardBuyNow() {
  const router = useRouter();
  const { addItem } = useCartActions();

  return useCallback(
    (product: ProductShowcaseItem, e?: MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (!product.isSellable || !product.defaultVariantId || !product.defaultVariantSku) {
        router.push(`/products/${product.slug}`);
        return;
      }

      addItem({
        productId: product.id,
        variantId: product.defaultVariantId,
        sku: product.defaultVariantSku,
        productType: product.productType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
        price: product.numericPrice,
        quantity: 1,
      });

      router.push(`/checkout?buyNow=${product.defaultVariantId}`);
    },
    [router, addItem],
  );
}
