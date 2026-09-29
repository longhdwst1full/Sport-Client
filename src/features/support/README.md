# Storefront Support — maintenance note

> **Document version:** 3.0.1
>
> **Last updated:** 2026-09-29
>
> **Change summary:** Map thêm `SUPPORT_BRANCH_INVALID` (400); phiếu hỗ trợ của khách và hook tạo phiếu dùng chung cho handoff của trợ lý giữ nguyên.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Trang `/contact`: thông tin cửa hàng, form liên hệ | Hỗ trợ đơn hàng — thuộc `features/orders` |
| "Hỗ trợ của tôi": `/account/support`, `/account/support/new`, `/account/support/[ticketNo]` | Widget chat — thuộc `features/assistant`; mở lại phiếu CLOSED (V1.0 khách tạo phiếu mới) |

## Server/client boundary

`pages/*` là client vì có form state / TanStack Query. Route trong `app/(storefront)/account/support/*` chỉ là vỏ (metadata `noindex`). `/account/*` là network-only trong service worker và nằm trong `robots.ts` disallow.

## Public entry

`index.ts` — `ContactPage`, `AccountSupportTicketsPage`, `AccountSupportTicketDetailPage`, `CreateSupportRequestPage`, `useCreateSupportRequest`, `SupportTicketStatusBadge`, `SUPPORT_ROUTES`, `supportTicketStatusLabels`, `isSupportTicketStatus`. Feature `assistant` dùng barrel này cho handoff và thẻ phiếu.

## Phiếu hỗ trợ (`@/generated/api/support`)

| operationId | Hook | Ghi chú |
| --- | --- | --- |
| `listAccountSupportTickets` | `use-account-support-tickets.ts` | Phân trang `page/limit` (10), `meta.total`. |
| `getAccountSupportTicket` | `use-account-support-ticket.ts` | Chi tiết + thread. |
| `addAccountSupportTicketMessage` | `use-account-support-ticket.ts` | Gửi `expectedVersion` = `version` đang xem; trả chi tiết mới và ghi thẳng vào cache chi tiết. |
| `createSupportRequest` | `use-create-support-request.ts` | `requestOptions: true` để gửi `idempotency-key`. |

- Mapper duy nhất: `model/support-ticket.mapper.ts`. SECURITY: API khách không trả ghi chú nội bộ; mapper vẫn loại mọi tin có `isInternal === true` và view model không có field này.
- IDEMPOTENCY: tạo phiếu dùng lại khoá khi gửi lại đúng `subject/message/conversationId` (server trả lại phiếu cũ), khoá mới khi đổi nội dung. Nhắn thêm không có Idempotency-Key: `expectedVersion` chặn ghi trùng (lần gửi lại sau khi đã thành công nhận 409 `SUPPORT_VERSION_CONFLICT`).
- Lỗi theo mã (`model/support-error.ts`): `SUPPORT_TICKET_CLOSED`, `SUPPORT_VERSION_CONFLICT`/`SUPPORT_CONCURRENT_UPDATE` (tải lại chi tiết, giữ nội dung đang gõ), `SUPPORT_CUSTOMER_NOT_FOUND`, `SUPPORT_CONVERSATION_NOT_FOUND`, `SUPPORT_BRANCH_INVALID` (400), `SUPPORT_IDEMPOTENCY_CONFLICT`, 503.
- Trạng thái `OPEN|ASSIGNED|RESOLVED|CLOSED` có nhãn tiếng Việt `Record<SupportTicketStatus, string>`; phiếu CLOSED khoá ô trả lời. Trần độ dài khớp API: tiêu đề 255, nội dung 4000.

## Form liên hệ — generated operation

**Không có.** Backend chưa có endpoint nhận yêu cầu tư vấn.

Vì vậy form **không tự gửi gì cả**: nó dựng sẵn một email `mailto:` với đúng nội dung khách vừa
nhập và mở ứng dụng mail của họ. Việc gửi do chính họ bấm, và màn hình nói đúng điều đó — "Đã mở
email soạn sẵn", kèm câu nhắc yêu cầu chỉ tới nơi sau khi họ bấm gửi, và số hotline để gọi thẳng.

Bản trước chỉ đặt cờ `submitted` rồi báo "Gửi yêu cầu thành công" trong khi không có gì rời khỏi
trình duyệt; khách ngồi đợi một cuộc gọi không bao giờ tới.

**Khi backend có endpoint nhận liên hệ**, thay `mailto:` bằng lời gọi thật và đổi lại thông báo
thành công — nhưng chỉ khi API đã trả về thành công, không phải khi form vừa submit.

## Dữ liệu cửa hàng

Hotline/địa chỉ/giờ mở cửa lấy từ `@/shared/constants` (`STORE_CONFIG`, `STORE_CONTACT`), không hardcode trong JSX (`08-enums-constants.md`).

## Checklist khi sửa

- [ ] Khi có endpoint: dùng SDK generated, xử lý 4xx như kết quả cuối cùng, không auto-retry.
- [ ] Trước khi có endpoint: thông báo thành công phải phản ánh đúng sự thật hoặc hướng người dùng sang hotline.
- [ ] Không lưu dữ liệu liên hệ vào browser storage.
- [ ] Phiếu hỗ trợ: không hiển thị tin nội bộ; không tự retry lệnh ghi; contract đổi thì sync/regenerate và sửa mapper.

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 3.0.1 | 2026-09-29 | Map thêm `SUPPORT_BRANCH_INVALID`. |
| 3.0.0 | 2026-09-29 | Thêm phiếu hỗ trợ của khách trên contract `support`; hook tạo phiếu dùng cho handoff của trợ lý. |
| 2.0.0 | 2026-09-21 | Form liên hệ mở email soạn sẵn thay vì báo gửi thành công giả. |
| 1.0.0 | 2026-09-13 | Tạo note, ghi nhận form chưa có backend. |
