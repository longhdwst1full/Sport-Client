# RULE-PWA-04: Worker allowlist v4 lives in `public/sw-routing.js`

## Context
Cache/PWA optimisation (2026-09-27) expanded the worker beyond the set named in
`03-pwa-security-caching.md` ("allowlists `/`, `/_next/static/*`, `/icon.svg`, `/manifest.webmanifest`")
and moved every routing decision into pure, unit-tested functions. The rule text is now stale, and its
"activation cleanup is a known gap" note no longer applies (cleanup is prefix- and version-scoped).

## Rule
❌ Add a `caches.put` branch directly in `public/sw.js` for a new path.
✅ Add the path to `public/sw-routing.js` (`PUBLIC_NAV_*` / `API_SWR_PATTERNS`), add a case to
`src/pwa/sw-routing.test.ts`, bump `CACHE_VERSION`. Sensitive API families (`SENSITIVE_API_PATTERN`)
and any request with `Authorization` stay BYPASS; public API SWR entries are capped by `API_SWR_FRESH_MS`.

## Target
Merge into: .agent/rules/03-pwa-security-caching.md (replace the "current worker allowlists" and
"known gap" bullets; mirror to .claude/rules/).
