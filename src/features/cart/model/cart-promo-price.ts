/**
 * Giá khuyến mãi theo suất (flash sale) của một biến thể, để giỏ hiển thị đúng số tiền checkout sẽ báo.
 * Route group cấp dữ liệu (map từ `promotions`; `cart` không import feature khác).
 */
export interface CartPromoPrice {
  price: number;
  /** Giá thường lúc đọc suất; null khi API chưa có bảng giá hiệu lực. */
  regularPrice: number | null;
  /** Số suất còn lại. 0 = đã hết suất (vẫn giữ để biết dòng không còn giá khuyến mãi). */
  maxQuantity: number;
  endsAtMs: number;
}

export type CartPromoPrices = Readonly<Record<string, CartPromoPrice>>;

export interface CartLinePrice {
  unitPrice: number;
  lineTotal: number;
  /** `applied`: đang hưởng giá suất; `exceeded`: số lượng vượt số suất còn lại → cả dòng tính giá thường. */
  promo: 'applied' | 'exceeded' | null;
  /** Số lượng tối đa còn hưởng giá suất (chỉ có khi `promo` khác null). */
  promoMaxQuantity?: number;
}

/**
 * INVARIANT (khớp `CheckoutService.snapshotItems`): giá flash chỉ áp khi số suất còn lại ≥ số lượng CẢ
 * dòng; thiếu thì cả dòng tính giá thường, không chia nửa flash nửa thường. `price` của dòng là ảnh chụp
 * lúc thêm vào giỏ (có thể là giá flash), nên khi vượt suất phải đổi sang `regularPrice`.
 * Chưa có dữ liệu suất (`promos` null) hoặc biến thể không trong chiến dịch → giữ ảnh chụp; số cuối
 * cùng luôn do báo giá checkout chốt.
 */
export function resolveCartLinePrice(
  item: { variantId: string; price: number; quantity: number },
  promos: CartPromoPrices | null,
  now: number,
): CartLinePrice {
  const promo = promos?.[item.variantId];
  if (!promo || promo.endsAtMs <= now) {
    return { unitPrice: item.price, lineTotal: item.price * item.quantity, promo: null };
  }
  if (item.quantity <= promo.maxQuantity) {
    return { unitPrice: promo.price, lineTotal: promo.price * item.quantity, promo: 'applied', promoMaxQuantity: promo.maxQuantity };
  }
  const unitPrice = promo.regularPrice ?? item.price;
  return { unitPrice, lineTotal: unitPrice * item.quantity, promo: 'exceeded', promoMaxQuantity: promo.maxQuantity };
}
