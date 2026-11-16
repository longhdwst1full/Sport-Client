// @vitest-environment jsdom
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

(globalThis as unknown as { React: typeof React }).React = React;

// Mô phỏng Next: `useSearchParams` đọc URL hiện tại, nên sau `replaceState` token biến mất khỏi hook.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(window.location.search),
}));
const mutate = vi.fn();
vi.mock('@/generated/api/auth/auth', () => ({
  useResetCustomerPassword: () => ({ mutate, isPending: false, error: null }),
}));

import { ResetPasswordPage } from './reset-password-page';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.history.replaceState(null, '', '/');
});

describe('ResetPasswordPage', () => {
  it('xoá ?token= khỏi thanh địa chỉ nhưng vẫn gửi đúng token khi đặt lại', () => {
    window.history.replaceState(null, '', '/reset-password?token=secret-token');
    const view = render(<ResetPasswordPage />);

    expect(window.location.search).toBe('');
    expect(window.location.pathname).toBe('/reset-password');
    view.rerender(<ResetPasswordPage />); // render lại sau khi URL đã mất token

    fireEvent.change(screen.getByLabelText('Mật khẩu mới'), { target: { value: 'Matkhau@123' } });
    fireEvent.change(screen.getByLabelText(/Nhập lại|Xác nhận/), { target: { value: 'Matkhau@123' } });
    fireEvent.submit(screen.getByRole('heading', { name: 'Đặt mật khẩu mới' }).closest('form')!);

    expect(mutate).toHaveBeenCalledWith({ data: { token: 'secret-token', newPassword: 'Matkhau@123' } });
  });
});
