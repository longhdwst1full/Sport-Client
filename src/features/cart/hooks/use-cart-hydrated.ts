'use client';

import { createContext, useContext } from 'react';

/**
 * `Providers` đọc giỏ đã lưu (localStorage/server) bất đồng bộ trước khi render tương tác giỏ hàng;
 * context này cho component biết bước đó đã xong để tránh nhấp nháy "giỏ rỗng" rồi mới có hàng.
 */
export const CartHydrationContext = createContext(false);

export function useCartHydrated(): boolean {
  return useContext(CartHydrationContext);
}
