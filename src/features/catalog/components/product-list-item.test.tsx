// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ProductShowcaseItem } from '../model/product.mapper';
import { CatalogViewSwitcher } from './catalog/catalog-view-switcher';
import { ProductListItem } from './product-list-item';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock('../hooks/use-variant-flash-prices', () => ({
  useLiveVariantFlashPrices: () => null,
  activeFlashPrice: () => undefined,
}));

const product: ProductShowcaseItem = {
  id: 'p1',
  defaultVariantId: 'v1',
  defaultVariantSku: 'SKU1',
  slug: 'may-chay-bo',
  productType: 'STANDARD',
  name: 'Máy chạy bộ X1',
  brand: 'Kingsport',
  category: 'Cardio',
  badge: 'Cardio',
  imageUrl: '/a.jpg',
  numericPrice: 5000000,
  displayPrice: '5.000.000 ₫',
  hasPrice: true,
  isSellable: true,
  inStock: true,
  shortDescription: 'Máy chạy êm, gập gọn.',
};

afterEach(cleanup);

describe('ProductListItem', () => {
  it('hiện tên, giá, mô tả, tồn kho và không bịa đánh giá/đã bán', () => {
    const { container } = render(<ProductListItem product={product} onBuyNow={vi.fn()} onAddToCart={vi.fn()} />);
    expect(screen.getByRole('link', { name: 'Máy chạy bộ X1' }).getAttribute('href')).toBe('/products/may-chay-bo');
    expect(screen.getByText('5.000.000 ₫')).toBeTruthy();
    expect(screen.getByText('Kingsport · Cardio')).toBeTruthy();
    expect(screen.getByText('Máy chạy êm, gập gọn.')).toBeTruthy();
    expect(screen.getByText('Còn hàng')).toBeTruthy();
    expect(container.textContent).not.toMatch(/đã bán|đánh giá|★/i);
  });

  it('nút mua gọi handler; hết hàng thì khoá', () => {
    const onBuyNow = vi.fn();
    const { rerender } = render(<ProductListItem product={product} onBuyNow={onBuyNow} />);
    fireEvent.click(screen.getByRole('button', { name: 'Mua ngay Máy chạy bộ X1' }));
    expect(onBuyNow).toHaveBeenCalledTimes(1);
    rerender(<ProductListItem product={{ ...product, inStock: false, isSellable: false }} onBuyNow={onBuyNow} />);
    expect((screen.getByRole('button', { name: 'Mua ngay Máy chạy bộ X1' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('CatalogViewSwitcher', () => {
  it('aria-pressed theo chế độ hiện tại và gọi onChange', () => {
    const onChange = vi.fn();
    render(<CatalogViewSwitcher value="grid" onChange={onChange} />);
    const grid = screen.getByRole('button', { name: 'Dạng lưới' });
    const list = screen.getByRole('button', { name: 'Dạng danh sách' });
    expect(grid.getAttribute('aria-pressed')).toBe('true');
    expect(list.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(list);
    expect(onChange).toHaveBeenCalledWith('list');
  });
});
