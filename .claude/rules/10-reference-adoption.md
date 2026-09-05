# Storefront reference adoption

Use `dragon-web-v2` as a pattern reference for foundation → shared → feature → widget composition, API boundary mapping, responsive skeletons, image handling, hooks and PWA lifecycle.

Adapt—not copy—the pattern to Next.js App Router. Public read pages remain server-first; client components own interaction only. Cache allowlists must distinguish immutable assets/public catalog from account, cart mutation, checkout and payment data. Redux owns customer workflow state, never a duplicate server cache.

Every journey must define online, loading, empty, error, offline and service-worker-update behavior before implementation.
