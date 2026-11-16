/**
 * Logic thuần của bộ lọc khoảng giá tự do (`?minPrice=&maxPrice=`, VND nguyên). Tách riêng khỏi
 * component để test được và để URL parser, hook, slider cùng dùng một luật kẹp/định dạng.
 */
export const PRICE_SLIDER = {
  min: 0,
  /** Đầu phải của thanh trượt = "không giới hạn" (không gửi `maxPrice`). */
  max: 50_000_000,
  step: 100_000,
} as const;

const vnNumber = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 });

/** Số VND nguyên không âm từ chuỗi URL (chỉ chữ số); còn lại là `null`. */
export function parsePriceParam(raw: string | null | undefined): number | null {
  if (!raw || !/^\d{1,12}$/.test(raw.trim())) return null;
  const value = Number(raw.trim());
  return Number.isSafeInteger(value) ? value : null;
}

/** Đọc ô nhập tay ("1.500.000", "1500000 ₫"): bỏ mọi ký tự không phải số; rỗng/NaN → `null`. */
export function parsePriceInput(text: string): number | null {
  const digits = text.replace(/\D/g, '');
  if (!digits) return null;
  const value = Number(digits);
  return Number.isSafeInteger(value) ? value : null;
}

/** Hiển thị trong ô nhập: có dấu phân cách nghìn, không kèm ký hiệu tiền. */
export function formatPriceInput(value: number | null): string {
  return value === null ? '' : vnNumber.format(value);
}

/**
 * Chuẩn hoá cặp (min,max): kẹp vào miền thanh trượt, min<=max (đảo nếu ngược). `min` 0 hoặc `max`
 * chạm đầu phải = không giới hạn phía đó (`null`).
 */
export function normalizePriceRange(
  min: number | null,
  max: number | null,
): { min: number | null; max: number | null } {
  let lo = min !== null && Number.isFinite(min) ? Math.max(0, Math.round(min)) : null;
  let hi = max !== null && Number.isFinite(max) ? Math.max(0, Math.round(max)) : null;
  if (lo !== null && hi !== null && lo > hi) [lo, hi] = [hi, lo];
  if (lo !== null && lo > PRICE_SLIDER.max) lo = PRICE_SLIDER.max;
  if (lo === 0) lo = null;
  if (hi !== null && hi >= PRICE_SLIDER.max) hi = null;
  return { min: lo, max: hi };
}

/** Làm tròn về bước thanh trượt (vị trí tay cầm), kẹp trong miền. */
export function snapToStep(value: number): number {
  const snapped = Math.round(value / PRICE_SLIDER.step) * PRICE_SLIDER.step;
  return Math.min(PRICE_SLIDER.max, Math.max(PRICE_SLIDER.min, snapped));
}

/** Nhãn chip/tóm tắt, `format` là `formatVnd` (truyền vào để file này không phụ thuộc shared). */
export function formatPriceRangeLabel(
  min: number | null,
  max: number | null,
  format: (value: number) => string,
): string | null {
  if (min === null && max === null) return null;
  if (min === null) return `Đến ${format(max as number)}`;
  if (max === null) return `Từ ${format(min)}`;
  return `${format(min)} – ${format(max)}`;
}
