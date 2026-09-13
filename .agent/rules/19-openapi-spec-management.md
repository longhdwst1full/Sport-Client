# Storefront OpenAPI spec management

Bổ trợ `02a-contract-change-workflow.md`: quy định cách giữ spec **không drift**.

## RULE-SPEC-01: `contracts/` là bản sao, không phải nguồn (P0)

```bash
yarn contracts:sync   # api/document/api/storefront/*.yaml -> contracts/storefront/*.yaml
yarn generate:api     # contracts/ -> src/generated/api/**
```

Sửa `contracts/` bằng tay = tạo contract ma. Sửa `api/`, sync lại.

## RULE-SPEC-02: Kiểm tra drift trước khi claim tính năng (P0)

```bash
diff <(grep -c 'operationId:' ../api/document/api/storefront/catalog.yaml) \
     <(grep -c 'operationId:' contracts/storefront/catalog.yaml)
```

Lệch số operation ⇒ chưa sync, mọi kết luận về "API đã có" đều vô hiệu.

## RULE-SPEC-03: Chỉ tag `Storefront *` (P0)

Operation `Admin *` xuất hiện trong `src/generated/api` là lỗi cấu hình Orval, không phải tính năng để dùng (`RULE-CTR-04`).

## RULE-SPEC-04: Operation generated nhưng chưa dùng phải được ghi nhận (P1)

Liệt kê trong README của feature sở hữu, kèm lý do và điều kiện gỡ bỏ (`RULE-CTR-06`). Hiện đang treo: `quoteShipping`, toàn bộ mutation `cart`.

## RULE-SPEC-05: Thiếu endpoint = task BE, kèm evidence (P0)

Báo cáo theo mẫu: endpoint cần + file controller `api/` chứng minh chưa có + feature FE bị chặn. Không tự viết DTO thay thế (`RULE-CTR-02`).
