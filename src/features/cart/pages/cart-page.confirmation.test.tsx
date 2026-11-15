// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CartPage } from './cart-page';

const mocks = vi.hoisted(() => ({ clear: vi.fn(), toast: vi.fn(), items: [
  { productId: '1', variantId: '2', sku: 'SKU-2', productType: 'STANDARD', name: 'Bóng bàn', price: 100000, quantity: 1 },
] }));
vi.mock('../hooks/use-cart', () => ({ useCartItems: () => mocks.items, useCartActions: () => ({ clear: mocks.clear, removeItem: vi.fn(), updateQuantity: vi.fn() }) }));
vi.mock('../hooks/use-cart-line-pricing', () => ({ useCartLinePricing: () => () => ({ lineTotal: 100000 }) }));
vi.mock('../hooks/use-cart-hydrated', () => ({ useCartHydrated: () => true }));
vi.mock('../hooks/use-cart-stock-limits', () => ({ useCartStockLimits: () => () => 10 }));
vi.mock('@/shared/components/global-toast', () => ({ useToast: () => ({ toast: mocks.toast }) }));
vi.mock('../components/cart-item-row', () => ({ CartItemRow: () => <p>Bóng bàn</p> }));
vi.mock('../components/cart-summary', () => ({ CartSummary: () => <p>Tổng tiền</p> }));

describe('Cart clear confirmation', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(cleanup);
  function open() {
    render(<CartPage />);
    const trigger = screen.getByRole('button', { name: 'Xóa tất cả' });
    trigger.focus();
    fireEvent.click(trigger);
    return trigger;
  }
  it('does not clear on open, initially focuses safe action, cancels and restores focus', () => {
    const trigger = open();
    const dialog = screen.getByRole('dialog', { name: 'Xóa toàn bộ giỏ hàng?' });
    const cancel = within(dialog).getByRole('button', { name: 'Giữ giỏ hàng' });
    expect(document.activeElement).toBe(cancel);
    expect(mocks.clear).not.toHaveBeenCalled();
    fireEvent.click(cancel);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(mocks.clear).not.toHaveBeenCalled();
  });
  it('traps focus and closes on Escape without clearing', () => {
    const trigger = open();
    const cancel = screen.getByRole('button', { name: 'Giữ giỏ hàng' });
    const confirm = screen.getByRole('button', { name: 'Xóa tất cả sản phẩm' });
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(confirm);
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(cancel);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(mocks.clear).not.toHaveBeenCalled();
  });
  it('clears exactly once only after confirmation and shows feedback', () => {
    open();
    fireEvent.click(screen.getByRole('button', { name: 'Xóa tất cả sản phẩm' }));
    expect(mocks.clear).toHaveBeenCalledTimes(1);
    expect(mocks.toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Giỏ hàng trống' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
