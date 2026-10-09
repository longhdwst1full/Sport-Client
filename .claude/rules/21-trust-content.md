---
paths:
  - "src/shared/constants/**"
  - "src/features/**/*.tsx"
  - "src/widgets/**"
---

# Storefront trust content (cam kết, số liệu, liên hệ)

Thông tin khách dùng để quyết định mua phải đúng và giống nhau ở mọi trang.

## RULE-TRUST-01: Một nguồn cho cam kết và liên hệ (P0)

| Dữ liệu | Nguồn duy nhất |
| --- | --- |
| Hotline, email, Zalo, giờ làm việc, showroom | `STORE_CONTACT`, `STORE_SHOWROOMS` (`shared/constants/store.ts`) |
| Số ngày đổi trả, tóm tắt giao hàng/bảo hành | `STORE_POLICY_FACTS` — khớp bài POLICY trên CMS |
| Chi tiết chính sách | Link `STORE_POLICY_PAGES` (`/chinh-sach/<slug>`) |

```tsx
// ❌ viết cứng, lệch nhau giữa các trang
<a href="tel:0862576222">0862 576 222</a> · Hỗ trợ 8h00 - 22h00 · Đổi trả 7 ngày
// ✅
<a href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}>{STORE_CONTACT.primaryHotline}</a> · {STORE_CONTACT.openingHoursShort}
```

## RULE-TRUST-02: Số liệu marketing chỉ khai ở một chỗ (P0)

Số khách, điểm đánh giá, số năm, cam kết bảo hành nổi bật… chỉ lấy từ `STORE_MARKETING_STATS`
(`shared/constants/store.ts`) — chủ shop cung cấp và chịu trách nhiệm, đổi số tại đó là đổi toàn site.

```tsx
// ❌ số viết thẳng trong component, mỗi trang một con số
<h2>Vì sao hơn 50K+ hội viên tin chọn…</h2>
// ✅
<h2>Vì sao hơn {STORE_MARKETING_STATS.customers} khách hàng tin chọn…</h2>
```

Cam kết chính sách (đổi trả, giao hàng) luôn lấy `STORE_POLICY_FACTS`, không đặt trong marketing stats.
Không viết lời chứng thực gắn tên người thật nếu không có nguồn; hứa thời gian phản hồi phải gắn giờ làm việc.

## RULE-TRUST-03: Thông báo đúng điều đã xảy ra (P1)

Form không có API (mailto, newsletter chưa có endpoint) không được báo "gửi thành công". Khách đăng
nhập dùng operation thật (`createSupportRequest`); thiếu endpoint cho khách vãng lai là task BE
(`19-openapi-spec-management.md` RULE-SPEC-05).
