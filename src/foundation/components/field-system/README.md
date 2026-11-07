# Field system — focus và đường viền

> **Document version:** 1.0.0
>
> **Last updated:** 2026-11-07
>
> **Change summary:** CLIENT-20261107-FIELD-FOCUS: sửa viền kép khi focus input/select; giữ focus bàn phím và trạng thái validation.

## Phạm vi

- `inputVariants` dùng cho TextInput, PasswordInput, Select, Textarea và Combobox; không chứa logic commerce/API.
- Ô chuẩn giữ border 1px và kích thước hiện tại. Khi focus: border đậm + ring nhẹ liền sát, không chồng thêm outline đen cách 2px.
- `focus-ring-tight/30` không phải cú pháp hợp lệ cho custom class Tailwind. Dùng các utility focus-visible thật; lỗi giữ border/ring đỏ, disabled và font mobile không đổi.
- Global fallback `:where(:focus-visible)` nằm trong `@layer base` để nhường cho ring của component; phần tử chưa có focus style vẫn có outline bàn phím.
- Legacy passthrough giữ nguyên: caller tự truyền className không bật style chuẩn vẫn sở hữu style của mình. Không xóa outline toàn site hoặc đổi validation/keyboard handler của combobox.

## Kiểm tra khi sửa

- Unit test merge class/default/invalid/size/passthrough.
- Browser kiểm computed style và hình ở mobile 375px, desktop: input/select/textarea, error, disabled và fallback focus của button/link.
- Không đổi contract, generated SDK, cache/PWA hoặc DB trong task này.

## Bằng chứng 2026-11-07

- Lint pass; Vitest 58 files / 433 tests pass tại lượt chạy.
- Chromium trước/sau bằng CSS thực: trước có outline đen 2px + offset 2px, sau outline trong suốt và ring 2px alpha 0.1 sát border 1px.
- Playwright `field-focus.spec.ts`: 2/2 pass tại 375px và 1280px trên dev server cổng 3598; kiểm input/select/textarea, invalid, disabled, tab focus và fallback button; có ảnh trong `.playwright/artifacts`.
- Production build compile/typecheck xong nhưng không hoàn thành: một phiên `next dev -p 3598` khác chạy cùng `.next`, build báo ENOENT `pages-manifest.json`. Không dừng phiên dev hoặc xóa cache của người dùng; cần chạy lại build khi không có dev dùng chung output. Chưa deploy và chưa kiểm chứng trên Safari thật.
- Các thay đổi đồng thời trong `features/assistant` không thuộc task và được giữ nguyên.

## Revision history

| Version | Date | Change summary | Source |
| --- | --- | --- | --- |
| 1.0.0 | 2026-11-07 | Bỏ custom alpha class sai, hạ fallback focus vào base, giữ keyboard accessibility. | CLIENT-20261107-FIELD-FOCUS |
