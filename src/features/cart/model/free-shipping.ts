/** Tiến độ tới ngưỡng miễn phí giao theo tiền hàng (`SHIPPING_FREE_ORDER_MIN_AMOUNT`). */
export type FreeShippingProgress =
  | { enabled: false }
  | { enabled: true; threshold: number; reached: boolean; remaining: number; percent: number };

/**
 * Chỉ để nhắc khách: `subtotal` là tạm tính phía client (giá hiển thị trong giỏ, gồm giá flash), còn
 * việc có miễn phí hay không do báo giá checkout quyết định trên `itemSubtotal` của Backend.
 * VND không có phần lẻ nên tính bằng số nguyên; `threshold <= 0` nghĩa là Admin đã tắt luật.
 */
export function freeShippingProgress(subtotal: number, threshold: number): FreeShippingProgress {
  if (!Number.isFinite(threshold) || threshold <= 0) return { enabled: false };
  const amount = Math.max(0, Math.round(subtotal));
  const remaining = Math.max(0, Math.round(threshold) - amount);
  return {
    enabled: true,
    threshold,
    reached: remaining === 0,
    remaining,
    percent: Math.min(100, Math.floor((amount / threshold) * 100)),
  };
}
