# Storefront shared module

`src/shared` chỉ chứa thứ **thực sự trung lập domain**.

## RULE-SHR-01: Cấu trúc (P0)

```
src/shared/
├── components/   # component trình bày không thuộc domain nào
├── constants/    # hằng số toàn app (SCREAMING_SNAKE_CASE)
├── data/         # mock/demo dataset, phải gắn nhãn non-production
├── format/       # format tiền, ngày, số (nguồn duy nhất — RULE-DT-03)
├── hooks/        # hook dùng chung: useDebounce, useMediaQuery, useInfiniteScroll
├── services/     # integration bên thứ ba, đặt tên rõ nhà cung cấp
└── utils/        # hàm thuần, không state
```

## RULE-SHR-02: Test "trung lập" (P0)

Nếu phải import `@/generated/api` hoặc nhắc tới cart/checkout/customer/catalog thì **không** thuộc `shared`.

```ts
// ❌ src/shared/utils/cart.utils.ts  — biết nghiệp vụ giỏ hàng
// ✅ src/features/cart/model/cart.utils.ts
```

## RULE-SHR-03: Không tạo tầng shared gộp policy (P0)

Cấm một module `shared` trộn chính sách cart + customer + catalog + checkout (`00-directory-structure.md`).

## RULE-SHR-04: `src/components` đã đóng băng (P1)

Chỉ còn giá trị tương thích. Component mới đi vào `foundation` / `shared/components` / `features/<domain>/components`, không thêm vào `src/components`.
