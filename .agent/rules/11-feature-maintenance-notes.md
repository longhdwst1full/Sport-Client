# Feature maintenance notes

- Feature có nhiều page/component, Guest/Account flow, commerce invariant hoặc offline policy phải có `src/features/<feature>/README.md`.
- README ghi phạm vi/out-of-scope, server/client boundary, public entry, generated operation, state owner, cache/offline rule và checklist khi sửa.
- Comment/JSDoc chỉ giải thích quyết định khó: hydration, cache safety, Guest/Account mapping, idempotency/version, retry hoặc workaround có điều kiện gỡ bỏ. Không comment lại JSX/cú pháp hiển nhiên.
- Khi behavior/contract/cache/security thay đổi, cập nhật note trong cùng task và tăng document version theo rule Storefront.
- Không thêm comment vào `contracts/` hoặc `src/generated/api`; sửa OpenAPI producer, sync và regenerate.
