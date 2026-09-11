import {
  createGuestCart,
  getAccountCart,
  getGuestCart,
  removeAccountCartItem,
  removeGuestCartItem,
  setAccountCartItem,
  setGuestCartItem,
} from '@/generated/api/cart/cart';
import {
  confirmAccountCheckout,
  confirmGuestCheckout,
  getAccountCheckoutQuote,
  getGuestCheckoutQuote,
  quoteAccountCheckout,
  quoteGuestCheckout,
} from '@/generated/api/checkout/checkout';
import type { CartDto } from '@/generated/api/cart/models';
import type { CheckoutQuoteDto, CreateCheckoutQuoteDto, ReservationDto } from '@/generated/api/checkout/models';
import { placeAccountOrder, placeGuestOrder } from '@/generated/api/orders/orders';
import type { OrderDetailDto } from '@/generated/api/orders/models';
import { ApiError } from '@/lib/api/fetcher';

const GUEST_CART_TOKEN_KEY = 'dctd-storefront-guest-cart-token-v1';

export type CheckoutLine = { variantId: string; quantity: number };
export type CheckoutContext = { mode: 'ACCOUNT' } | { mode: 'GUEST'; cartToken: string };

function guestHeaders(cartToken: string, idempotencyKey?: string) {
  return {
    headers: {
      'x-cart-token': cartToken,
      ...(idempotencyKey ? { 'idempotency-key': idempotencyKey } : {}),
    },
  };
}

async function getOrCreateGuestCart(): Promise<{ cart: CartDto; cartToken: string }> {
  const savedToken = localStorage.getItem(GUEST_CART_TOKEN_KEY);
  if (savedToken) {
    try {
      return { cart: await getGuestCart(guestHeaders(savedToken)), cartToken: savedToken };
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 404) throw error;
      localStorage.removeItem(GUEST_CART_TOKEN_KEY);
    }
  }
  const created = await createGuestCart();
  if (!created.cartToken) throw new Error('API did not return a guest cart token');
  localStorage.setItem(GUEST_CART_TOKEN_KEY, created.cartToken);
  return { cart: created, cartToken: created.cartToken };
}

async function syncGuestCart(lines: CheckoutLine[]) {
  const state = await getOrCreateGuestCart();
  let cart: CartDto = state.cart;
  const desiredIds = new Set(lines.map(({ variantId }) => variantId));
  for (const item of cart.items.filter(({ productVariantId }) => !desiredIds.has(productVariantId))) {
    cart = await removeGuestCartItem(item.id, { expectedCartVersion: cart.version }, guestHeaders(state.cartToken));
  }
  for (const line of lines) {
    cart = await setGuestCartItem({
      productVariantId: line.variantId,
      quantity: line.quantity,
      expectedCartVersion: cart.version,
    }, guestHeaders(state.cartToken));
  }
  return { cartToken: state.cartToken };
}

async function syncAccountCart(lines: CheckoutLine[]) {
  let cart = await getAccountCart();
  const desiredIds = new Set(lines.map(({ variantId }) => variantId));
  for (const item of cart.items.filter(({ productVariantId }) => !desiredIds.has(productVariantId))) {
    cart = await removeAccountCartItem(item.id, { expectedCartVersion: cart.version });
  }
  for (const line of lines) {
    cart = await setAccountCartItem({
      productVariantId: line.variantId,
      quantity: line.quantity,
      expectedCartVersion: cart.version,
    });
  }
}

export async function prepareCheckout(
  lines: CheckoutLine[],
  input: CreateCheckoutQuoteDto,
  authenticated: boolean,
  idempotencyKey: string,
): Promise<{ quote: CheckoutQuoteDto; context: CheckoutContext }> {
  if (authenticated) {
    await syncAccountCart(lines);
    return {
      quote: await quoteAccountCheckout(input, { headers: { 'idempotency-key': idempotencyKey } }),
      context: { mode: 'ACCOUNT' },
    };
  }
  const { cartToken } = await syncGuestCart(lines);
  return {
    quote: await quoteGuestCheckout(input, guestHeaders(cartToken, idempotencyKey)),
    context: { mode: 'GUEST', cartToken },
  };
}

export async function confirmCheckout(
  context: CheckoutContext,
  checkoutToken: string,
  idempotencyKey: string,
): Promise<ReservationDto> {
  if (context.mode === 'ACCOUNT') {
    return confirmAccountCheckout(checkoutToken, { headers: { 'idempotency-key': idempotencyKey } });
  }
  return confirmGuestCheckout(checkoutToken, guestHeaders(context.cartToken, idempotencyKey));
}

export async function placeOrder(
  context: CheckoutContext,
  checkoutToken: string,
  idempotencyKey: string,
): Promise<OrderDetailDto> {
  if (context.mode === 'ACCOUNT') {
    return placeAccountOrder(checkoutToken, { headers: { 'idempotency-key': idempotencyKey } });
  }
  return placeGuestOrder(checkoutToken, guestHeaders(context.cartToken, idempotencyKey));
}

export async function reloadCheckout(
  context: CheckoutContext,
  checkoutToken: string,
): Promise<CheckoutQuoteDto> {
  if (context.mode === 'ACCOUNT') {
    return getAccountCheckoutQuote(checkoutToken);
  }
  return getGuestCheckoutQuote(checkoutToken, guestHeaders(context.cartToken));
}
