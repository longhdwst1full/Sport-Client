import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addCartItem,
  clearCart,
  removeCartItem,
  updateQuantity,
  type CartItem,
} from '../model/cart.slice';

/**
 * Chỉ `features/cart` (và các thao tác cần đọc/ghi giỏ hàng) được đọc `state.cart` thô qua
 * `useAppSelector`; feature khác dùng hook này để không phải biết shape Redux của giỏ hàng.
 */
export function useCartItems(): CartItem[] {
  return useAppSelector((state) => state.cart.items);
}

export function useCartActions() {
  const dispatch = useAppDispatch();
  return {
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => dispatch(addCartItem(item)),
    removeItem: (variantId: string) => dispatch(removeCartItem(variantId)),
    updateQuantity: (variantId: string, quantity: number) => dispatch(updateQuantity({ variantId, quantity })),
    clear: () => dispatch(clearCart()),
  };
}
