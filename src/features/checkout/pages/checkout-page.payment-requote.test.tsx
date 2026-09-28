// @vitest-environment jsdom
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

// checkout-page.tsx (như phần lớn file trong repo) dựa vào automatic JSX runtime của Next và không tự
// `import React`; vitest.config.ts không có plugin react nên esbuild dùng classic transform, cần
// biến toàn cục `React`. Chỉ set cho phạm vi test này, không đổi source.
(globalThis as unknown as { React: typeof React }).React = React;

/**
 * Đổi phương thức thanh toán phải bỏ báo giá cũ và kích hoạt báo giá mới (gate cần `hasQuote` thật
 * của form hiện tại, không phải báo giá còn sót từ COD trước khi khách đổi sang VNPay).
 */

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/app/store/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      cart: {
        items: [{
          variantId: 'v1',
          sku: 'TEST-SKU-01',
          name: 'Sản phẩm kiểm thử',
          imageUrl: null,
          quantity: 1,
          price: 100000,
        }],
      },
    }),
}));

vi.mock('@/app/providers', () => ({
  useCartHydrated: () => true,
}));

vi.mock('@/features/auth', () => ({
  useCustomerAuth: () => ({ isAuthenticated: false, isLoaded: true }),
}));

vi.mock('@/shared/hooks', () => ({
  usePublicNumberParameter: () => 10,
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: undefined }),
}));

vi.mock('@/shared/components/address/vietnam-address-selector', () => ({
  VietnamAddressSelector: ({ onChange }: { onChange: (data: unknown) => void }) => (
    <button
      type="button"
      onClick={() =>
        onChange({
          provinceCode: '01',
          provinceName: 'Hà Nội',
          districtCode: '001',
          districtName: 'Ba Đình',
          wardCode: '00001',
          wardName: 'Phúc Xá',
          streetAddress: '123 Test',
          fullAddress: '123 Test, Phúc Xá, Ba Đình, Hà Nội',
        })
      }
    >
      chọn địa chỉ test
    </button>
  ),
}));

const prepareCheckout = vi.fn();
vi.mock('../api/checkout.workflow', async () => {
  const actual = await vi.importActual<typeof import('../api/checkout.workflow')>('../api/checkout.workflow');
  return {
    ...actual,
    prepareCheckout: (...args: unknown[]) => prepareCheckout(...args),
    reloadCheckout: vi.fn(),
    confirmCheckout: vi.fn(),
    placeOrder: vi.fn(),
  };
});

vi.mock('@/generated/api/customer/customer', () => ({
  listCustomerAddresses: vi.fn().mockResolvedValue([]),
}));
vi.mock('@/generated/api/payments/payments', () => ({
  getAccountPayment: vi.fn(),
  getGuestPayment: vi.fn(),
}));
vi.mock('@/features/orders/api/payment-request', () => ({ paymentRequest: vi.fn() }));
vi.mock('@/features/orders/model/guest-order-access.store', () => ({ readGuestOrderAccessToken: vi.fn() }));
vi.mock('@/shared/components/global-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));

// Header/footer thật kéo theo useGetCustomerProfile (react-query) và nhiều widget không liên quan
// đến báo giá; test này chỉ quan tâm form checkout nên bỏ qua layout thật.
vi.mock('@/layouts/storefront-layout', () => ({
  StorefrontLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { CheckoutPage } from './checkout-page';

function readyQuote() {
  return {
    checkoutToken: 'tok-1',
    status: 'QUOTED',
    branchName: 'Chi nhánh Hà Nội',
    shippingMethod: 'STANDARD_DELIVERY',
    itemSubtotal: '100000',
    shippingTotal: '0',
    grandTotal: '100000',
    etaMinDays: 1,
    etaMaxDays: 3,
    requiresShippingConsultation: false,
    shippingFeePending: false,
    expiresAt: new Date().toISOString(),
    items: [],
  };
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('CheckoutPage – đổi phương thức thanh toán phải báo giá lại', () => {
  it('đổi từ COD sang VNPay bỏ quote cũ và gọi prepareCheckout với paymentMethod mới', async () => {
    vi.useFakeTimers();
    prepareCheckout.mockResolvedValue({ quote: readyQuote(), context: { mode: 'GUEST', cartToken: 'ct-1' } });

    render(<CheckoutPage />);

    fireEvent.change(screen.getByPlaceholderText('Họ và tên người nhận'), { target: { value: 'Nguyễn Test' } });
    fireEvent.change(screen.getByPlaceholderText('Ví dụ: 0912345678'), { target: { value: '0912345678' } });
    fireEvent.click(screen.getByText('chọn địa chỉ test'));

    // Đủ debounce 700ms để lượt báo giá đầu (COD) chạy xong.
    await act(async () => {
      vi.advanceTimersByTime(800);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(prepareCheckout).toHaveBeenCalledTimes(1);
    expect(prepareCheckout.mock.calls[0][1]).toMatchObject({ paymentMethod: 'COD' });

    // Đổi sang VNPay: phải bỏ quote COD cũ (invalidateQuote) rồi báo giá lại.
    fireEvent.click(screen.getByRole('radio', { name: /Chuyển khoản VietQR \/ VNPay/ }));

    await act(async () => {
      vi.advanceTimersByTime(800);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(prepareCheckout).toHaveBeenCalledTimes(2);
    expect(prepareCheckout.mock.calls[1][1]).toMatchObject({ paymentMethod: 'VNPAY' });

    vi.useRealTimers();
  });
});
