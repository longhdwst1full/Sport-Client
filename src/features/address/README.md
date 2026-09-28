# Feature: address

Tra cứu địa giới hành chính Việt Nam (theo mã hãng vận chuyển, không phải mã nhà nước) và component
chọn/định dạng địa chỉ giao hàng. Dùng bởi `checkout` và `profile` (sổ địa chỉ).

- `api/vietnam-divisions.ts`: gọi SDK `shipping`, cache theo promise trong bộ nhớ (không phải TanStack
  Query — giữ nguyên hành vi cũ khi tách khỏi `shared`).
- `components/vietnam-address-selector.tsx`: 3 select tỉnh/huyện/xã phụ thuộc lẫn nhau.

Public API: `features/address/index.ts`.
