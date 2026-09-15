# RULE-SKEL-07: `loading.tsx` không được bọc route động có `notFound()`

## Context

Ba route động (`/news/[slug]`, `/category/[slug]`, `/chinh-sach/[slug]`) trả HTTP 200 cho slug
không tồn tại dù vẫn hiện đúng giao diện 404. Công cụ tìm kiếm coi đó là soft 404 và lập chỉ
mục trang rỗng.

Nguyên nhân: `src/app/loading.tsx` và `src/app/category/loading.tsx` khiến Next bắt đầu truyền
dữ liệu (streaming) trước khi trang kịp gọi `notFound()`. Mã trạng thái đã chốt là 200 và không
đổi được nữa. Trong payload vẫn thấy `NEXT_HTTP_ERROR_FALLBACK;404` — Next biết là 404 nhưng đã
gửi header mất rồi.

## Rule

```
❌ app/category/loading.tsx        → bọc cả app/category/[slug], làm [slug] luôn trả 200
✅ Bỏ loading.tsx ở cấp bọc route động; đặt skeleton bên trong component con
```

Route động có gọi `notFound()` thì cấp cha **không được** có `loading.tsx`. Trạng thái tải đặt
trong chính component tải dữ liệu (client component tự giữ skeleton), hoặc bọc `Suspense` quanh
phần động **sau khi** đã quyết định 404.

Đã có test chặn hồi quy: `e2e/storefront-smoke.spec.ts` — nhóm "Route động trả đúng mã trạng thái".

## Target

Merge into: `.agent/rules/12-skeleton-loading.md`
