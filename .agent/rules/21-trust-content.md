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

## RULE-TRUST-02: Không số liệu/cam kết không có nguồn (P0)

Cấm tự viết: số khách/đánh giá ("50K+", "4.9/12.800"), lời chứng thực đặt tên, "24/7", "trọn đời",
"bảo hành N năm", "miễn phí vận chuyển" không điều kiện, "phản hồi trong 30 phút". Chỉ hiển thị khi
có nguồn (API, CMS, `STORE_POLICY_FACTS`); hứa thời gian phản hồi phải gắn giờ làm việc.

## RULE-TRUST-03: Thông báo đúng điều đã xảy ra (P1)

Form không có API (mailto, newsletter chưa có endpoint) không được báo "gửi thành công". Khách đăng
nhập dùng operation thật (`createSupportRequest`); thiếu endpoint cho khách vãng lai là task BE
(`19-openapi-spec-management.md` RULE-SPEC-05).
