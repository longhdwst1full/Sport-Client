'use client';

import { createContext, useCallback, useContext, type ReactNode } from 'react';
import { resolveCartLinePrice, type CartLinePrice, type CartPromoPrices } from '../model/cart-promo-price';

const CartPromoPriceContext = createContext<CartPromoPrices | null>(null);

/** Route group cấp giá suất flash sống cho giỏ/checkout (`null` = chưa biết). */
export function CartPromoPriceProvider({ prices, children }: { prices: CartPromoPrices | null; children: ReactNode }) {
  return <CartPromoPriceContext.Provider value={prices}>{children}</CartPromoPriceContext.Provider>;
}

/** Hàm tính đơn giá/thành tiền của một dòng theo đúng luật suất flash của checkout. */
export function useCartLinePricing(): (item: { variantId: string; price: number; quantity: number }) => CartLinePrice {
  const promos = useContext(CartPromoPriceContext);
  return useCallback((item) => resolveCartLinePrice(item, promos, Date.now()), [promos]);
}
