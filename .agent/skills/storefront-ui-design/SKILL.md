---
name: storefront-ui-design
description: Style or restyle DCTD storefront UI (colors, buttons, cards, spacing, typography, trust copy) using the logo-based design tokens and shared classes. Use for any visual/UI change, color or brand review, or removing repeated Tailwind styles under client.
---

# Storefront UI design

Đọc trước: `.agent/rules/20-design-tokens.md`, `21-trust-content.md`, `13-foundation-components.md`, `12-skeleton-loading.md`.

## Nguồn sự thật

| Cần đổi | Sửa ở |
| --- | --- |
| Màu thương hiệu, cỡ chữ nhỏ, bo góc lớn, giãn chữ | `tailwind.config.ts` (`brand`, `ink`, `fontSize`, `borderRadius`, `letterSpacing`) |
| Focus ring, khung trang, thẻ, nhãn nhỏ | `src/app/globals.css` → `@layer components` |
| Kiểu nút | `src/foundation/components/buttons/button-variants.ts` |
| Hotline, giờ, cam kết chính sách | `src/shared/constants/store.ts` |

Logo: đỏ `#E83734` + xám than `#4D4D4F`. Nút hành động = than (`primary`); đỏ chỉ cho giá/khuyến mãi; `red` cho lỗi/huỷ.

## Quy trình

1. Tìm preset có sẵn (`Button` variant, `surface-card`, `page-container`, `eyebrow`, `focus-ring`, foundation component) trước khi viết class mới.
2. Thiếu preset và chuỗi class lặp ≥ 3 file → thêm vào `@layer components` hoặc foundation, rồi thay hàng loạt.
3. Chạy lệnh kiểm tra dưới đây; kết quả phải rỗng (ngoại lệ: màu nhận diện bên thứ ba).
4. `yarn lint` + `yarn test`; thay đổi trực quan phải xem trên trình duyệt (mobile 375px + desktop) trước khi báo xong.

## Lệnh kiểm tra

```bash
# màu ngoài bảng màu
grep -rnE "\-(slate|stone|gray|zinc|rose|sky|blue|indigo|violet|purple|teal|emerald|orange|pink|lime|cyan|fuchsia)-[0-9]" src --include=*.tsx --include=*.ts | grep -v generated
# giá trị tuỳ ý đã có token
grep -rnE "text-\[1[01]px\]|rounded-\[[0-9]+px\]|tracking-\[0?\.2[0-9]?em\]" src --include=*.tsx
# nút tự tô đỏ/gradient
grep -rnE "<Button[^>]*className=\"[^\"]*(bg|from)-(red|brand)-" src --include=*.tsx
# cam kết viết cứng
grep -rnE "0[0-9]{3} ?[0-9]{3} ?[0-9]{3}|24/7|trọn đời|[0-9]+ ngày đổi|đổi trả trong [0-9]+" src --include=*.tsx | grep -v constants
```

## Không làm

- Không đổi bảng màu/kiểu nút toàn site khi chưa được người dùng chốt; đề xuất kèm lý do.
- Không thêm thư viện UI/animation chỉ để làm đẹp (`07-state-tools-performance.md`).
- Không viết số liệu/cam kết marketing không có nguồn (`21-trust-content.md`).
