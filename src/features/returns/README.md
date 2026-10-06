# Returns (Storefront)

> **Version:** 1.1.0
> **Updated:** 2026-10-06
> **Summary:** Hook idempotency chuyển sang `src/shared/hooks`; upload ảnh minh chứng dùng helper chung `src/lib/api/signed-media-upload.ts`, lỗi upload chuẩn hoá thành `ApiError` có câu tiếng Việt.

## Phạm vi và route

| Route | Page | Ghi chú |
| --- | --- | --- |
| `/orders/[orderNo]/return` | `CreateReturnPage` | Chọn món, lý do, ghi chú, tối đa 5 ảnh; ảnh và ghi chú không bắt buộc |
| `/returns` | `AccountReturnsPage` | Danh sách phiếu của tài khoản |
| `/returns/[returnNo]` | `ReturnDetailPage` | Tiến trình 5 mốc, món trả, kết quả kiểm, tiền đã hoàn, huỷ |

`OrderReturnCta` nằm trong chi tiết đơn: nút "Yêu cầu trả hàng", hoặc lý do không trả được. Khách vãng lai thấy hướng dẫn gọi
hotline (D55). Trang tài khoản có mục "Yêu cầu đổi trả". Cả ba route đều cá nhân hoá: `public/sw.js` coi `/returns` là network-only;
`/orders/...` vốn đã network-only.

## Generated API

`src/generated/api/returns/returns.ts`: `useGetAccountReturnEligibility`, `createAccountReturnEvidenceUpload`, `createAccountReturn`,
`useListAccountReturns`, `useGetAccountReturn`, `cancelAccountReturn`. Hai lệnh ghi bật `requestOptions` trong `orval.config.ts`
để gửi `idempotency-key`. Gọi thẳng backend như Orders; không qua proxy `/api/v1/payments`.

## Luật và mapping

- Mọi luật (hạn trả, số lượng còn trả, combo nguyên bộ, danh mục không đổi trả) lấy từ eligibility; UI chỉ giới hạn theo đó, API kiểm lại khi gửi.
- `model/return.mapper.ts`: form → `CreateAccountReturnDto` (combo gửi đúng số còn trả được), ước tính tiền, tiến trình 5 mốc
  (phiếu từ chối/huỷ dừng ở mốc đã tới; phiếu đóng mà không hoàn tiền không đánh dấu mốc "Đã hoàn tiền").
- Nhãn và tiêu đề hiển thị ở `model/return.constants.ts`, khai theo enum sinh ra để thiếu nhãn là lỗi compile.
- Số tiền trước khi kiểm hàng chỉ là dự kiến (`RETURN_ESTIMATE_NOTE`); khách không thấy chứng từ hoàn tiền nội bộ (API trả rỗng).

## State và cache

- Server state: TanStack Query. Form: state cục bộ của trang. Idempotency-Key giữ khi gửi lại cùng nội dung, sinh mới khi nội dung đổi (`useSignatureIdempotencyKey` từ `@/shared/hooks`).
- Tạo phiếu: invalidate danh sách phiếu và eligibility của đơn, rồi chuyển sang trang chi tiết. Huỷ: cập nhật chi tiết từ response,
  invalidate danh sách.
- Ảnh tải thẳng lên Cloudinary bằng chữ ký của đơn (`api/return-evidence-upload.ts`); huỷ form thì ảnh không gắn vào phiếu nào.
- Upload ảnh ký sẵn dùng helper chung `src/lib/api/signed-media-upload.ts` (kiểm MIME/`maxBytes`, 9 field FormData, POST bằng `fetch` có `AbortSignal`); lỗi HTTP/mạng khi tải lên chuẩn hoá thành `ApiError(status, { message: 'Cloudinary không nhận được ảnh. Vui lòng thử lại.' })` (`status = 0` khi mất mạng), huỷ qua signal ném lại lỗi abort gốc. `EvidencePicker` đọc lỗi qua `apiErrorMessage`.

## Test

- `model/return.mapper.test.ts`: tiến trình, payload tạo phiếu, ước tính, điều kiện huỷ.
- Chưa có test giao diện; chưa chạy thử với API thật trên trình duyệt.

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.1.0 | 2026-10-06 | Hook idempotency về `src/shared/hooks`; upload qua `src/lib/api/signed-media-upload.ts` (lỗi upload là `ApiError` tiếng Việt thay cho message Axios); `PaginationControls` dùng chung; chuyển UI sang primitive foundation. |
| 1.0.0 | 2026-09-24 | Tạo feature Returns Storefront V1. |
