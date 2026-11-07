// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { FreeShippingProgress } from './free-shipping-progress';

afterEach(cleanup);

const text = (value: string) => value.replace(/\s/g, ' ');

describe('FreeShippingProgress', () => {
  it('renders nothing when the threshold is disabled', () => {
    const { container } = render(<FreeShippingProgress subtotal={1_000_000} threshold={0} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows the threshold and how much more to buy', () => {
    render(<FreeShippingProgress subtotal={3_500_000} threshold={5_000_000} />);
    expect(text(screen.getByText(/Miễn phí giao hàng cho đơn từ/).textContent ?? '')).toContain('5.000.000');
    expect(text(screen.getByText(/Mua thêm/).textContent ?? '')).toMatch(/Mua thêm 1\.500\.000 ₫ để được miễn phí giao hàng/);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('70');
  });

  it('confirms free delivery once the threshold is reached', () => {
    render(<FreeShippingProgress subtotal={5_000_000} threshold={5_000_000} />);
    expect(screen.getByText('Đơn của bạn được miễn phí giao hàng')).toBeTruthy();
    expect(screen.queryByText(/Mua thêm/)).toBeNull();
  });
});
