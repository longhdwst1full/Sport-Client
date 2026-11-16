/**
 * Vỏ thẻ sản phẩm dùng chung cho `ProductCard` và `ProductCardSkeleton` (cùng padding/viền/bóng để
 * CLS = 0 — RULE-SKEL-03). Bo góc lấy từ token (`rounded-3xl` bị ghi đè về 16px trong tailwind config).
 */
export const PRODUCT_CARD_SHELL =
  'rounded-3xl border border-neutral-100 bg-white p-3.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:p-4';

/** Bục ảnh vuông nền gradient nhẹ; skeleton chỉ lấy khung (không gradient). */
export const PRODUCT_CARD_STAGE = 'relative aspect-square w-full overflow-hidden rounded-2xl';
