'use client';

import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isCustomerAuthenticated } from '@/core/auth/customer-auth-token.store';
import { getAccountCart, getGuestCart } from '@/generated/api/cart/cart';
import { ApiError } from '@/lib/api/fetcher';
import type { CartItem } from '../model/cart.slice';
import { readGuestCartToken } from '../model/guest-cart-token.store';

/**
 * Số lượng đặt được mới nhất theo dòng giỏ, đọc từ giỏ server (`CartItemDto.availableQuantity`).
 *
 * CONTRACT: chỉ ĐỌC — không tạo giỏ khách mới chỉ để xem tồn. Đang đăng nhập thì giỏ tài khoản đã được
 * saga ghi theo; khách chưa đăng nhập chỉ có giỏ server khi đã từng vào checkout (còn token). SKU giỏ server
 * chưa có (vừa thêm, ghi chưa tới) rơi về ảnh chụp `CartItem.availableQuantity` lúc thêm; không có cả hai
 * thì UI không chặn — backend vẫn kiểm khi giữ hàng.
 */
export function useCartStockLimits(items: readonly CartItem[]) {
  const authenticated = isCustomerAuthenticated();
  const guestToken = authenticated ? null : readGuestCartToken();
  const variantKey = useMemo(() => [...new Set(items.map(({ variantId }) => variantId))].sort().join(','), [items]);

  const { data: serverLimits } = useQuery({
    queryKey: ['cart-stock-limits', authenticated ? 'account' : guestToken ? 'guest' : 'local', variantKey],
    enabled: variantKey.length > 0 && (authenticated || Boolean(guestToken)),
    // Tồn đổi liên tục: không giữ lâu, quay lại tab thì đọc lại.
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    queryFn: async (): Promise<Record<string, number>> => {
      try {
        const cart = authenticated
          ? await getAccountCart()
          : await getGuestCart({ headers: { 'x-cart-token': guestToken ?? '' } });
        return Object.fromEntries(cart.items.map((item) => [item.productVariantId, item.availableQuantity]));
      } catch (error) {
        // Giỏ khách hết hạn/không còn: không có số mới, dùng ảnh chụp.
        if (error instanceof ApiError && error.status === 404) return {};
        throw error;
      }
    },
  });

  /** Số đặt được của một dòng; `undefined` = chưa biết (không chặn). */
  return useCallback(
    (item: Pick<CartItem, 'variantId' | 'availableQuantity'>): number | undefined =>
      serverLimits?.[item.variantId] ?? item.availableQuantity,
    [serverLimits],
  );
}
