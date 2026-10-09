# Storefront design tokens & shared styles

Màu, cỡ, bo góc và style lặp khai **một chỗ**; component chỉ dùng tên token. Đổi giao diện = sửa
`tailwind.config.ts` / `src/app/globals.css` / `button-variants.ts`, không sửa hàng trăm file.

## RULE-DS-01: Bảng màu theo logo (P0)

| Vai trò | Token | Ghi chú |
| --- | --- | --- |
| Nút chuyển đổi (Mua ngay, Thêm vào giỏ, Đặt hàng, Gửi tư vấn) | `Button variant="cta"` = `accent-500` #FF5A1F, **chữ than** | Chữ trắng trên cam chỉ 3.1:1 — cấm |
| Hành động khác (tìm, lọc, thử lại, xem) | `primary` (than) · `secondary`/`outline` · `link` | Trang chủ ưu tiên `link` "Xem tất cả →" |
| Giá thường | `text-neutral-950` | Giá KHÔNG tô đỏ/cam |
| Giá sale, % giảm, flash sale, nhận diện | `brand-*` (gốc #E83734 của logo); giá gốc `neutral-400 line-through` | Không dùng cho nút |
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
| `rounded-[24px]` … `rounded-[36px]` | `rounded-2xl` (16) |
| `tracking-[0.2em]` | `tracking-eyebrow` |

Bo góc tối đa 16px: `lg` 8 (nút, ô nhập) · `xl` 12 (thẻ) · `2xl` 16 (khối lớn, modal) · `full` (pill). `3xl`/`4xl` bị ghi đè về 16px trong config.

## RULE-DS-03: Style lặp dùng class chung (P0)

| Class (`globals.css`, layer components) | Thay cho |
| --- | --- |
| `focus-ring` / `focus-ring-tight` / `focus-ring-inverse` | chuỗi `focus-visible:outline-none focus-visible:ring-2 …` |
| `page-container` | `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` |
| `surface-card` | `rounded-3xl border border-neutral-200 bg-white` (padding/shadow thêm riêng) |
| `eyebrow` | `text-xs font-semibold uppercase tracking-eyebrow` |
| `card-interactive` | thẻ bấm được: trắng + viền, bóng chỉ khi hover |
| `page-shell` / `page-section` | nền + đệm trang / khối trang chủ |
| `heading-page` / `heading-section` | tiêu đề h1 / h2 |
| `text-link` | link chữ trong đoạn |

Một chuỗi class lặp ≥ 3 file → thêm class vào `@layer components` hoặc preset foundation (`13-foundation-components.md`), không copy tiếp.

## RULE-DS-04: Nút đi qua `Button`/`buttonVariants` (P1)

```tsx
// ❌ tự tô nút trong feature
<Button className="bg-red-700 hover:bg-red-800">Thử lại</Button>
// ✅ chọn variant; className chỉ chỉnh bố cục (rounded-full, px, w-full)
<Button variant="primary" className="rounded-full px-5">Thử lại</Button>
```

Nền đặc, không gradient/bóng màu trên nút. Vùng chạm ≥ 44px (`size="md"` trở lên trên mobile).

## RULE-DS-05: Nền và thẻ tiết chế (P0)

| ✅ | ❌ |
| --- | --- |
| Trang trắng; khối xám nhạt `neutral-50` làm điểm nhấn | Mỗi section một nền màu |
| Trang chủ tối đa MỘT khối nền tối (khối uy tín) + footer | Hero/flash sale/đánh giá/tư vấn đều nền tối |
| Thẻ chọn tối đa 2/3: nền · viền · bóng (`card-interactive`) | Nền xám + viền + bóng + bo 24px cùng lúc |
| Chữ: 400 thân · 500 nhấn · 600 nhãn/nút · 700 tiêu đề | `font-black`/`font-extrabold` |

Font: Be Vietnam Pro (`next/font/google`, biến `--font-sans`, khai ở `app/layout.tsx`).
