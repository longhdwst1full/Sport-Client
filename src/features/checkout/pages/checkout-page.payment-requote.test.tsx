// @vitest-environment jsdom
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

// checkout-page.tsx (như phần lớn file trong repo) dựa vào automatic JSX runtime của Next và không tự
// `import React`; vitest.config.ts không có plugin react nên esbuild dùng classic transform, cần
// biến toàn cục `React`. Chỉ set cho phạm vi test này, không đổi source.
(globalThis as unknown as { React: typeof React }).React = React;

/**
 * Owner 2026-10-09: phí giao tính MỘT lần theo địa chỉ + giỏ. Đổi phương thức thanh toán hay bật/tắt
 * "Nhờ shop gửi" không gọi API báo giá; lựa chọn cuối đi kèm bước xác nhận (`confirmCheckout`).
 */

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/features/cart', () => ({
  useCartActions: () => ({ addItem: vi.fn(), removeItem: vi.fn(), updateQuantity: vi.fn(), clear: vi.fn() }),
  useCartItems: () => [{
    variantId: 'v1',
    sku: 'TEST-SKU-01',
    name: 'Sản phẩm kiểm thử',
    imageUrl: null,
    quantity: 1,
    price: 100000,
  }],
  useCartHydrated: () => true,
}));

vi.mock('@/features/auth', () => ({
  useCustomerAuth: () => ({ isAuthenticated: false, isLoaded: true }),
}));

vi.mock('@/features/site-config', () => ({
  usePublicNumberParameter: () => 10,
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: undefined }),
}));

// Giữ helper thuần thật (`EMPTY_SELECTED_ADDRESS`, `toSelectedAddressData`); chỉ giả query + selector.
vi.mock('@/features/address', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/address/model/selected-address')>()),
  useCustomerAddressList: () => ({ data: undefined }),
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
const confirmCheckout = vi.fn();
const placeOrder = vi.fn();
vi.mock('../api/checkout.workflow', async () => {
  const actual = await vi.importActual<typeof import('../api/checkout.workflow')>('../api/checkout.workflow');
  return {
    ...actual,
    prepareCheckout: (...args: unknown[]) => prepareCheckout(...args),
    reloadCheckout: vi.fn(),
    confirmCheckout: (...args: unknown[]) => confirmCheckout(...args),
    placeOrder: (...args: unknown[]) => placeOrder(...args),
  };
});
// Màn thành công dùng view model đơn thật; test chỉ cần biết đã tới bước này.
vi.mock('../components/checkout-success', () => ({ CheckoutSuccess: () => <p>đặt hàng xong</p> }));

vi.mock('@/generated/api/customer/customer', () => ({
  listCustomerAddresses: vi.fn().mockResolvedValue([]),
}));
vi.mock('@/generated/api/payments/payments', () => ({
  getAccountPayment: vi.fn(),
  getGuestPayment: vi.fn(),
}));
vi.mock('@/features/orders', () => ({
  paymentRequest: vi.fn(),
  readGuestOrderAccessToken: vi.fn(),
  toOrderDetailView: vi.fn(),
}));
vi.mock('@/shared/components/global-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));

// Header/footer thật kéo theo useGetCustomerProfile (react-query) và nhiều widget không liên quan
// đến báo giá; test này chỉ quan tâm form checkout nên bỏ qua layout thật.
vi.mock('@/layouts/storefront-layout', () => ({
  StorefrontLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { ApiError } from '@/lib/api/fetcher';
import { CheckoutPage } from './checkout-page';

function readyQuote(checkoutToken = 'tok-1') {
  return {
    checkoutToken,
    status: 'QUOTED',
    branchName: 'Chi nhánh Hà Nội',
    shippingMethod: 'THIRD_PARTY',
    itemSubtotal: '100000',
    shippingTotal: '30000',
    grandTotal: '130000',
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

async function flush(ms = 800) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

/** Điền đủ người nhận + địa chỉ rồi chờ hết debounce để lượt báo giá đầu chạy xong. */
async function renderQuoted() {
  render(<CheckoutPage />);
  fireEvent.change(screen.getByPlaceholderText('Họ và tên người nhận'), { target: { value: 'Nguyễn Test' } });
  fireEvent.change(screen.getByPlaceholderText('Ví dụ: 0912345678'), { target: { value: '0912345678' } });
  fireEvent.click(screen.getByText('chọn địa chỉ test'));
  await flush();
  expect(prepareCheckout).toHaveBeenCalledTimes(1);
}

async function submitOrder() {
  fireEvent.click(screen.getByRole('checkbox'));
  await act(async () => {
    fireEvent.submit(screen.getByRole('checkbox').closest('form')!);
  });
  await flush(0);
}

describe('CheckoutPage – phí giao tính một lần theo địa chỉ + giỏ', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    prepareCheckout.mockResolvedValue({ quote: readyQuote(), context: { mode: 'GUEST', cartToken: 'ct-1' } });
    confirmCheckout.mockResolvedValue({ id: '1', reservationToken: 'r-1', status: 'ACTIVE', expiresAt: '', items: [] });
    placeOrder.mockResolvedValue({ orderNo: 'ORD-1' });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('báo giá đầu là giao thường với phí hãng, kể cả khi đang chọn COD', async () => {
    await renderQuoted();

    expect(prepareCheckout.mock.calls[0][1]).toMatchObject({ paymentMethod: 'COD', shippingArrangement: 'STANDARD' });
    expect(screen.getAllByText(/30\.000/).length).toBeGreaterThan(0);
  });

  it('đổi COD ↔ VNPay không gọi lại API và giữ nguyên phí của lượt báo giá đầu', async () => {
    await renderQuoted();

    fireEvent.click(screen.getByRole('radio', { name: /Chuyển khoản VietQR \/ VNPay/ }));
    await flush();
    fireEvent.click(screen.getByRole('radio', { name: /Thanh toán khi nhận hàng/ }));
    await flush();

    expect(prepareCheckout).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/Đang tính phí/)).toBeNull();
    expect(screen.queryByText('Đang cập nhật')).toBeNull();
    expect(screen.getAllByText(/130\.000/).length).toBeGreaterThan(0);
  });

  it('bật/tắt "Nhờ shop gửi" chỉ tính ở client: phí chờ shop báo, tổng = tiền hàng, tắt lại hiện phí cũ', async () => {
    await renderQuoted();

    fireEvent.click(screen.getByRole('radio', { name: /Nhờ shop tư vấn/ }));
    await flush();
    expect(screen.getByText('Shop báo riêng')).toBeTruthy();
    expect(screen.queryByText(/130\.000/)).toBeNull();

    fireEvent.click(screen.getByRole('radio', { name: /Giao hàng tiêu chuẩn/ }));
    await flush();
    expect(screen.queryByText('Shop báo riêng')).toBeNull();
    expect(screen.getAllByText(/130\.000/).length).toBeGreaterThan(0);

    expect(prepareCheckout).toHaveBeenCalledTimes(1);
  });

  it('gửi lựa chọn cuối (thanh toán + cách giao) kèm bước xác nhận', async () => {
    await renderQuoted();
    fireEvent.click(screen.getByRole('radio', { name: /Chuyển khoản VietQR \/ VNPay/ }));
    fireEvent.click(screen.getByRole('radio', { name: /Nhờ shop tư vấn/ }));

    await submitOrder();

    expect(prepareCheckout).toHaveBeenCalledTimes(1);
    expect(confirmCheckout).toHaveBeenCalledTimes(1);
    expect(confirmCheckout.mock.calls[0][1]).toBe('tok-1');
    expect(confirmCheckout.mock.calls[0][3]).toEqual({ paymentMethod: 'VNPAY', shippingArrangement: 'SHOP_ARRANGED' });
    expect(placeOrder.mock.calls[0][1]).toBe('tok-1');
  });

  it('CHECKOUT_REQUOTE_REQUIRED: báo giá lại một lần rồi xác nhận phiên mới với key mới', async () => {
    await renderQuoted();
    prepareCheckout.mockResolvedValueOnce({ quote: readyQuote('tok-2'), context: { mode: 'GUEST', cartToken: 'ct-1' } });
    confirmCheckout.mockRejectedValueOnce(new ApiError(409, { code: 'CHECKOUT_REQUOTE_REQUIRED', message: 'x' }));

    await submitOrder();

    expect(prepareCheckout).toHaveBeenCalledTimes(2);
    expect(confirmCheckout).toHaveBeenCalledTimes(2);
    expect(confirmCheckout.mock.calls[1][1]).toBe('tok-2');
    expect(confirmCheckout.mock.calls[1][2]).not.toBe(confirmCheckout.mock.calls[0][2]);
    expect(placeOrder.mock.calls[0][1]).toBe('tok-2');
  });
});
