// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CheckoutPolicyDialog } from './checkout-policy-dialog';

afterEach(cleanup);

function setup(content: React.ReactNode, alreadyAccepted = false) {
  const onAgree = vi.fn();
  const onClose = vi.fn();
  render(
    <CheckoutPolicyDialog
      content={content}
      agreeLabel="Đồng ý & đặt hàng"
      alreadyAccepted={alreadyAccepted}
      onAgree={onAgree}
      onClose={onClose}
    />,
  );
  return { onAgree, onClose };
}

describe('CheckoutPolicyDialog', () => {
  it('nội dung đang tải: chưa cho đóng, chưa cho đồng ý', () => {
    const { onClose } = setup(<div aria-busy="true">Đang tải</div>);
    expect(screen.getByRole('button', { name: /Cuộn xuống cuối/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Đóng' })).toBeNull();
    expect(screen.queryByRole('button', { name: /Đồng ý/ })).toBeNull();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('nội dung đã hiện hết (không còn gì để cuộn): bấm Đồng ý gọi onAgree', () => {
    const { onAgree } = setup(<p>Điều khoản</p>);
    fireEvent.click(screen.getByRole('button', { name: /Đồng ý & đặt hàng/ }));
    expect(onAgree).toHaveBeenCalledTimes(1);
  });

  it('đã tích đồng ý từ trước: đóng được ngay', () => {
    const { onClose } = setup(<div aria-busy="true">Đang tải</div>, true);
    fireEvent.click(screen.getAllByRole('button', { name: 'Đóng' })[0]);
    expect(onClose).toHaveBeenCalled();
  });
});
