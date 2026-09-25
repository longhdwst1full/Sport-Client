# Profile feature

> **Version:** 2.1.0 · **Last updated:** 2026-09-25
> **Change summary:** Gỡ tab tra cứu bảo hành cùng fixture `MOCK_WARRANTIES` và cờ `FEATURE_FLAGS.WARRANTY_LOOKUP`; chưa có API bảo hành.

## Cài đặt tài khoản

`components/account-settings-form.tsx` — hai form tách riêng vì hai kết cục khác nhau:

| Form | Operation | Hệ quả |
| --- | --- | --- |
| Sửa hồ sơ | `updateCustomerProfile` | Trả về hồ sơ mới. Gửi kèm `expectedVersion` đọc từ hồ sơ đang xem: hai tab mở cùng lúc thì tab cũ nhận lỗi thay vì ghi đè im lặng |
| Đổi mật khẩu | `changeCustomerPassword` | **Đăng xuất mọi thiết bị khác**, giữ lại thiết bị đang thao tác. Màn hình nói rõ điều này trước và sau khi bấm |

**Email và số điện thoại ở đây cũng là định danh đăng nhập.** Backend ghi đồng thời sang `users` và
`customers` trong một transaction. V1 chưa có xác thực email/OTP nên đổi là có hiệu lực ngay — giới
hạn đã biết, khi có xác thực thì tách thành luồng riêng có bước xác nhận.

Bản trước hiển thị thông tin chỉ đọc kèm câu "liên hệ chăm sóc khách hàng để thay đổi", vì Storefront
Auth khi đó chưa có operation nào cho việc này.

## Phạm vi

- Tab `settings`: thông tin liên hệ **chỉ hiển thị, read-only** — chưa có operation cập nhật hồ sơ hay đổi mật khẩu cho khách.
- Tab `address`: sổ địa chỉ nhận hàng — **đã nối API**.
- Tab `warranty` đã gỡ (2026-09-25): chưa có API bảo hành; không hiển thị tra cứu trên dữ liệu mẫu. Mở lại chỉ khi contract có operation thật.

Ngoài phạm vi: lịch sử đơn hàng (thuộc `features/orders`), đăng nhập/đăng ký (`features/auth`).

## Server/client boundary

`profile-page.tsx` là client island (`'use client'`) vì toàn bộ nội dung là dữ liệu cá nhân sau đăng nhập; route `/profile` không được render công khai hoặc cache.

## Generated operation

| Thao tác | Hook | File |
| --- | --- | --- |
| Danh sách địa chỉ | `useListCustomerAddresses` | `src/generated/api/customer/customer.ts` |
| Thêm | `useCreateCustomerAddress` | idem |
| Sửa / đặt mặc định | `useUpdateCustomerAddress` | idem |
| Xóa | `useRemoveCustomerAddress` | idem |

Bọc trong `api/use-customer-addresses.ts`; map DTO ↔ form trong `model/address.mapper.ts` (rule `09-data-transformation`).

## State owner

TanStack Query sở hữu sổ địa chỉ. `staleTime: 0`, `gcTime: 0` và query chỉ bật khi `isAuthenticated` — dữ liệu cá nhân không được giữ lại trong cache sau khi đăng xuất. Redux không tham gia.

## Cache / offline

- Không persist địa chỉ xuống `localStorage` (PII — rule `03-pwa-security-caching`, `07-state-tools-performance`). Khóa cũ `baoan_saved_addresses` đã bị loại bỏ.
- `/profile` và `/api/*` là network-only trong service worker.
- Mutation không auto-retry; lỗi HTTP hiển thị qua toast và giữ nguyên dữ liệu đang nhập trong modal.

## Quyết định cần biết

- **Không có nhãn loại địa chỉ.** `CustomerAddressDto` không có field nhãn (nhà riêng/văn phòng), nên UI chọn nhãn đã bị gỡ thay vì thêm field ngoài contract (rule `02a-contract-change-workflow` RULE-CTR-02).
- **`expectedVersion`.** Update/đặt mặc định gửi `version` đọc được từ danh sách; bản ghi bị sửa ở nơi khác sẽ bị BE từ chối thay vì ghi đè.
- **Tab `settings` không có form.** `Storefront Auth` chỉ phát hành `registerCustomer`, `loginCustomer`, `refreshCustomerToken`, `logoutCustomer`, `getCustomerCurrentUser`. Không có operation đổi họ tên/email/SĐT, và `change-password` thuộc `Admin Auth` (`@Controller('admin/auth')`) nên **không dùng được cho khách**. Trước đây tab này có form 3 ô kèm nút báo "đã lưu thành công" nhưng không gọi API nào — đã gỡ. Chỉ mở lại form khi contract có operation thật; thứ tự bắt buộc là xác minh danh tính trước, đổi email/SĐT sau (`api/_plans/2026-09-13-customer-identity-verification.md`, Phụ lục B).
- **Giá trị hiển thị ở `settings` vẫn là literal.** `profileName` / `profileEmail` / `profilePhone` đang hardcode trong `profile-page.tsx`; `getCustomerCurrentUser` đã có trong contract nhưng chưa được nối. Việc này thuộc hạng mục H5 của `api/_plans/2026-09-13-v1-remediation.md`.
- **Giới hạn khi sửa địa chỉ.** Contract lưu `provinceCode` (chuỗi) cùng `ward`/`district` dạng **tên**, trong khi `VietnamAddressSelector` làm việc theo mã số của nguồn địa giới bên thứ ba. Vì vậy khi mở form sửa, chỉ tỉnh/thành khôi phục được lựa chọn; quận/huyện và phường/xã phải chọn lại. Muốn khôi phục đầy đủ thì contract phải lưu thêm mã quận/huyện, phường/xã — đây là thay đổi phía `api/`, không xử lý ở Storefront.

## Checklist khi sửa feature này

- [ ] Không thêm field nào ngoài `CustomerAddressDto`; thiếu field → sửa `api/`, chạy `yarn openapi:generate`, rồi `yarn contracts:sync && yarn generate:api`.
- [ ] Không ghi dữ liệu cá nhân xuống storage của trình duyệt.
- [ ] Mutation có trạng thái loading, lỗi hiển thị được và không auto-retry.
- [ ] Danh sách có đủ loading / empty / error.
- [ ] Không thêm form ghi dữ liệu khi contract chưa có operation tương ứng — không hiển thị thông báo thành công cho thao tác không gọi API.
- [ ] `yarn lint && yarn test && yarn build`.
