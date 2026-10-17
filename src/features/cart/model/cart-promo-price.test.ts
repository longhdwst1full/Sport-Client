import { describe, expect, it } from 'vitest';
import { resolveCartLinePrice } from './cart-promo-price';

const NOW = 1_000;
const promos = { v1: { price: 80, regularPrice: 100, maxQuantity: 2, endsAtMs: NOW + 1 } };

describe('resolveCartLinePrice', () => {
  it('trong số suất → cả dòng giá flash', () => {
    expect(resolveCartLinePrice({ variantId: 'v1', price: 80, quantity: 2 }, promos, NOW)).toMatchObject({
      lineTotal: 160,
      promo: 'applied',
      flashQuantity: 2,
      regularQuantity: 0,
    });
  });

  it('còn 2 suất, mua 4 → 2 giá flash + 2 giá thường (khớp checkout tách dòng)', () => {
    expect(resolveCartLinePrice({ variantId: 'v1', price: 80, quantity: 4 }, promos, NOW)).toEqual({
      lineTotal: 2 * 80 + 2 * 100,
      promo: 'split',
      flashQuantity: 2,
      flashUnitPrice: 80,
      regularQuantity: 2,
      regularUnitPrice: 100,
    });
  });

  it('hết suất → giá thường; hết giờ hoặc chưa có dữ liệu → giữ ảnh chụp', () => {
    const soldOut = { v1: { ...promos.v1, maxQuantity: 0 } };
    expect(resolveCartLinePrice({ variantId: 'v1', price: 80, quantity: 1 }, soldOut, NOW)).toMatchObject({ lineTotal: 100, promo: 'soldOut' });
    expect(resolveCartLinePrice({ variantId: 'v1', price: 80, quantity: 4 }, promos, NOW + 5).lineTotal).toBe(320);
    expect(resolveCartLinePrice({ variantId: 'v1', price: 80, quantity: 4 }, null, NOW).lineTotal).toBe(320);
  });

  it('chiến dịch đã đóng (biến thể không còn trong danh sách suất) → về giá niêm yết đã lưu', () => {
    const item = { variantId: 'v1', price: 80, regularPrice: 100, quantity: 2 };
    expect(resolveCartLinePrice(item, {}, NOW)).toMatchObject({ lineTotal: 200, promo: null });
    // Chưa tải danh sách suất: giữ ảnh chụp, không nháy giá.
    expect(resolveCartLinePrice(item, null, NOW).lineTotal).toBe(160);
    // Suất không có giá thường → dùng giá niêm yết đã lưu cho phần vượt suất.
    const noRegular = { v1: { ...promos.v1, regularPrice: null } };
    expect(resolveCartLinePrice({ ...item, quantity: 3 }, noRegular, NOW).lineTotal).toBe(2 * 80 + 100);
  });
});
