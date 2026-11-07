/** Khớp contract cart (`quantity` minimum 1, maximum 999) và trần `availableQuantity` của API. */
export const MAX_LINE_QUANTITY = 999;

/** Ngưỡng "sắp hết": từ mức này trở xuống trang sản phẩm ghi "Chỉ còn N sản phẩm". */
export const LOW_STOCK_THRESHOLD = 10;

/**
 * Số lượng tối đa UI cho chọn của một SKU. `availableQuantity` từ API = số đặt được trong MỘT đơn
 * (kho chi nhánh tốt nhất, đã trừ hàng đang giữ, trần 999). Không biết (null/undefined) thì chỉ chặn
 * theo trần giỏ — UI không tự chế tồn; backend vẫn kiểm khi giữ hàng.
 */
export function maxOrderableQuantity(availableQuantity: number | null | undefined): number {
  if (availableQuantity === null || availableQuantity === undefined || !Number.isFinite(availableQuantity)) {
    return MAX_LINE_QUANTITY;
  }
  return Math.min(MAX_LINE_QUANTITY, Math.max(0, Math.floor(availableQuantity)));
}

/**
 * Kẹp số lượng khách chọn/nhập về [1, max]. `clamped` = đã phải hạ xuống vì vượt max (để báo nhẹ).
 * Giá trị không phải số giữ nguyên `fallback`.
 */
export function clampToStock(
  requested: number,
  availableQuantity: number | null | undefined,
  fallback = 1,
): { quantity: number; clamped: boolean; max: number } {
  const max = maxOrderableQuantity(availableQuantity);
  if (!Number.isFinite(requested)) return { quantity: Math.min(Math.max(1, fallback), Math.max(1, max)), clamped: false, max };
  const whole = Math.floor(requested);
  if (max >= 1 && whole > max) return { quantity: max, clamped: true, max };
  return { quantity: Math.max(1, whole), clamped: false, max };
}

/** Dòng giỏ vượt số đặt được (chỉ khi biết tồn): phải giảm/xoá trước khi đặt hàng. */
export function isOverStock(quantity: number, availableQuantity: number | null | undefined): boolean {
  return availableQuantity !== null && availableQuantity !== undefined && quantity > availableQuantity;
}
