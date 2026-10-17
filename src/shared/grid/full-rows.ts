/**
 * Bỏ các mục ở hàng cuối chưa đầy của lưới khi phía sau còn dữ liệu ("Xem thêm", "Xem tất cả"), để
 * không có 1–2 thẻ lẻ loi xuống dòng. Hết dữ liệu (`hasMore = false`) thì giữ nguyên: đó là các mục cuối.
 * Mục bị bỏ không mất — lần tải thêm sau sẽ hiện chúng.
 *
 * `rowMultiple` = BCNN số cột của lưới ở mọi breakpoint: 2/3 cột → 6, 2/4 → 4, 2/3/4 → 12.
 * Ít hơn một bội số thì giữ nguyên (không xoá sạch lưới).
 */
export function trimToFullRows<T>(items: readonly T[], rowMultiple: number, hasMore = true): readonly T[] {
  if (!hasMore || items.length < rowMultiple) return items;
  return items.slice(0, items.length - (items.length % rowMultiple));
}
