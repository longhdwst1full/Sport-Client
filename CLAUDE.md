# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Storefront context

Read `AGENTS.md` and the task-relevant files under `.agent/rules` and `.agent/skills` before changing this repository. Do not import API or Admin rules.

## Commands

```bash
yarn dev                 # Next dev server on :3000 (predev regenerates the SDK first)
yarn build && yarn start # production build / serve (prebuild regenerates the SDK first)
yarn lint                # prelint regenerates the SDK, then tsc --noEmit + ESLint (eslint.config.mjs: import-boundary rules only)
yarn lint:boundaries     # ESLint layer/feature boundary check alone
yarn test                # pretest regenerates the SDK, then vitest run --pool=threads
yarn verify              # lint + test + generate:api + build (full quality gate)

yarn contracts:sync      # pull Storefront OpenAPI slices (+ any shared `_*.yaml` file, e.g. `_components.yaml`)
                          # into contracts/storefront/*.yaml. Source resolution order:
                          # $CONTRACTS_SOURCE_DIR (or legacy $SPORT_API_CONTRACT_DIR) > sibling
                          # ../api/document/api/storefront checkout > GitHub raw fallback.
yarn generate:api         # clean + regenerate src/generated/api from contracts/ (orval, devDependency)
```

`src/generated/` is disposable, git-ignored and never committed — it regenerates automatically via
`predev`/`prebuild`/`prelint`/`pretest`. `contracts/storefront/*.yaml` stay committed (the storefront
deploys independently, with no sibling `api` repo on Vercel), so a fresh clone only needs
`yarn install && yarn build` to produce a working SDK and build.

Single test: `yarn vitest run src/features/cart/model/cart.saga.test.ts` (add `-t "name"` for one case).
Tests live next to the code (`*.test.ts(x)`): transport, cart slice/saga, auth token store and page-level flows such as checkout requote and order detail.

Node >= 22, Yarn 1 (`yarn add <pkg>` from this repo only — it deploys independently).

## Architecture

Next.js 15 App Router storefront + PWA. Canonical flow:

`src/app` route (server-first) → `src/features/<domain>` composition → narrow `'use client'` island → `src/generated/api` SDK → `src/lib/api/fetcher.ts` (Axios).

- **Generated SDK per domain.** `orval.config.ts` builds one isolated client+models folder per business domain (auth, catalog, content, reviews, cart, customer, shipping, checkout, orders, payments) from `contracts/storefront/<domain>.yaml`. All of `src/generated/api` is disposable — never hand-edit; regenerate when the contract changes. Some operations opt into `requestOptions: true` (cancel order, submit payment evidence) so callers can pass per-request config.
- **Transport.** `apiFetcher` in `src/lib/api/fetcher.ts` is the single Orval mutator: base URL from `NEXT_PUBLIC_API_URL`, `withCredentials`, bearer header from `core/auth/customer-auth-token.store`, a de-duplicated refresh-token rotation on 401 (skipped for `/auth/` endpoints), and `ApiError(status, payload)` normalization. It owns no endpoint path or DTO.
- **State ownership.** TanStack Query (configured in `src/app/providers.tsx`, `staleTime` 30s, `retry` 1) owns remote state; Redux Toolkit + Saga owns only the interactive cart — the slice and persistence/hydration saga live in `features/cart/model`, consumed through `useCartItems`/`useCartActions`; `src/app/store` only composes the reducer and forks the cart saga. Never mirror an API payload into both. `Providers` also clears the query cache when the authenticated subject changes (logout/account switch) so personalized data cannot leak between sessions.
- **Layers.** `src/layouts` route shells (composition only, no business logic), `src/widgets` cross-route sections (e.g. `site-header`, `site-footer`; may use a feature's public barrel, never a deep feature import), `src/foundation` low-level presentation grouped as `components/<category>/<component>/` with a top-level barrel (`foundation/components/index.ts`) — no `@/generated`, no domain knowledge, `src/shared` domain-neutral utilities/components/format/hooks (never `@/generated`, never feature-specific), `src/core` browser infrastructure only (`core/storage`, `core/auth` — the customer auth token store lives here, not in `features/auth`), `src/lib` framework/transport adapters (`lib/api` fetcher/errors, `lib/query` cache policy, `lib/seo` metadata helpers). `src/components` is retired; do not add to it.
- **Feature → feature edges.** Features are otherwise isolated (import only their own tree, `foundation`, `shared`, `core`, `lib`, and their own `@/generated/api/<domain>`), except through another feature's `index.ts` barrel and only for these approved edges: every feature may depend on `auth` and `cart` (session + cart actions/selectors); `checkout` → `orders`, `address`, `site-config`; `orders` → `returns`, `reviews`; `profile` → `address`; `home` → `catalog`, `content`, `reviews`, `promotions`. No other feature-to-feature import is allowed; a deep import bypassing a barrel (`@/features/x/model/...`) is never allowed even for approved edges. `eslint.config.mjs` enforces this matrix; its `EXCEPTIONS` list names the few pre-existing violations still scoped per file — shrink it, never widen it.
- **PWA.** Service worker entry is `public/sw.js`; client utilities in `src/pwa` (registration + `/pwa` reset). Caches are prefixed `dctd-storefront-` and versioned; account/orders/profile/checkout navigations and `/api/*` are network-only with an `/offline` fallback, public navigation caching is limited to an explicit allowlist. Any change here needs `.agent/skills/pwa-development/SKILL.md`.

`src/features/README.md` holds the current feature map, state-ownership table and per-change checklist.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **Sport-Client** (2179 symbols, 4039 relationships, 177 execution flows).

> Index stale? Run `node .gitnexus/run.cjs analyze --index-only` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? Bootstrap with `npx`, `bunx`, or `pnpm dlx` — e.g. `bunx gitnexus@latest analyze` (npm 11 npx crash; #1939).

## Always Do

- **MUST run impact before editing.** Use `impact({target: "symbolName", direction: "upstream"})` or `node .gitnexus/run.cjs impact "symbolName" --direction upstream --repo .`; report callers, processes, and risk. Never substitute grep for graph analysis.
- **MUST analyze graph changes before committing.** Use `detect_changes({scope: "all"})` (MCP) or `node .gitnexus/run.cjs detect-changes --scope all --repo .` (CLI fallback). `partial: true` or `truncated: true` is not a clean check — a zero means unseen, not unaffected; re-run it. For regression review: `detect_changes({scope: "compare", base_ref: "main"})` or `node .gitnexus/run.cjs detect-changes --scope compare --base-ref "main" --repo .`.
- MUST warn on HIGH/CRITICAL `risk` pre-edit; never use `riskSharedAxes` to waive a HIGH/CRITICAL `risk` warning. Compare File/symbol: MCP File omits axes; Graph-RAG expands File.
- **MUST treat `risk: UNKNOWN` as unresolved, not as low.** An empty caller set is not evidence the symbol is unused — it can also mean the callers are not resolvable by the index (plain-object property access, dynamic dispatch, cross-language calls). `impact` pairs `UNKNOWN` with a `riskNote` saying so. Confirm with a text search before treating the symbol as safe to change or delete; do not proceed on the strength of a zero.
- **MUST use `query({search_query: "concept"})` for concepts/flows, `context({name: "symbolName"})` for a named symbol, or `impact` for blast radius, on read-only callers, dependencies, imports, or execution flow.** Graph first; text search only for empty/`UNKNOWN`/literals.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method before MCP/CLI impact analysis.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis, and never read `UNKNOWN` as an all-clear — it means the walk could not answer, which is the one verdict that requires confirming by other means.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit before MCP/CLI graph change analysis.

## Resources

| Resource | Use for |
| --- | --- |
| `gitnexus://repo/Sport-Client/context` | Codebase overview, check index freshness |
| `gitnexus://repo/Sport-Client/clusters` | All functional areas |
| `gitnexus://repo/Sport-Client/processes` | All execution flows |
| `gitnexus://repo/Sport-Client/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
| --- | --- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
