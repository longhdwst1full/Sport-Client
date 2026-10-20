# Storefront client instructions

Scope: this Storefront repository only. Do not load Admin Ant Design rules or backend module rules for ordinary Storefront work.

## Stack and boundaries

- Next.js App Router, React 19, Tailwind, TanStack Query, Axios, Redux Toolkit/Saga and a security-conscious PWA layer.
- Prefer server components for public read rendering; add client boundaries only for interaction, browser APIs or client-side query behavior.
- TanStack Query owns server state; Redux owns interactive cart/checkout workflow state and must not become a second API cache.
- Consume HTTP contracts only from `src/generated/api`. Never import from `admin/` or `api/src`.
- Add dependencies from this repository with `yarn add <package>` (or `--dev`); keep this app independently deployable.

## Required routing

- Read `.agent/rules/RULE_INDEX.md` first; it maps each task type to the exact rules to load.
- Unfamiliar code, rendering/PWA flow search or impact analysis: read `.agent/skills/storefront-codebase-navigation/SKILL.md` first.
- New/changed storefront feature: read `.agent/skills/storefront-feature-development/SKILL.md`.
- API integration or SDK regeneration: read `.agent/skills/client-api-integration/SKILL.md`.
- Service worker, offline, install or update work: read `.agent/skills/pwa-development/SKILL.md`.
- Review/handoff: read `.agent/skills/client-quality-review/SKILL.md`.
- Apply all relevant files in `.agent/rules/`; these rules are local to client.

## Quality gate

Run from the Storefront repository root:

```bash
yarn lint
yarn test
yarn generate:api
yarn build
```

Never manually edit `src/generated/api`.
Run SDK generation when the OpenAPI contract changes; ordinary UI-only changes do not require regeneration.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **Sport-Client** (3308 symbols, 8063 relationships, 249 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/Sport-Client/context` | Codebase overview, check index freshness |
| `gitnexus://repo/Sport-Client/clusters` | All functional areas |
| `gitnexus://repo/Sport-Client/processes` | All execution flows |
| `gitnexus://repo/Sport-Client/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
