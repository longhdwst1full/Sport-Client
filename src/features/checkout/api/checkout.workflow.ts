import {
  confirmAccountCheckout,
  confirmGuestCheckout,
  getAccountCheckoutQuote,
  getGuestCheckoutQuote,
  quoteAccountCheckout,
  quoteGuestCheckout,
} from '@/generated/api/checkout/checkout';
import type { CheckoutQuoteDto, CreateCheckoutQuoteDto, ReservationDto } from '@/generated/api/checkout/models';
import { placeAccountOrder, placeGuestOrder } from '@/generated/api/orders/orders';
import type { OrderDetailDto } from '@/generated/api/orders/models';
import { syncAccountCart, syncGuestCart } from '@/features/cart';
import { saveGuestOrderAccessToken } from '@/features/orders';

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
): Promise<OrderDetailDto & { guestAccessPersisted?: boolean }> {
  if (context.mode === 'ACCOUNT') {
    return placeAccountOrder(checkoutToken, { headers: { 'idempotency-key': idempotencyKey } });
  }
  const order = await placeGuestOrder(checkoutToken, guestHeaders(context.cartToken, idempotencyKey));
  return {
    ...order,
    guestAccessPersisted: saveGuestOrderAccessToken(order.orderNo, order.guestAccessToken),
  };
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
