// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CatalogRouteSkeleton, ProductDetailRouteSkeleton } from './catalog-route-skeleton';

describe('Catalog route fallbacks', () => {
  afterEach(cleanup);
  it.each([false, true])('announces loading and mirrors responsive grid, category=%s', (category) => {
    const { container } = render(<CatalogRouteSkeleton category={category} />);
    expect(screen.getByRole('status').textContent).toBe(category ? 'Đang tải danh mục' : 'Đang tải sản phẩm');
    expect(screen.getByRole('main').getAttribute('aria-busy')).toBe('true');
    expect(container.querySelectorAll('.aspect-square')).toHaveLength(12);
    expect(container.querySelector('header')).toBeNull();
  });
  it('uses a detail fallback instead of inheriting the product list', () => {
    render(<ProductDetailRouteSkeleton />);
    expect(screen.getByRole('status').textContent).toBe('Đang tải chi tiết sản phẩm');
  });
});
