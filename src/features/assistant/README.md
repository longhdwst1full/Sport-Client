# Storefront Assistant — maintenance note

> **Document version:** 1.2.1
>
> **Last updated:** 2026-10-02
>
> **Change summary:** Sửa mô tả `ASSISTANT_TURN_IN_PROGRESS`: giữ khoá idempotency và chờ lượt gốc (tối đa 90 giây), không bỏ khoá. Trước đó: Dòng giỏ dùng `productType` của thẻ; khách ẩn danh gửi grant tra đơn OTP qua header `x-order-lookup-token` (không bao giờ trong nội dung) và được gợi ý tra cứu đơn khi hỏi về đơn; map `ASSISTANT_ORDER_LOOKUP_TOKEN_INVALID`.

## Phạm vi

| Trong phạm vi | Ngoài phạm vi |
| --- | --- |
| Widget chat nổi trên mọi trang trong route group `(storefront)`: gửi tin, lịch sử trang mới nhất, thẻ sản phẩm/đơn/phiếu, đánh giá câu trả lời, "Chuyển nhân viên" | Trang phiếu hỗ trợ (`features/support`), streaming SSE, tải tin cũ hơn theo cursor, chọn chi nhánh cho hội thoại, Admin Copilot |

## Server/client boundary và tải lười

- `widgets/assistant-chat` → barrel `index.ts` chỉ export `AssistantLauncher` (nút nhỏ, nằm trong bundle đầu trang).
- `AssistantPanelHost` (hook dữ liệu, dialog, thẻ, handoff) được `next/dynamic` (`ssr: false`) tải ở **lần bấm mở đầu tiên**, rồi giữ mount để hội thoại của khách đăng nhập không mất khi đóng/mở. Dialog mount lại mỗi lần mở để `Modal` đưa focus vào/ trả focus về launcher.
- A11y: `Modal` của foundation (role=dialog, aria-modal, Esc đóng, focus in/restore) + vòng Tab cục bộ trong panel; danh sách tin `aria-live="polite"`.

## Generated operation (`@/generated/api/assistant`)

| operationId | Dùng ở | Ghi chú |
| --- | --- | --- |
| `createChatConversation` | `use-assistant-chat.ts` | Gọi ở lần gửi đầu. Không có Idempotency-Key. Ẩn danh nhận `sessionKey` **một lần**. `branchId` chưa gửi (Storefront chưa có chi nhánh đang xem). |
| `sendChatMessage` | `use-assistant-chat.ts` | `requestOptions: true` để gửi `idempotency-key`, `x-assistant-session` và (khách ẩn danh có grant) `x-order-lookup-token`. Trả `{conversation, userMessage, assistantMessage, handoffSuggested}`. |
| `listChatMessages` | `use-assistant-chat.ts` | `useListChatMessages(id, {limit: 30})`; header session qua `request`. Chỉ trang mới nhất. |
| `submitChatMessageFeedback` | `use-assistant-chat.ts` | Ghi một lần; UI khoá nút sau khi đã có `feedback`. |
| `createSupportRequest` | qua `features/support` (`useCreateSupportRequest`) | Handoff: `subject` cố định + mô tả của khách + `conversationId`. |

`assistant.mapper.ts` là nơi duy nhất đọc field của `ChatMessageDto`/`ChatCardDto`.

"Thêm vào giỏ" (`model/assistant-quick-add.ts` + `use-assistant-quick-add.ts`): dòng giỏ dựng thẳng từ `productId` và biến thể mặc định `variantId` của thẻ. INVARIANT: nút chỉ hiện khi biến thể mặc định có trong `variants`, `inStock === true` (không nhận `null`), có giá > 0 và sản phẩm không báo hết hàng; còn lại chỉ có "Xem sản phẩm". Dòng giỏ mang `productType` (STANDARD/BUNDLE) của thẻ.

## State owner

| State | Owner |
| --- | --- |
| Tin nhắn | Cache TanStack Query theo `getListChatMessagesQueryKey(id, {limit})`; gửi thành công thì ghép `userMessage` + `assistantMessage` vào cache (khử trùng theo id vì replay trả lại id cũ). |
| Tin đang gửi / lỗi gửi | `useState` trong hook (`pending`). |
| Hội thoại ẩn danh | localStorage `LocalStorageKey.ASSISTANT_SESSION` (`{conversationId, sessionKey}`) qua `createBrowserStore` (mọi truy cập try/catch). |
| Hội thoại khách đăng nhập | Chỉ bộ nhớ; bỏ khi có `dctd:auth-change`. |

## Security, idempotency và lỗi

- SECURITY: khách đăng nhập đi bằng bearer của `apiFetcher` và không gửi `x-assistant-session`; ẩn danh gửi session key ở mọi lời gọi sau khi tạo hội thoại. Tài khoản không có hồ sơ khách (nhân viên) nhận 403 `ASSISTANT_CUSTOMER_PROFILE_REQUIRED`.
- IDEMPOTENCY: khoá theo chữ ký `conversationId:content`. "Thử lại" cùng nội dung dùng lại khoá (server trả lại lượt gốc, không sinh lượt thứ hai sau timeout); nội dung mới sinh khoá mới. `IDEMPOTENCY_KEY_REUSED` thì bỏ khoá để lần sau dùng khoá mới. `ASSISTANT_TURN_IN_PROGRESS` thì GIỮ nguyên khoá và chờ kết quả của lượt gốc (hỏi lại lịch sử định kỳ, tối đa `ASSISTANT_SEND_TIMEOUT_MS` = 90 giây), vì đổi khoá sẽ sinh lượt thứ hai và trừ quota lần nữa (`requiresFreshIdempotencyKey` trong `assistant-error.ts`).
- SECURITY: grant tra đơn OTP (sessionStorage của `features/orders`) chỉ gửi qua header `x-order-lookup-token`, chỉ cho khách ẩn danh, đọc tại lúc gửi (grant còn hạn mới nhất của tab). Không bao giờ chèn token vào nội dung chat. 400 `ASSISTANT_ORDER_LOOKUP_TOKEN_INVALID` → bỏ grant đó. Khách ẩn danh hỏi về đơn (`assistant-order-intent.ts`) mà chưa có grant → gợi ý link `/orders/lookup`.
- INVARIANT (D75): view model sản phẩm chỉ có `inStock` (còn/hết/không rõ), không có field số lượng; UI chỉ in "Còn hàng"/"Hết hàng".
- Nội dung trợ lý render văn bản thuần (không HTML).

| Lỗi | Hành vi |
| --- | --- |
| 503 `ASSISTANT_UNAVAILABLE` | Banner "Trợ lý đang tạm ngưng" + link `/contact` + hotline; không ẩn phần nào, ô nhập vẫn dùng được để thử lại. |
| 429 `ASSISTANT_QUOTA_EXCEEDED` | Khách đăng nhập: thông báo hết lượt trong ngày. Khách ẩn danh: mời đăng nhập (kèm link) vì hạn mức theo phiên thấp hơn. Giữ tin để thử lại. |
| 403 `ASSISTANT_CUSTOMER_PROFILE_REQUIRED` | Tài khoản không phải khách hoặc khách bị khoá: báo chưa dùng được trợ lý, gợi ý hotline. |
| 400 `ASSISTANT_CONTENT_INVALID` / `ASSISTANT_INVALID_BRANCH` | Thông điệp tiếng Việt theo mã (ký tự không hợp lệ / chi nhánh không còn hoạt động). |
| 404 `ASSISTANT_CONVERSATION_NOT_FOUND`, 400 `ASSISTANT_SESSION_REQUIRED`, 409 `ASSISTANT_CONVERSATION_CLOSED` | Bỏ hội thoại đang nhớ (kể cả localStorage); lần gửi sau tạo hội thoại mới. |
| `ASSISTANT_INPUT_TOO_LONG` / `ASSISTANT_INPUT_EMPTY` | Thông báo theo mã; client còn chặn 2000 ký tự. |
| `handoffSuggested: true` | Gợi ý "Chuyển nhân viên" ngay dưới tin. |

Chuyển nhân viên bắt buộc đăng nhập (V1.0): khách ẩn danh chỉ thấy lời mời đăng nhập.

## Cache/offline

`/api/v1/assistant/*` không nằm trong allowlist cache của service worker (POST bypass; GET không có trong `API_SWR_PATTERNS`) nên luôn đi mạng.

## Checklist khi sửa

- [ ] Contract đổi: `yarn contracts:sync && yarn generate:api`, sửa `assistant.mapper.ts`, không sửa `src/generated`.
- [ ] Không thêm field số lượng tồn vào view model hay UI.
- [ ] Giữ launcher là thứ duy nhất trong bundle đầu trang (kiểm chunk sau `yarn build`).
- [ ] Không lưu hội thoại của khách đăng nhập vào storage.
- [ ] Cạnh feature `assistant → support, orders` phải khớp `eslint.config.mjs`.

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 1.2.1 | 2026-10-02 | Sửa: TURN_IN_PROGRESS giữ khoá idempotency và chờ lượt gốc (tối đa 90 giây). | commit b72d92a |
| 1.2.0 | 2026-09-30 | `productType` vào dòng giỏ; grant tra đơn qua header; gợi ý tra cứu đơn. | feat/assistant-v1 (V1.1 guest lookup) |
| 1.1.0 | 2026-09-29 | Thêm vào giỏ theo `productId`/`variantId` của thẻ, bỏ cạnh `catalog`; mã lỗi mới và quota ẩn danh. | feat/assistant-v1 review fixes |
| 1.0.0 | 2026-09-29 | Tạo note cho widget Trợ lý mua sắm V1.0. | feat/assistant-v1 |
