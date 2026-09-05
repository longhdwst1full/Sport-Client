# Storefront document versioning

> **Rule version:** 2.0.0
>
> **Last updated:** 2026-09-05
>
> **Change summary:** Tách rule về Storefront repository và bổ sung trace cho PWA/customer journey.

Áp dụng cho `_features/`, `_plans/`, `_prompts/` và tài liệu Storefront/PWA. Markdown viết tay phải có version, ngày, change summary và revision history khi cập nhật có ý nghĩa.

Không chỉnh tay `contracts/` hoặc `src/generated/api`. Thay đổi cache/offline/security phải được trace trong feature spec và plan customer journey tương ứng.

## Revision history

| Version | Date | Change summary | Source / Change ID |
| --- | --- | --- | --- |
| 2.0.0 | 2026-09-05 | Tách rule riêng cho Storefront/PWA. | Repository tooling split |
