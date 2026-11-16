// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCardAddToCart, useCardBuyNow } from './use-card-buy-now';

const router = { push: vi.fn() };
// Router thật của Next có định danh ổn định giữa các render.
vi.mock('next/navigation', () => ({ useRouter: () => router }));
vi.mock('@/features/cart', () => ({
  // Giống `useCartActions` thật: object và hàm mới mỗi lần gọi.
  useCartActions: () => ({ addItem: vi.fn() }),
}));
vi.mock('@/shared/components/global-toast', () => ({
  useToast: () => ({ cart: vi.fn() }),
}));

describe('card buy/add handlers', () => {
  it('giữ nguyên định danh callback qua các lần render để memo(ProductCard) có tác dụng', () => {
    const buy = renderHook(() => useCardBuyNow());
    const first = buy.result.current;
    buy.rerender();
    expect(buy.result.current).toBe(first);

    const add = renderHook(() => useCardAddToCart());
    const firstAdd = add.result.current;
    add.rerender();
    expect(add.result.current).toBe(firstAdd);
  });
});
