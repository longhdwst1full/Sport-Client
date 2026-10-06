# Feature: address

> **Document version:** 1.1.0 · **Last updated:** 2026-10-06

Tra cứu địa giới hành chính Việt Nam (theo mã hãng vận chuyển, không phải mã nhà nước) và component
chọn/định dạng địa chỉ giao hàng. Dùng bởi `checkout` và `profile` (sổ địa chỉ).

- `api/vietnam-divisions.ts`: gọi SDK `shipping`, cache theo promise trong bộ nhớ (không phải TanStack
  Query — giữ nguyên hành vi cũ khi tách khỏi `shared`).
- `components/vietnam-address-selector.tsx`: 3 select tỉnh/huyện/xã phụ thuộc lẫn nhau (`DivisionSelect` = `Field` + `Select` foundation).
- `model/selected-address.ts`: helper thuần dùng chung cho checkout + profile — `SelectedAddressData`,
  `EMPTY_SELECTED_ADDRESS`, `toDivisionCode`, `joinAddressParts`, `toSelectedAddressData` (tuỳ chọn
  `dropNamesWithoutCode` cho sổ địa chỉ: địa chỉ cũ thiếu mã quận/phường thì để trống tên để chọn lại).

Public API: `features/address/index.ts`.

## Revision history

| Version | Date | Change summary |
| --- | --- | --- |
| 1.1.0 | 2026-10-06 | Thêm `model/selected-address.ts` (gộp `initialAddress`/`toSelectedAddress` của checkout và `EMPTY_LOCATION`/`toCode` của profile); `DivisionSelect` và ô số nhà dùng primitive foundation. |
| 1.0.0 | — | Tách khỏi `shared`. |
