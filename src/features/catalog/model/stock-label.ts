import { LOW_STOCK_THRESHOLD, MAX_LINE_QUANTITY } from '@/features/cart';

export type StockLabel = { tone: 'low' | 'ok'; text: string };

/**
 * Nhãn tồn trên trang sản phẩm (quyết định UI 2026-11-07, xem README catalog):
 * - 1…LOW_STOCK_THRESHOLD: "Chỉ còn N sản phẩm" (nhắc khách sắp hết).
 * - trên ngưỡng, dưới trần: "Còn N sản phẩm".
 * - chạm trần 999 (API cắt trần, tồn thật có thể lớn hơn): "Còn hàng" — không in một con số sai.
 * - API không trả số: rơi về cờ `inStock` cũ ("Còn hàng"). Hết hàng (0) do khối "Tạm hết hàng" lo.
 */
export function stockLabel(availableQuantity: number | null, inStock: boolean | null): StockLabel | null {
  if (availableQuantity === null) return inStock === true ? { tone: 'ok', text: 'Còn hàng' } : null;
  if (availableQuantity <= 0) return null;
  if (availableQuantity <= LOW_STOCK_THRESHOLD) return { tone: 'low', text: `Chỉ còn ${availableQuantity} sản phẩm` };
  if (availableQuantity >= MAX_LINE_QUANTITY) return { tone: 'ok', text: 'Còn hàng' };
  return { tone: 'ok', text: `Còn ${availableQuantity} sản phẩm` };
}
