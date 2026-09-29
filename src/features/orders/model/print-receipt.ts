/** Class gắn lên body chỉ trong lúc in biên lai; CSS `@media print` ở globals.css dựa vào nó. */
export const RECEIPT_PRINTING_BODY_CLASS = 'printing-order-receipt';

/**
 * In riêng biên lai (D16) thay vì cả trang. Gỡ class ở `afterprint`, và hẹn giờ dự phòng cho trình
 * duyệt trả về ngay sau `print()` (Safari).
 */
export function printOrderReceipt(): void {
  const { body } = document;
  const cleanup = () => {
    body.classList.remove(RECEIPT_PRINTING_BODY_CLASS);
    window.removeEventListener('afterprint', cleanup);
  };
  body.classList.add(RECEIPT_PRINTING_BODY_CLASS);
  window.addEventListener('afterprint', cleanup);
  window.print();
  setTimeout(cleanup, 1000);
}
