# Returns (Storefront)

> **Version:** 1.0.0
> **Updated:** 2026-09-24
> **Summary:** Khách đăng nhập tạo yêu cầu trả hàng từ đơn đã giao, theo dõi tiến độ và huỷ khi cửa hàng chưa nhận hàng.

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

- Server state: TanStack Query. Form: state cục bộ của trang. Idempotency-Key giữ khi gửi lại cùng nội dung, sinh mới khi nội dung đổi.
- Tạo phiếu: invalidate danh sách phiếu và eligibility của đơn, rồi chuyển sang trang chi tiết. Huỷ: cập nhật chi tiết từ response,
  invalidate danh sách.
- Ảnh tải thẳng lên Cloudinary bằng chữ ký của đơn (`api/return-evidence-upload.ts`); huỷ form thì ảnh không gắn vào phiếu nào.

## Test

- `model/return.mapper.test.ts`: tiến trình, payload tạo phiếu, ước tính, điều kiện huỷ.
- Chưa có test giao diện; chưa chạy thử với API thật trên trình duyệt.

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.0.0 | 2026-09-24 | Tạo feature Returns Storefront V1. |
