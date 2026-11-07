// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ProductPurchaseView } from '../model/product.mapper';
import { ProductPurchasePanel } from './product-purchase-panel';

const addItem = vi.fn();
const toast = vi.fn();
let cartItems: Array<{ variantId: string; quantity: number }> = [];

vi.mock('next/navigation', () => ({ useRouter: () => ({ prefetch: vi.fn(), push: vi.fn() }) }));
vi.mock('@/shared/components/global-toast', () => ({ useToast: () => ({ cart: vi.fn(), toast }) }));
vi.mock('../hooks/use-variant-flash-prices', () => ({ useLiveVariantFlashPrices: () => undefined }));
vi.mock('@/features/cart', async () => ({
  ...(await vi.importActual<typeof import('@/features/cart/model/stock-limit')>('@/features/cart/model/stock-limit')),
  useCartActions: () => ({ addItem }),
  useCartItems: () => cartItems,
}));

afterEach(cleanup);
beforeEach(() => {
  addItem.mockReset();
  toast.mockReset();
  cartItems = [];
});

function product(availableQuantity: number | null, inStock: boolean | null = (availableQuantity ?? 1) > 0): ProductPurchaseView {
  return {
    id: 'p1',
    name: 'Tạ tay',
    slug: 'ta-tay',
    imageUrl: null,
    productTypeCode: 'STANDARD',
    isBundle: false,
    variants: [{
      id: 'v1',
      sku: 'TA-5KG',
      name: '5kg',
      priceAmount: 450_000,
      priceLabel: '450.000 ₫',
      sellable: inStock !== false,
      inStock,
      availableQuantity,
      bundleComponents: [],
    }],
  };
}

const quantityInput = () => screen.getByRole('textbox', { name: 'Số lượng' }) as HTMLInputElement;

describe('ProductPurchasePanel stock limit', () => {
  it('shows "Chỉ còn N", stops the + button at availableQuantity and adds with the stock snapshot', () => {
    render(<ProductPurchasePanel product={product(3)} />);
    expect(screen.getByTestId('stock-label').textContent).toContain('Chỉ còn 3 sản phẩm');

    const plus = screen.getByRole('button', { name: 'Tăng số lượng' }) as HTMLButtonElement;
    fireEvent.click(plus);
    fireEvent.click(plus);
    expect(quantityInput().value).toBe('3');
    expect(plus.disabled).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ/ }));
    expect(addItem).toHaveBeenCalledWith(expect.objectContaining({ variantId: 'v1', quantity: 3, availableQuantity: 3 }));
  });

  it('clamps a typed quantity to the max with a light notice', () => {
    render(<ProductPurchasePanel product={product(4)} />);
    const input = quantityInput();
    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.blur(input);

    expect(quantityInput().value).toBe('4');
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ type: 'info', message: 'Chỉ còn 4 sản phẩm có thể đặt.' }));
  });

  it('warns when the cart already holds part of the remaining stock', () => {
    cartItems = [{ variantId: 'v1', quantity: 2 }];
    render(<ProductPurchasePanel product={product(3)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Tăng số lượng' }));
    fireEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ/ }));

    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Đã chạm số lượng còn lại' }));
  });

  it('disables add-to-cart and buy-now when out of stock', () => {
    render(<ProductPurchasePanel product={product(0, false)} />);
    const buttons = screen.getAllByRole('button', { name: /^(Tạm hết hàng|Mua ngay)$/ }) as HTMLButtonElement[];
    expect(buttons).toHaveLength(2);
    expect(buttons.every((button) => button.disabled)).toBe(true);
    expect(screen.queryByTestId('stock-label')).toBeNull();
  });
});
