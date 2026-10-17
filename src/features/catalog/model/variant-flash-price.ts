/**
 * Giá flash đang mở của một biến thể, do route truyền vào (catalog không phụ thuộc `promotions`;
 * route map từ `toVariantFlashPrices` của promotions, khớp cấu trúc này).
 * Catalog API chỉ trả giá niêm yết, còn checkout tự áp giá flash theo biến thể.
 */
export interface VariantFlashPrice {
  price: number;
  priceLabel: string;
  originalPriceLabel: string | null;
  discountPercent: number | null;
  availableQuantity: number;
  soldPercent: number;
  /** Epoch ms theo giờ server; qua mốc này thì quay về giá niêm yết. */
  endsAtMs: number;
}

/** Theo `variantId`. */
export type VariantFlashPrices = Readonly<Record<string, VariantFlashPrice>>;

const FLASH_END_FORMAT = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
  day: '2-digit',
  month: '2-digit',
  // Cố định múi giờ: server (UTC) và trình duyệt phải ra cùng chuỗi, nếu không hydrate lệch.
  timeZone: 'Asia/Ho_Chi_Minh',
});

export function formatFlashEnd(endsAtMs: number): string {
  return FLASH_END_FORMAT.format(endsAtMs);
}
