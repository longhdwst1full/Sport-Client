// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GlobalToastProvider, useToast } from './global-toast';

function Sender() {
  const toast = useToast();
  return <><button onClick={() => toast.success('Đã thêm', 'Một sản phẩm')}>Thành công</button><button onClick={() => toast.error('Không thể đặt hàng', 'Thử lại')}>Lỗi</button></>;
}
describe('Persistent toast live regions', () => {
  afterEach(() => { cleanup(); vi.useRealTimers(); });
  it('mounts empty regions before content, routes errors separately and excludes dismiss controls', () => {
    vi.useFakeTimers();
    render(<GlobalToastProvider><Sender /></GlobalToastProvider>);
    const status = screen.getByRole('status');
    const alert = screen.getByRole('alert');
    expect(status.textContent).toBe('');
    expect(alert.textContent).toBe('');
    fireEvent.click(screen.getByRole('button', { name: 'Thành công' }));
    expect(status.textContent).toBe('Đã thêm. Một sản phẩm');
    expect(within(status).queryByRole('button')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Lỗi' }));
    expect(alert.textContent).toBe('Không thể đặt hàng. Thử lại');
    expect(status.textContent).not.toContain('Không thể đặt hàng');
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });
});
