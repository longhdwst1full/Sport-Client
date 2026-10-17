'use client';

import { useCallback, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCartActions } from '@/features/cart';
import { useToast } from '@/shared/components/global-toast';
import type { ProductShowcaseItem } from '../model/product.mapper';

/**
 * Thêm 1 biến thể mặc định của thẻ vào giỏ; `false` khi thẻ chưa đủ dữ liệu biến thể (nơi gọi mở
 * chi tiết để khách tự chọn).
 */
function useAddDefaultVariant() {
  const { addItem } = useCartActions();
  return useCallback(
    (product: ProductShowcaseItem) => {
      if (!product.isSellable || !product.defaultVariantId || !product.defaultVariantSku) return false;
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
      return true;
    },
    [addItem],
  );
}

/**
 * "Mua ngay" trên thẻ sản phẩm (lưới trưng bày, trang danh mục, sản phẩm liên quan): thẻ chưa đủ dữ
 * liệu biến thể mặc định thì mở chi tiết để khách tự chọn; đủ thì thêm 1 vào giỏ rồi sang checkout
 * `buyNow` đúng biến thể đó.
 */
export function useCardBuyNow() {
  const router = useRouter();
  const addDefaultVariant = useAddDefaultVariant();

  return useCallback(
    (product: ProductShowcaseItem, e?: MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (!addDefaultVariant(product)) {
        router.push(`/products/${product.slug}`);
        return;
      }
      router.push(`/checkout?buyNow=${product.defaultVariantId}`);
    },
    [router, addDefaultVariant],
  );
}

/** Nút giỏ (icon) trên thẻ sản phẩm: cùng điều kiện như "Mua ngay" nhưng ở lại trang và báo toast. */
export function useCardAddToCart() {
  const router = useRouter();
  const addDefaultVariant = useAddDefaultVariant();
  const { cart: toastCart } = useToast();

  return useCallback(
    (product: ProductShowcaseItem, e?: MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (!addDefaultVariant(product)) {
        router.push(`/products/${product.slug}`);
        return;
      }
      toastCart('Đã thêm vào giỏ hàng', product.name);
    },
    [router, addDefaultVariant, toastCart],
  );
}
