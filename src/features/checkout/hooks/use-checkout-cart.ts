'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartHydrated, useCartItems } from '@/features/cart';

/** Dòng giỏ được thanh toán ở lượt này (mua ngay / chọn một phần giỏ / cả giỏ) và tạm tính trên máy. */
export function useCheckoutCart() {
  const searchParams = useSearchParams();
  const items = useCartItems();
  const cartHydrated = useCartHydrated();

  const buyNowParam = searchParams.get('buyNow');
  const itemsParam = searchParams.get('items');

  // Mua ngay hoặc chọn sản phẩm trong giỏ: chỉ thanh toán đúng các sản phẩm này
  const effectiveItems = useMemo(() => {
    if (buyNowParam) {
      const match = items.find((i) => i.variantId === buyNowParam);
      return match ? [match] : [];
    }
    if (itemsParam) {
      const allowed = new Set(itemsParam.split(',').filter(Boolean));
      const filtered = items.filter((i) => allowed.has(i.variantId));
      return filtered.length > 0 ? filtered : [];
    }
    return items;
  }, [items, buyNowParam, itemsParam]);

  const localSubtotal = useMemo(
    () => effectiveItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [effectiveItems]
  );

  return { effectiveItems, localSubtotal, cartHydrated };
}
