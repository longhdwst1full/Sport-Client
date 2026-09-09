# Controlled frontend structure — Client

> **Version:** 1.0.0  
> **Updated:** 2026-09-08  
> **Summary:** Quyết định kế thừa có kiểm soát từ dragon-web-v2 và các web DragonX.

| Nguồn tham khảo | Điểm kế thừa | Cách áp dụng tại Sport Client |
| --- | --- | --- |
| `dragon-web-v2` | Feature-first, page mỏng, component theo domain, widget cho layout xuyên trang | `features/<domain>/{api,components,hooks,pages}`; `widgets/` chỉ cho header/floating/global shell |
| `admin-client` | Contract-first, generated API, normalized error | Orval + Axios mutator dùng chung; feature không viết URL Sport API |
| `dragonx-employer-web` | Tách create/edit component và constants theo workflow | Chỉ tách khi file đủ lớn hoặc có state độc lập; tránh tạo folder rỗng và wrapper một dòng |

## Ranh giới

- `app/`: Next.js route entry và providers, không chứa business workflow.
- `features/`: logic/UI chỉ thuộc một domain.
- `widgets/`: khối giao diện ghép nhiều feature và xuất hiện ở nhiều route.
- `shared/`: component/service thực sự trung lập; integration bên thứ ba phải được gọi tên rõ.
- `generated/`: output máy sinh, read-only.

Checkout hiện là mẫu chuẩn: route import public `features/checkout/index.ts`; page orchestration; cart/quote/confirm nằm trong `api/checkout.workflow.ts`; success và order summary nằm trong components. Không đưa toàn bộ checkout vào Redux vì state chỉ sống trong một route; cart tiếp tục dùng Redux do được dùng xuyên header/cart/checkout.
