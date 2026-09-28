# Storefront directory structure

- `src/app`: routes, layouts, metadata, manifest and route-level composition. `src/app/(storefront)/layout.tsx` renders `StorefrontLayout` exactly once for the storefront route group; page files stay thin (fetch + metadata + compose) and never re-render the shell.
- `src/features/<feature>`: commerce/content capability UI and orchestration. Current features: `auth`, `cart`, `catalog`, `checkout`, `content`, `home`, `orders`, `profile`, `promotions`, `returns`, `reviews`, `support`, plus `address` and `site-config`. Each feature exposes exactly one public surface, `features/<feature>/index.ts`; every cross-feature import (including from `widgets`) goes through that barrel, never a deep path.
- `src/layouts`: route shells only (compose `widgets`/`foundation`, no business logic); `src/widgets`: reusable, cross-route sections (`site-header`, `site-footer`, `floating-contact-bar`, `benefits-strip`, `newsletter-form`) that may use a feature's public barrel; `src/foundation`: low-level presentation, grouped `components/<category>/<component>/` with barrels (see `13-foundation-components.md`); `src/shared`: domain-neutral components/constants/format/hooks (never `@/generated`, never a specific feature's concern — see `14-shared-module.md`).
- `src/core`: hạ tầng trình duyệt dùng chung — `core/storage` (browser store, cookie manager) and `core/auth` (customer auth token store); feature không gọi `localStorage` trực tiếp và không tự giữ auth token.
- `src/app/store`: storefront Redux composition only (`store.ts`, `root.saga.ts`, `hooks.ts` forking/combining feature slices); the cart slice/saga and cart-hydration hook live in `features/cart` and are only forked/combined here.
- `src/lib`: framework and transport adapters — `lib/api` (fetcher, error message, constants, server proxy), `lib/query` (TanStack cache policy), `lib/seo` (page metadata helpers).
- `src/pwa`: client-side PWA utilities; the service worker entry remains in `public/sw.js`.
- `src/generated/api`: disposable Orval output; never hand edit.

Dependencies flow: `app -> layouts -> widgets -> features -> foundation/shared -> core/lib -> generated (types only for lib)`. `foundation` never imports `features`/`widgets`/`layouts`/`@/generated`. `shared` never imports `features`/`widgets`/`layouts`/`app`/`@/generated`. `core`/`lib` never import `features`/`widgets`/`layouts`/`app`/`foundation`/`shared` (type-only imports from `@/generated/api/*/*.schemas` are the sole exception, for the fetcher). Do not create a generic shared layer that mixes cart, customer, catalog and checkout policy.

## Feature → feature edges

Features are otherwise isolated. The only allowed cross-feature imports (always through the target feature's `index.ts` barrel) are:

| Feature | May depend on |
| --- | --- |
| every feature | `auth` (session), `cart` (cart actions/selectors) |
| `checkout` | `orders`, `address` |
| `orders` | `returns`, `reviews` |
| `home` | `catalog`, `content`, `reviews`, `promotions` |

No other feature imports another feature. `auth` and `cart` do not depend on any feature besides each other.

Preferred storefront flow, adapted from `dragon-web-v2` and `dragonx-employer-web` for Next.js:

`server-first route -> feature composition -> narrow client hook/island -> public generated SDK -> widget/foundation UI`.

Feature modules own API-to-view mapping and commerce decisions. Route files remain thin; generated code remains disposable transport code. Do not copy the reference Vite apps' global client-store flow into public Next.js routes.
