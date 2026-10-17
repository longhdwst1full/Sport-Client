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
  lineTotal: number;
  /**
   * `applied`: cả dòng giá suất; `split`: vượt số suất → phần trong suất giá flash + phần dư giá thường;
   * `soldOut`: hết suất, cả dòng giá thường; `null`: không có suất.
   */
  promo: 'applied' | 'split' | 'soldOut' | null;
  /** Số lượng + đơn giá phần giá flash (0 khi không hưởng). */
  flashQuantity: number;
  flashUnitPrice: number;
  /** Số lượng + đơn giá phần giá thường. */
  regularQuantity: number;
  regularUnitPrice: number;
}

/**
 * INVARIANT (khớp `CheckoutService.snapshotItems`): giá flash áp cho tối đa số suất còn lại; phần vượt
 * tách thành phần giá thường (checkout trả hai dòng). `price` của dòng giỏ là ảnh chụp lúc thêm (có thể
 * là giá flash), nên phần giá thường dùng `regularPrice` của suất.
 * Biến thể không trong chiến dịch hoặc đã hết giờ → giá niêm yết đã lưu (`regularPrice`, nếu có); chưa có
 * dữ liệu suất (`promos` null) → giữ ảnh chụp. Số cuối cùng luôn do báo giá checkout chốt.
 */
export function resolveCartLinePrice(
  item: { variantId: string; price: number; quantity: number; regularPrice?: number },
  promos: CartPromoPrices | null,
  now: number,
): CartLinePrice {
  const promo = promos?.[item.variantId];
  if (!promo || promo.endsAtMs <= now) {
    // Đã biết danh sách suất (`promos` khác null) mà biến thể không còn suất → chiến dịch đã đóng: dòng thêm
    // với giá flash về giá niêm yết. Chưa biết (null) → giữ ảnh chụp, tránh nháy giá lúc đang tải.
    const unit = promos ? (item.regularPrice ?? item.price) : item.price;
    return {
      lineTotal: unit * item.quantity,
      promo: null,
      flashQuantity: 0,
      flashUnitPrice: unit,
      regularQuantity: item.quantity,
      regularUnitPrice: unit,
    };
  }
  const regularUnitPrice = promo.regularPrice ?? item.regularPrice ?? item.price;
  const flashQuantity = Math.min(Math.max(promo.maxQuantity, 0), item.quantity);
  const regularQuantity = item.quantity - flashQuantity;
  return {
    lineTotal: flashQuantity * promo.price + regularQuantity * regularUnitPrice,
    promo: flashQuantity === 0 ? 'soldOut' : regularQuantity === 0 ? 'applied' : 'split',
    flashQuantity,
    flashUnitPrice: promo.price,
    regularQuantity,
    regularUnitPrice,
  };
}
