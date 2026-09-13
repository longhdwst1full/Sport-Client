# Storefront image usage

## RULE-IMG-01: Dùng pipeline ảnh của Next (P0)

```tsx
// ❌ <img src={product.imageUrl} />  — không tối ưu, gây CLS
// ✅
<Image src={imageUrl} alt={name} width={480} height={480} sizes="(max-width:768px) 50vw, 320px" />
```

Host ngoài phải được khai báo trong `next.config`. Không dùng `<img>` cho ảnh sản phẩm/biên tập.

## RULE-IMG-02: Luôn có kích thước hoặc aspect (P0)

`width`/`height`, hoặc `fill` trong container có `aspect-ratio`. Layout shift trên lưới sản phẩm là hồi quy CLS (`06-quality.md`, `12-skeleton-loading.md`).

## RULE-IMG-03: Alt có nghĩa (P0)

Ảnh sản phẩm: tên sản phẩm. Ảnh trang trí: `alt=""`. Không đặt alt kiểu `"image"`, `"banner1"`.

## RULE-IMG-04: Ảnh above-the-fold (P1)

Ảnh hero/ảnh chính trang chi tiết dùng `priority`; phần còn lại để lazy mặc định. Không đặt `priority` cho cả lưới.

## RULE-IMG-05: Fallback khi thiếu ảnh (P1)

Mapper trả `imageUrl: string | null` (`09-data-transformation.md`); component render placeholder foundation, không render `<Image src={null}>`.
