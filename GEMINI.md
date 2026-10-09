# GEMINI.md - Antigravity & Gemini AI Instructions

This file provides guidance for Antigravity (Google DeepMind AI Coding Assistant) and Gemini when working in this repository.

## Storefront Context & Instructions

Read `AGENTS.md` and task-relevant files under `.agent/rules/` and `.agent/skills/` before making changes to this repository. Do not import API or Admin rules into Storefront.

### Commands

```bash
yarn dev                 # Next dev server on :3000 (predev regenerates the SDK first)
yarn build && yarn start # production build / serve (prebuild regenerates the SDK first)
yarn lint                # prelint regenerates the SDK, then tsc --noEmit + ESLint
yarn test                # pretest regenerates the SDK, then vitest run --pool=threads
yarn verify              # lint + test + generate:api + build (full quality gate)

yarn contracts:sync      # pull Storefront OpenAPI slices
yarn generate:api         # clean + regenerate src/generated/api from contracts/ (orval)
```

### Architecture Overview

Next.js 15 App Router storefront + PWA. Canonical flow:
`src/app` route (server-first) → `src/features/<domain>` composition → narrow `'use client'` island → `src/generated/api` SDK → `src/lib/api/fetcher.ts` (Axios).

- **Rules & Skills:** Read `.agent/rules/RULE_INDEX.md` and load appropriate skills under `.agent/skills/`.
