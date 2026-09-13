# Storefront API integration audit

> **Version:** 1.1.0  
> **Updated:** 2026-09-11  
> **Summary:** Cập nhật Order generated integration, own access/cancel và cache isolation sau S4.1.

## Kết luận

- Checkout hiện dùng 100% SDK generated từ OpenAPI cho Cart → Quote → Reload consultation → Confirm reservation; không viết URL nghiệp vụ thủ công.
- `src/features/checkout` được chia `api/`, `components/`, `pages/` và public `index.ts`, kế thừa cách chia feature của `dragon-web-v2` nhưng không tạo hook/store trung gian khi chưa có state dùng chung.
- `src/shared/services/vietnam-address.service.ts` gọi dịch vụ địa giới bên thứ ba; đây là integration ngoài Sport API nên không sinh từ OpenAPI nội bộ.
- `src/lib/api/fetcher.ts` là adapter Axios dùng chung cho Orval; feature không được import Axios trực tiếp.

## Ma trận hiện trạng

| Vùng | Nguồn dữ liệu | Trạng thái |
| --- | --- | --- |
| Auth | Generated SDK | Đã ghép |
| Catalog/list/detail | Generated SDK, còn một số fallback trình diễn | Cần bỏ fallback sau khi seed/product API ổn định |
| Cart/checkout/shipping quote | Generated SDK | Đã ghép Sprint 3 |
| Content/reviews | Generated SDK, UI có empty/fallback presentation | Cần E2E dữ liệu thật |
| Customer address | API đã có nhưng Profile còn state demo | Cần ghép trong đợt Profile |
| Orders | Generated SDK; Guest/Account/Admin list-detail-cancel | Đã ghép S4.1; Customer cache được xóa khi logout/đổi token |
| Payment/fulfillment | Chưa triển khai S4.2/S4.3 | Không tự tạo mock contract thay backend |
| Warranty/notifications/promotions | Chưa có API | Đang demo; phải gắn nhãn non-production |

## Quy tắc tiếp tục

1. Backend cập nhật OpenAPI trước; Client chạy `yarn contracts:sync && yarn generate:api`.
2. Không sửa file dưới `src/generated/api` bằng tay.
3. Page chỉ orchestration; khối UI lớn hoặc tái sử dụng đưa vào `components/`; gọi nhiều generated endpoint theo một transaction UI đưa vào `api/*.workflow.ts`.
4. `widgets/` chỉ dành cho khối layout xuyên feature như header/floating actions; không đưa component chỉ dùng cho checkout vào widgets.
5. Không coi fallback/mock là function Done và không gửi dữ liệu local price/stock làm nguồn quyết định checkout.

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 1.1.0 | 2026-09-11 | Ghi nhận Order SDK thật và private-query cache isolation. | CLIENT-20260911-ORDER-S41-HARDENING |
| 1.0.0 | 2026-09-08 | Rà API integration và chuẩn hóa checkout feature. | Client API audit |
