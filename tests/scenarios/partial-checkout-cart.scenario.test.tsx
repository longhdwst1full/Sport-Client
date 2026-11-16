// @vitest-environment jsdom
/**
 * Kịch bản hồi quy: khách ĐÃ ĐĂNG NHẬP thanh toán một phần giỏ (mua ngay / chọn một phần).
 *
 * Chạy code thật của checkout (`prepareCheckout`, `placeOrder`), giỏ (slice + saga persist + cart-sync) và
 * `Providers` (logic khởi động giỏ khi mở app). Chỉ thay backend bằng một giỏ tài khoản giả trong bộ nhớ, mô
 * phỏng đúng hành vi đã kiểm ở API: báo giá đọc cả giỏ server, đặt đơn chuyển giỏ sang CONVERTED (giỏ mới rỗng).
 *
 * Nằm ngoài `src/` vì nó đi xuyên nhiều tầng (app + checkout + cart) để tái hiện hành trình của khách.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import type { CartDto, CartItemDto } from '@/generated/api/cart/cart.schemas';
import type { CreateCheckoutQuoteDto } from '@/generated/api/checkout/checkout.schemas';

// ---- Giỏ tài khoản giả phía server ----
const server = vi.hoisted(() => ({ version: 1, items: [] as Array<{ variantId: string; quantity: number }> }));

function serverItem(variantId: string, quantity: number): CartItemDto {
  return {
    id: `item-${variantId}`,
    productVariantId: variantId,
    productId: `product-${variantId}`,
    productType: 'STANDARD',
    sku: `SKU-${variantId}`,
    name: `Món ${variantId}`,
    productName: `Món ${variantId}`,
    productSlug: `mon-${variantId}`,
    quantity,
    availableQuantity: 10,
    unitPricePreview: '100000.00',
    lineTotalPreview: null,
    imageUrl: null,
  };
}
function serverCart(): CartDto {
  return {
    id: '1', status: 'ACTIVE', currencyCode: 'VND', version: server.version, subtotalPreview: '0.00', expiresAt: null,
    items: server.items.map((line) => serverItem(line.variantId, line.quantity)),
  };
}
const write = <T,>(mutate: () => T) => { mutate(); server.version += 1; return Promise.resolve(serverCart()); };

vi.mock('@/generated/api/cart/cart', () => ({
  getAccountCart: async () => serverCart(),
  setAccountCartItem: async ({ productVariantId, quantity }: { productVariantId: string; quantity: number }) =>
    write(() => server.items.push({ variantId: productVariantId, quantity })),
  updateAccountCartItem: async (itemId: string, { quantity }: { quantity: number }) =>
    write(() => { server.items.find((line) => `item-${line.variantId}` === itemId)!.quantity = quantity; }),
  removeAccountCartItem: async (itemId: string) =>
    write(() => { server.items = server.items.filter((line) => `item-${line.variantId}` !== itemId); }),
  getGuestCart: vi.fn(), createGuestCart: vi.fn(), setGuestCartItem: vi.fn(),
  updateGuestCartItem: vi.fn(), removeGuestCartItem: vi.fn(), mergeGuestCartIntoAccount: vi.fn(),
}));
vi.mock('@/generated/api/checkout/checkout', () => ({
  quoteAccountCheckout: async () => ({ checkoutToken: 'tok-1' }),
  quoteGuestCheckout: vi.fn(), confirmAccountCheckout: vi.fn(), confirmGuestCheckout: vi.fn(),
  getAccountCheckoutQuote: vi.fn(), getGuestCheckoutQuote: vi.fn(),
  releaseAccountReservation: vi.fn(), releaseGuestReservation: vi.fn(),
}));
vi.mock('@/generated/api/orders/orders', () => ({
  // API: đặt đơn chuyển giỏ hiện tại sang CONVERTED; lần đọc sau là một giỏ ACTIVE mới, rỗng.
  placeAccountOrder: async () => { server.items = []; server.version += 1; return { orderNo: 'DH001' }; },
  placeGuestOrder: vi.fn(),
}));

// ---- Phiên đăng nhập + phần phụ của Providers không liên quan giỏ ----
const auth = vi.hoisted(() => ({ on: true }));
vi.mock('@/core/auth/customer-auth-token.store', () => ({
  isCustomerAuthenticated: () => auth.on,
  hasCustomerRefreshCredential: () => false,
  readCustomerAuthTokens: () => undefined,
  saveCustomerAuthTokens: () => undefined,
  clearCustomerAuthTokens: () => undefined,
  usesCustomerAuthCookieTransport: () => true,
}));
vi.mock('@/features/auth', () => ({ readCustomerAuthTokens: () => undefined }));
vi.mock('@/features/orders', () => ({ saveGuestOrderAccessToken: () => true }));
vi.mock('@/pwa/session-caches', () => ({ clearSessionPwaCaches: async () => undefined }));
vi.mock('next/dynamic', () => ({ default: () => () => null }));

import { Providers } from '@/app/providers';
import { storefrontStore } from '@/app/store/store';
import { hydrateCart, removeCartItem, resetCartForSignOut } from '@/features/cart';
import { placeOrder, prepareCheckout } from '@/features/checkout/api/checkout.workflow';

const RECIPIENT = { paymentMethod: 'COD' } as unknown as CreateCheckoutQuoteDto;
const localItem = (variantId: string, quantity = 1) => ({
  productId: `product-${variantId}`, variantId, sku: `SKU-${variantId}`, productType: 'STANDARD' as const,
  name: `Món ${variantId}`, price: 100000, quantity,
});
const deviceCart = () => storefrontStore.getState().cart.items.map((item) => item.variantId).sort();
const serverCartIds = () => server.items.map((line) => line.variantId).sort();
/** Mở (lại) app: mount `Providers` — chạy đúng logic khởi động giỏ của ứng dụng. */
const openApp = () => render(<Providers><div /></Providers>);

/** Khách đăng nhập có 3 món A, B, C; giỏ máy và giỏ server khớp nhau. */
function customerHasThreeItems() {
  server.items = [{ variantId: 'A', quantity: 1 }, { variantId: 'B', quantity: 2 }, { variantId: 'C', quantity: 1 }];
  storefrontStore.dispatch(hydrateCart([localItem('A'), localItem('B', 2), localItem('C')]));
}

describe('Kịch bản: khách đăng nhập thanh toán một phần giỏ', () => {
  beforeEach(() => {
    window.localStorage.clear();
    auth.on = true;
    server.version = 1;
    server.items = [];
    storefrontStore.dispatch(resetCartForSignOut());
  });
  afterEach(() => cleanup());

  it('KB1 — "Mua ngay" A rồi bỏ ngang, mở lại app: giỏ vẫn đủ A, B, C (máy và server)', async () => {
    customerHasThreeItems();

    await prepareCheckout([{ variantId: 'A', quantity: 1 }], RECIPIENT, true, 'key-1');
    // Báo giá buộc phải cắt giỏ server còn A (đúng ở cả code cũ và mới).
    expect(serverCartIds()).toEqual(['A']);

    openApp();

    await waitFor(() => expect(deviceCart()).toEqual(['A', 'B', 'C']));
    await waitFor(() => expect(serverCartIds()).toEqual(['A', 'B', 'C']));
  });

  it('KB2 — "Mua ngay" A trả bằng VNPay (trang chuyển ngay), quay về: B, C còn nguyên', async () => {
    customerHasThreeItems();

    await prepareCheckout([{ variantId: 'A', quantity: 1 }], RECIPIENT, true, 'key-1');
    await placeOrder({ mode: 'ACCOUNT' }, 'tok-1', 'key-2');
    expect(serverCartIds()).toEqual([]); // giỏ đã CONVERTED

    vi.useFakeTimers();
    storefrontStore.dispatch(removeCartItem('A')); // xoá món đã mua khỏi giỏ máy (như use-place-order)
    // window.location.assign(VNPay): trang bị huỷ, mọi timer đang chờ (lệnh ghi giỏ debounce 400ms) mất theo.
    vi.clearAllTimers();
    vi.useRealTimers();

    openApp(); // khách quay về từ VNPay

    await waitFor(() => expect(deviceCart()).toEqual(['B', 'C']));
    await waitFor(() => expect(serverCartIds()).toEqual(['B', 'C']));
  });

  it('KB3 — đăng xuất giữa chừng rồi người khác đăng nhập trên cùng máy: giỏ của người đó không bị xoá', async () => {
    customerHasThreeItems();
    const first = openApp();
    await waitFor(() => expect(deviceCart()).toEqual(['A', 'B', 'C']));

    await prepareCheckout([{ variantId: 'A', quantity: 1 }], RECIPIENT, true, 'key-1');
    auth.on = false;
    window.dispatchEvent(new Event('dctd:auth-change')); // đăng xuất
    await waitFor(() => expect(deviceCart()).toEqual([]));
    first.unmount();

    // Người B đăng nhập; giỏ tài khoản B có X.
    server.items = [{ variantId: 'X', quantity: 3 }];
    auth.on = true;
    openApp();

    await waitFor(() => expect(deviceCart()).toEqual(['X']));
    expect(serverCartIds()).toEqual(['X']);
  });

  it('KB4 — không checkout một phần: mở app vẫn tải giỏ server (thấy món thêm từ máy khác)', async () => {
    customerHasThreeItems();
    await prepareCheckout(
      [{ variantId: 'A', quantity: 1 }, { variantId: 'B', quantity: 2 }, { variantId: 'C', quantity: 1 }],
      RECIPIENT, true, 'key-1',
    );
    server.items.push({ variantId: 'D', quantity: 1 }); // máy khác thêm D

    openApp();

    await waitFor(() => expect(deviceCart()).toEqual(['A', 'B', 'C', 'D']));
    expect(serverCartIds()).toEqual(['A', 'B', 'C', 'D']);
  });
});
