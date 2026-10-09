# Storefront design tokens & shared styles

Màu, cỡ, bo góc và style lặp khai **một chỗ**; component chỉ dùng tên token. Đổi giao diện = sửa
`tailwind.config.ts` / `src/app/globals.css` / `button-variants.ts`, không sửa hàng trăm file.

## RULE-DS-01: Bảng màu theo logo (P0)

| Vai trò | Token | Ghi chú |
| --- | --- | --- |
| Hành động chính (nút mua, tìm, gửi) | `Button variant="primary"` = `neutral-900` | Than như chữ "BẢO AN" (#4D4D4F) |
| Giá, khuyến mãi, flash sale, nhận diện | `brand-*` (gốc #E83734 của logo) | Không dùng cho nút hành động |
| Lỗi, huỷ/xoá | `red-*`, `variant="danger"` / `dangerOutline` | |
| Thành công, còn hàng | `success-*` | Không trang trí |
| Cảnh báo, sao đánh giá | `amber-*` | |
| Xám, nền, viền, chữ phụ | `neutral-*`, `ink`, `cream` | |

```tsx
// ❌ ngoài bảng màu hoặc sai vai trò
<button className="bg-gradient-to-r from-red-600 to-red-700">Mua ngay</button>
<div className="bg-sky-50 text-slate-600 border-rose-200" />
// ✅
<Button variant="primary">Mua ngay</Button>
<div className="bg-neutral-50 text-neutral-600 border-red-200" />
```

Cấm: `slate|stone|gray|zinc|rose|sky|blue|indigo|violet|purple|teal|emerald|orange|pink|lime|cyan|fuchsia`
và hex tuỳ ý `bg-[#…]` — trừ màu nhận diện bên thứ ba (Facebook, Zalo, YouTube, Google) ở nút/icon của chính họ.

## RULE-DS-02: Không giá trị tuỳ ý khi đã có token (P0)

| ❌ | ✅ |
| --- | --- |
| `text-[11px]` / `text-[10px]` | `text-2xs` / `text-3xs` |
| `rounded-[24px]` … `rounded-[36px]` | `rounded-3xl` (24) / `rounded-4xl` (32) |
| `tracking-[0.2em]` | `tracking-eyebrow` |

Bo góc chỉ dùng: `lg` 8 · `xl` 12 · `2xl` 16 · `3xl` 24 · `4xl` 32 · `full`.

## RULE-DS-03: Style lặp dùng class chung (P0)

| Class (`globals.css`, layer components) | Thay cho |
| --- | --- |
| `focus-ring` / `focus-ring-tight` / `focus-ring-inverse` | chuỗi `focus-visible:outline-none focus-visible:ring-2 …` |
| `page-container` | `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` |
| `surface-card` | `rounded-3xl border border-neutral-200 bg-white` (padding/shadow thêm riêng) |
| `eyebrow` | `text-xs font-black uppercase tracking-eyebrow` |

Một chuỗi class lặp ≥ 3 file → thêm class vào `@layer components` hoặc preset foundation (`13-foundation-components.md`), không copy tiếp.

## RULE-DS-04: Nút đi qua `Button`/`buttonVariants` (P1)

```tsx
// ❌ tự tô nút trong feature
<Button className="bg-red-700 hover:bg-red-800">Thử lại</Button>
// ✅ chọn variant; className chỉ chỉnh bố cục (rounded-full, px, w-full)
<Button variant="primary" className="rounded-full px-5">Thử lại</Button>
```

Nền đặc, không gradient/bóng màu trên nút. Vùng chạm ≥ 44px (`size="md"` trở lên trên mobile).
