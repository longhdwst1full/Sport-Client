# Storefront document versioning

> **Rule version:** 2.2.0
>
> **Last updated:** 2026-09-13
>
> **Change summary:** Bổ sung rule foundation-components, shared-module, core-infrastructure, react-hooks, image-usage, list-page-pattern và openapi-spec-management (kế thừa `dragon-web-v2`, `dragonx-employer-web`, `admin-client`).

Áp dụng cho `_features/`, `_plans/`, `_prompts/` và tài liệu Storefront/PWA. Markdown viết tay phải có version, ngày, change summary và revision history khi cập nhật có ý nghĩa.

Không chỉnh tay `contracts/` hoặc `src/generated/api`. Thay đổi cache/offline/security phải được trace trong feature spec và plan customer journey tương ứng.

## Revision history

| Version | Date | Change summary | Source / Change ID |
| --- | --- | --- | --- |
| 2.2.0 | 2026-09-13 | Thêm `13-foundation-components.md`, `14-shared-module.md`, `15-core-infrastructure.md`, `16-react-hooks.md`, `17-image-usage.md`, `18-list-page-pattern.md`, `19-openapi-spec-management.md`. | `_plans/refactor-base-v1.md` Phase 1 |
| 2.1.0 | 2026-09-13 | Thêm `RULE_INDEX.md`, `02a-contract-change-workflow.md`, `09-data-transformation.md`, `12-skeleton-loading.md`, `99-rule-maintenance.md`. | Kế thừa `dragonx-employer-web/.agent/rules` |
| 2.0.0 | 2026-09-05 | Tách rule riêng cho Storefront/PWA. | Repository tooling split |
