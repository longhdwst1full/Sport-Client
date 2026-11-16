'use client';

import { useCallback, useEffect, useRef, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCartActions } from '@/features/cart';
import { useToast } from '@/shared/components/global-toast';
import type { ProductShowcaseItem } from '../model/product.mapper';
import { activeFlashPrice, useLiveVariantFlashPrices } from './use-variant-flash-prices';

/**
 * Thêm 1 biến thể mặc định của thẻ vào giỏ; `false` khi thẻ chưa đủ dữ liệu biến thể (nơi gọi mở
 * chi tiết để khách tự chọn).
 */
function useAddDefaultVariant() {
  const { addItem } = useCartActions();
  const flashPrices = useLiveVariantFlashPrices();
  // `useCartActions` trả object/hàm mới mỗi render và giá flash đổi theo query: giữ bản mới nhất trong ref
  // để callback ổn định, `ProductCard` (memo) không bị render lại cả lưới khi cha render.
  const latest = useRef({ addItem, flashPrices });
  useEffect(() => {
    latest.current = { addItem, flashPrices };
  });
  return useCallback(
    (product: ProductShowcaseItem) => {
      if (!product.isSellable || !product.defaultVariantId || !product.defaultVariantSku) return false;
      const { addItem, flashPrices } = latest.current;
      // Giá hiển thị trong giỏ khớp giá thẻ đang hiện (flash nếu có); checkout vẫn báo giá lại.
      const flash = activeFlashPrice(flashPrices, product.defaultVariantId);
      addItem({
        productId: product.id,
        variantId: product.defaultVariantId,
        sku: product.defaultVariantSku,
        productType: product.productType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
        price: flash?.price ?? product.numericPrice,
        regularPrice: product.numericPrice || undefined,
        quantity: 1,
      });
      return true;
    },
    [],
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
  const toastRef = useRef(toastCart);
  useEffect(() => {
    toastRef.current = toastCart;
  });

  return useCallback(
    (product: ProductShowcaseItem, e?: MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (!addDefaultVariant(product)) {
        router.push(`/products/${product.slug}`);
        return;
      }
      toastRef.current('Đã thêm vào giỏ hàng', product.name);
    },
    [router, addDefaultVariant],
  );
}
