import {
  createGuestCart,
  getAccountCart,
  getGuestCart,
  removeAccountCartItem,
  removeGuestCartItem,
  setAccountCartItem,
  setGuestCartItem,
} from '@/generated/api/cart/cart';
import type { CartDto } from '@/generated/api/cart/models';
import type { CartItem } from '@/app/store/cart.slice';
import { ApiError } from '@/lib/api/fetcher';
import { clearGuestCartToken, readGuestCartToken, saveGuestCartToken } from '../model/guest-cart-token.store';
import { mergeGuestCartAfterAuth } from './merge-guest-cart';

/**
 * Đồng bộ giỏ hàng giữa các thiết bị (quyết định chủ dự án 2026-09-25):
 *
 * - Chưa đăng nhập: giỏ chỉ nằm trên máy (Redux + localStorage), máy khác không thấy.
 * - Vừa đăng nhập: đẩy giỏ trên máy lên → server gộp vào giỏ tài khoản (cùng SKU lấy số lớn hơn)
 *   → tải giỏ tài khoản về thay giỏ trên máy. Máy khác đăng nhập sẽ thấy cùng giỏ.
 * - Đang đăng nhập: mỗi thay đổi ghi lên giỏ tài khoản; mở app thì tải giỏ tài khoản về.
 * - Đăng xuất / đổi tài khoản: xoá giỏ trên máy; giỏ vẫn còn trong tài khoản.
 */
export type CartLine = { variantId: string; quantity: number };

const guestHeaders = (cartToken: string) => ({ headers: { 'x-cart-token': cartToken } });

export function toCartLines(items: CartItem[]): CartLine[] {
  return items.map(({ variantId, quantity }) => ({ variantId, quantity }));
}

/** Dựng giỏ local từ giỏ tài khoản; giá chỉ là preview, checkout luôn đọc lại giá server. */
export function toLocalCartItems(cart: CartDto): CartItem[] {
  return cart.items.map((item) => ({
    productId: item.productId,
    variantId: item.productVariantId,
    sku: item.sku,
    productType: item.productType,
    name: item.name === item.productName ? item.productName : `${item.productName} — ${item.name}`,
    imageUrl: item.imageUrl ?? undefined,
    price: Number(item.unitPricePreview ?? 0),
    quantity: item.quantity,
  }));
}

async function getOrCreateGuestCart(): Promise<{ cart: CartDto; cartToken: string }> {
  const savedToken = readGuestCartToken();
  if (savedToken) {
    try {
      return { cart: await getGuestCart(guestHeaders(savedToken)), cartToken: savedToken };
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 404) throw error;
      clearGuestCartToken();
    }
  }
  const created = await createGuestCart();
  if (!created.cartToken) throw new Error('API did not return a guest cart token');
  saveGuestCartToken(created.cartToken);
  return { cart: created, cartToken: created.cartToken };
}

type LineWriteMode = 'strict' | 'lenient';

/**
 * Dòng giỏ trên máy trỏ tới SKU server không còn bán (404/422) — ví dụ sau khi catalog được seed
 * lại, localStorage vẫn giữ ID biến thể cũ. Nơi gọi bỏ các dòng này khỏi giỏ local và báo khách,
 * thay vì để một dòng hỏng chặn cả checkout.
 */
export class UnavailableCartLinesError extends Error {
  constructor(readonly variantIds: string[]) {
    super('Một số sản phẩm trong giỏ không còn bán và đã được bỏ khỏi giỏ.');
    this.name = 'UnavailableCartLinesError';
  }
}

const isUnavailableLine = (error: unknown) =>
  error instanceof ApiError && (error.status === 404 || error.status === 422);

/**
 * Đưa giỏ server về đúng các dòng local: xoá dòng thừa, ghi dòng thiếu/khác số lượng (bỏ qua dòng
 * đã khớp để đỡ request). `lenient` bỏ qua dòng không còn bán được thay vì ném lỗi — dùng khi đăng
 * nhập/đồng bộ nền, để một món ngừng bán không làm hỏng cả giỏ.
 */
async function reconcile(
  cart: CartDto,
  lines: CartLine[],
  write: {
    remove: (itemId: string, version: number) => Promise<CartDto>;
    set: (line: CartLine, version: number) => Promise<CartDto>;
  },
  mode: LineWriteMode,
): Promise<CartDto> {
  let current = cart;
  const unavailable: string[] = [];
  const desired = new Map(lines.map((line) => [line.variantId, line.quantity]));
  for (const item of current.items.filter(({ productVariantId }) => !desired.has(productVariantId))) {
    current = await write.remove(item.id, current.version);
  }
  for (const line of lines) {
    const existing = current.items.find(({ productVariantId }) => productVariantId === line.variantId);
    if (existing?.quantity === line.quantity) continue;
    try {
      current = await write.set(line, current.version);
    } catch (error) {
      if (isUnavailableLine(error)) unavailable.push(line.variantId);
      else if (mode === 'strict') throw error;
    }
  }
  if (mode === 'strict' && unavailable.length > 0) throw new UnavailableCartLinesError(unavailable);
  return current;
}

export async function syncGuestCart(lines: CartLine[], mode: LineWriteMode = 'strict'): Promise<{ cartToken: string }> {
  const state = await getOrCreateGuestCart();
  await reconcile(state.cart, lines, {
    remove: (itemId, version) => removeGuestCartItem(itemId, { expectedCartVersion: version }, guestHeaders(state.cartToken)),
    set: (line, version) =>
      setGuestCartItem({ productVariantId: line.variantId, quantity: line.quantity, expectedCartVersion: version }, guestHeaders(state.cartToken)),
  }, mode);
  return { cartToken: state.cartToken };
}

export async function syncAccountCart(lines: CartLine[], mode: LineWriteMode = 'strict'): Promise<CartDto> {
  const write = {
    remove: (itemId: string, version: number) => removeAccountCartItem(itemId, { expectedCartVersion: version }),
    set: (line: CartLine, version: number) =>
      setAccountCartItem({ productVariantId: line.variantId, quantity: line.quantity, expectedCartVersion: version }),
  };
  try {
    return await reconcile(await getAccountCart(), lines, write, mode);
  } catch (error) {
    // Máy khác vừa sửa giỏ (lệch version): đọc lại và áp một lần nữa; lần này local vẫn thắng.
    if (!(error instanceof ApiError) || error.status !== 409) throw error;
    return reconcile(await getAccountCart(), lines, write, mode);
  }
}

export async function pullAccountCart(): Promise<CartItem[]> {
  return toLocalCartItems(await getAccountCart());
}

/**
 * Gọi ngay sau khi đăng nhập/đăng ký: đẩy giỏ trên máy lên giỏ khách của server, để server gộp vào
 * giỏ tài khoản trong một transaction có khoá (không mất/không nhân đôi dòng), rồi trả giỏ tài khoản
 * để thay giỏ trên máy. Lỗi không được chặn đăng nhập: trả `undefined` và giữ nguyên giỏ trên máy.
 */
export async function syncCartAfterAuth(localItems: CartItem[]): Promise<CartItem[] | undefined> {
  try {
    if (localItems.length > 0) await syncGuestCart(toCartLines(localItems), 'lenient');
    await mergeGuestCartAfterAuth();
    return await pullAccountCart();
  } catch {
    return undefined;
  }
}
