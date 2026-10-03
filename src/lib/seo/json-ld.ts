/**
 * SECURITY: `JSON.stringify` không escape `<`; tên/mô tả chứa `</script>` sẽ đóng thẻ
 * `<script type="application/ld+json">` sớm và chèn được script khác. Escape thành `\u003c`
 * (khuyến nghị của Next.js) — JSON vẫn hợp lệ. Mọi JSON-LD nhúng vào trang phải đi qua hàm này.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
