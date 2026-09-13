# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Storefront context

Read `AGENTS.md` and the task-relevant files under `.agent/rules` and `.agent/skills` before changing this repository. Do not import API or Admin rules.

## Commands

```bash
yarn dev                 # Next dev server on :3000
yarn build && yarn start # production build / serve (required before handoff)
yarn lint                # type-check only (tsc --noEmit); there is no ESLint step
yarn test                # vitest run --pool=threads
yarn verify              # lint + test + generate:api + build (full quality gate)

yarn contracts:sync      # pull Storefront OpenAPI slices into contracts/storefront/*.yaml
yarn generate:api        # clean + regenerate src/generated/api from those contracts
```

Single test: `yarn vitest run src/app/store/cart.slice.test.ts` (add `-t "name"` for one case).
Tests live next to the code (`*.test.ts`), currently transport + Redux cart/saga.

Node >= 22, Yarn 1 (`yarn add <pkg>` from this repo only — it deploys independently).

## Architecture

Next.js 15 App Router storefront + PWA. Canonical flow:

`src/app` route (server-first) → `src/features/<domain>` composition → narrow `'use client'` island → `src/generated/api` SDK → `src/lib/api/fetcher.ts` (Axios).

- **Generated SDK per domain.** `orval.config.ts` builds one isolated client+models folder per business domain (auth, catalog, content, reviews, cart, customer, shipping, checkout, orders, payments) from `contracts/storefront/<domain>.yaml`. All of `src/generated/api` is disposable — never hand-edit; regenerate when the contract changes. Some operations opt into `requestOptions: true` (cancel order, submit payment evidence) so callers can pass per-request config.
- **Transport.** `apiFetcher` in `src/lib/api/fetcher.ts` is the single Orval mutator: base URL from `NEXT_PUBLIC_API_URL`, `withCredentials`, bearer header from `features/auth/auth-token.store`, a de-duplicated refresh-token rotation on 401 (skipped for `/auth/` endpoints), and `ApiError(status, payload)` normalization. It owns no endpoint path or DTO.
- **State ownership.** TanStack Query (configured in `src/app/providers.tsx`, `staleTime` 30s, `retry` 1) owns remote state; Redux Toolkit + Saga (`src/app/store`) owns only the interactive cart — `cart.slice.ts` plus `root.saga.ts` persistence/hydration. Never mirror an API payload into both. `Providers` also clears the query cache when the authenticated subject changes (logout/account switch) so personalized data cannot leak between sessions.
- **Layers.** `src/layouts` route shells, `src/widgets` cross-route sections, `src/foundation` low-level presentation, `src/shared` domain-neutral utilities, `src/components` legacy leaf components (no new feature orchestration), `src/lib` framework/transport adapters.
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
