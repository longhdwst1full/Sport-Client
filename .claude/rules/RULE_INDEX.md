# Rule Index — DCTD Storefront

> Read this file first. Then read ONLY the rules listed for the task at hand.
> `.agent/rules/` is authoritative; `.claude/rules/` is a mirror.

## Task → rules

### 🛒 New / changed storefront feature

| Prio | Rule | Check |
| --- | --- | --- |
| P0 | `00-directory-structure.md` | feature folder, dependency direction |
| P0 | `01-next-rendering.md` | server-first, smallest `'use client'` boundary |
| P0 | `02-api-contract.md` | consume `src/generated/api` only |
| P0 | `09-data-transformation.md` | DTO → view model at the feature boundary |
| P1 | `07-state-tools-performance.md` | Query vs Redux ownership |
| P0 | `15-core-infrastructure.md` | transport/storage đi qua core |
| P1 | `14-shared-module.md` | thứ gì được vào `shared/` |
| P1 | `13-foundation-components.md` | foundation vs feature vs widget |
| P1 | `16-react-hooks.md` | derive state, effect cho hệ thống ngoài |
| P1 | `18-list-page-pattern.md` | 6 trạng thái của list page |
| P1 | `12-skeleton-loading.md` | loading states |
| P1 | `11-feature-maintenance-notes.md` | feature README + comments |
| P2 | `06-quality.md` | gate before handoff |

Skill: `.agent/skills/storefront-feature-development/SKILL.md`

### 🔌 API integration / SDK regeneration

| Prio | Rule | Check |
| --- | --- | --- |
| P0 | `02a-contract-change-workflow.md` | direction of change, evidence, no hand-written DTO |
| P0 | `19-openapi-spec-management.md` | chống drift spec, evidence khi thiếu endpoint |
| P0 | `02-api-contract.md` | fetcher boundary, retry policy |
| P1 | `08-enums-constants.md` | enums come from generated DTOs |
| P1 | `09-data-transformation.md` | mapper layer |

Skill: `.agent/skills/client-api-integration/SKILL.md`
Commands: `yarn contracts:sync` → `yarn generate:api`

### 📴 PWA / offline / service worker

| Prio | Rule | Check |
| --- | --- | --- |
| P0 | `03-pwa-security-caching.md` | route class A/B/C, cache prefix, never cache PII |
| P0 | `04-offline-commerce-ux.md` | 4xx ≠ offline, stale price labelling |
| P1 | `06-quality.md` | production build required |

Skill: `.agent/skills/pwa-development/SKILL.md`

### 🎨 Commerce UI / media / content

| Prio | Rule | Check |
| --- | --- | --- |
| P0 | `05-commerce-content-media.md` | image pipeline, variant/combo visibility, review moderation |
| P0 | `12-skeleton-loading.md` | no layout shift while loading |
| P0 | `17-image-usage.md` | next/image, aspect, alt |
| P1 | `10-reference-adoption.md` | adapt `dragon-web-v2` patterns, do not copy |

### 🧭 Unfamiliar code / impact analysis

Skill: `.agent/skills/storefront-codebase-navigation/SKILL.md` + GitNexus (`CLAUDE.md`).

### ✅ Review / handoff

| Prio | Rule |
| --- | --- |
| P0 | `06-quality.md` |
| P0 | `02a-contract-change-workflow.md` (RULE-CTR-03 evidence) |
| P1 | `11-feature-maintenance-notes.md`, `00-document-versioning.md` |

Skill: `.agent/skills/client-quality-review/SKILL.md`

### 🧩 Found a gap in these rules

`99-rule-maintenance.md` → write to `.agent/.pending-rules/`, never straight into `.agent/rules/`.

## Full list

| File | Scope |
| --- | --- |
| `00-directory-structure.md` | layers and dependency direction |
| `00-document-versioning.md` | handwritten doc versioning |
| `01-next-rendering.md` | server/client boundaries |
| `02-api-contract.md` | generated SDK + transport |
| `02a-contract-change-workflow.md` | BE → contract → SDK → feature |
| `03-pwa-security-caching.md` | cache classification and safety |
| `04-offline-commerce-ux.md` | offline vs HTTP failure UX |
| `05-commerce-content-media.md` | product, content, media rules |
| `06-quality.md` | quality gate |
| `07-state-tools-performance.md` | Query/Redux/Saga, persistence |
| `08-enums-constants.md` | enums, codes, keys |
| `09-data-transformation.md` | DTO → view model |
| `10-reference-adoption.md` | reference repo policy |
| `11-feature-maintenance-notes.md` | feature README requirements |
| `12-skeleton-loading.md` | loading states |
| `13-foundation-components.md` | tiêu chí vào foundation |
| `14-shared-module.md` | shared thực sự trung lập |
| `15-core-infrastructure.md` | core: http, storage, session |
| `16-react-hooks.md` | quy tắc hook |
| `17-image-usage.md` | ảnh và CLS |
| `18-list-page-pattern.md` | pattern trang danh sách |
| `19-openapi-spec-management.md` | quản lý spec OpenAPI |
| `99-rule-maintenance.md` | how rules themselves change |
