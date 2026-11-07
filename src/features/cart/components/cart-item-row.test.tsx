// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { CartItemRow } from './cart-item-row';

afterEach(cleanup);

const item = { productId: 'p1', variantId: 'v1', sku: 'TA-5KG', productType: 'STANDARD' as const, name: 'Tạ tay', price: 100, quantity: 5 };
const linePrice = { promo: null, lineTotal: 500 } as never;

function setup(quantity: number, availableQuantity: number | undefined, maxQuantity: number) {
  render(
    <CartItemRow
      item={{ ...item, quantity }}
      isSelected
      onToggleSelect={vi.fn()}
      onDecrementQuantity={vi.fn()}
      onIncrementQuantity={vi.fn()}
      onCommitQuantity={vi.fn()}
      maxQuantity={maxQuantity}
      availableQuantity={availableQuantity}
      onRemove={vi.fn()}
      linePrice={linePrice}
    />,
  );
}

describe('CartItemRow stock limit', () => {
  it('warns when the line exceeds what can still be ordered', () => {
    setup(5, 3, 3);
    expect(screen.getByTestId('cart-line-overstock').textContent).toContain('Chỉ còn 3 sản phẩm có thể đặt');
    expect((screen.getByRole('button', { name: 'Tăng số lượng' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('tells the customer to remove a sold-out line', () => {
    setup(1, 0, 0);
    expect(screen.getByTestId('cart-line-overstock').textContent).toContain('đã hết hàng');
  });

  it('shows no warning and keeps + enabled below the limit or when stock is unknown', () => {
    setup(2, 3, 3);
    expect(screen.queryByTestId('cart-line-overstock')).toBeNull();
    expect((screen.getByRole('button', { name: 'Tăng số lượng' }) as HTMLButtonElement).disabled).toBe(false);
    cleanup();
    setup(50, undefined, 999);
    expect(screen.queryByTestId('cart-line-overstock')).toBeNull();
  });
});
