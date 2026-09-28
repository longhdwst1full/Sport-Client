// Import-boundary lint only. Style/correctness rules stay with `tsc` and review; enabling a broad preset here
// would force unrelated edits. Layer and feature-edge rules mirror CLAUDE.md and .claude/rules/00-directory-structure.md.
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

// Every feature may depend on the session (`auth`) and cart kernels; other edges are the approved matrix.
const KERNEL = ['auth', 'cart'];
const FEATURE_EDGES = {
  address: [],
  auth: [],
  cart: [],
  catalog: [],
  checkout: ['orders', 'address'],
  content: [],
  home: ['catalog', 'content', 'reviews', 'promotions'],
  orders: ['returns', 'reviews'],
  profile: [],
  promotions: [],
  returns: [],
  reviews: [],
  'site-config': [],
  support: [],
};

// Redux composition lives in app/store: the cart slice/saga reads the store types and dispatch hooks, and
// auth merges the guest cart into the store after login. No other feature may import from src/app.
const APP_STORE_ACCESS = {
  auth: ['./store/store.ts'],
  cart: ['./store/hooks.ts', './store/store.ts'],
};

/**
 * Builds the full zone list. `allow` loosens exactly one boundary for the files of an override below, so a
 * pre-existing exception does not switch off every other layer check for that file.
 */
function zones(allow = {}) {
  const extraEdges = allow.featureEdges ?? {};
  const featureZones = Object.entries(FEATURE_EDGES).map(([name, deps]) => {
    const allowed = [...new Set([name, ...KERNEL, ...deps, ...(extraEdges[name] ?? [])])];
    return {
      target: `./src/features/${name}`,
      from: './src/features',
      except: allowed.map((dep) => `./${dep}`),
      message: `features/${name} may only depend on: ${allowed.filter((dep) => dep !== name).join(', ')} (through the barrel).`,
    };
  });
  const featureAppZones = Object.keys(FEATURE_EDGES).map((name) => ({
    target: `./src/features/${name}`,
    from: './src/app',
    except: APP_STORE_ACCESS[name] ?? [],
    message: 'features must not import src/app (only cart/auth reach the Redux store composition).',
  }));
  const featureUpperLayers = [
    ...(allow.featureToLayouts ? [] : ['./src/layouts']),
    ...(allow.featureToWidgets ? [] : ['./src/widgets']),
  ];

  return [
    {
      target: './src/foundation',
      from: './src',
      except: ['./foundation'],
      message: 'foundation imports only foundation and UI libraries.',
    },
    {
      target: './src/shared',
      from: ['./src/app', './src/layouts', './src/widgets', './src/features', './src/generated'],
      message: 'shared must stay domain-neutral.',
    },
    {
      target: ['./src/core', './src/lib'],
      from: ['./src/app', './src/layouts', './src/widgets', './src/features', './src/foundation'],
      message: 'core/lib must not import upper layers.',
    },
    { target: './src/core', from: './src/shared', message: 'core must not import shared.' },
    {
      // lib/seo reads the single public-origin constant; nothing else in shared is reachable from lib.
      target: './src/lib',
      from: './src/shared',
      except: ['./constants/site.ts'],
      message: 'lib may only import shared/constants/site.ts.',
    },
    {
      target: './src/layouts',
      from: ['./src/app', './src/features', './src/generated'],
      message: 'layouts compose widgets/foundation only.',
    },
    {
      target: './src/widgets',
      from: ['./src/app', './src/layouts', ...(allow.widgetToGenerated ? [] : ['./src/generated'])],
      message: 'widgets use feature barrels, never app/layouts or the generated SDK directly.',
    },
    ...(featureUpperLayers.length
      ? [{ target: './src/features', from: featureUpperLayers, message: 'features must not import layouts/widgets.' }]
      : []),
    ...featureAppZones,
    ...featureZones,
  ];
}

const restrictedPaths = (allow) => ['error', { zones: zones(allow) }];

/**
 * Pre-existing boundary exceptions, each scoped to the files that need it. Removing an entry is the goal:
 * fix the import, delete the override, and the base rule covers the file again.
 */
const EXCEPTIONS = [
  {
    // Product detail composes the reviews section directly; moving it to the route changes page composition.
    files: ['src/features/catalog/pages/product-detail-page.tsx'],
    allow: { featureEdges: { catalog: ['reviews'] } },
  },
  {
    // The catalog listing embeds the flash-sale strip; moving it to the route changes the page composition.
    files: ['src/features/catalog/pages/products-page.tsx'],
    allow: { featureEdges: { catalog: ['promotions'] } },
  },
  {
    // Search and home embed widgets inside their own layout (search box, benefits strip) rather than at the
    // edge of the page, so hoisting them into the route is a markup change.
    files: ['src/features/catalog/pages/search-page.tsx', 'src/features/home/pages/home-page.tsx'],
    allow: { featureToWidgets: true },
  },
  {
    // Free-delivery radius is an Admin-configured public parameter read client-side while the form is open.
    files: ['src/features/checkout/pages/checkout-page.tsx'],
    allow: { featureEdges: { checkout: ['site-config'] } },
  },
  {
    // The address book reuses the shared Vietnam address selector/types that features/address was created for.
    files: [
      'src/features/profile/components/address-form-dialog.tsx',
      'src/features/profile/hooks/use-address-book.ts',
      'src/features/profile/model/address.mapper.ts',
    ],
    allow: { featureEdges: { profile: ['address'] } },
  },
  {
    // The header's profile query has its own options (enabled after mount, default retry); switching to the
    // auth feature's profile observer changes retry/staleness behaviour, so it is left until done deliberately.
    files: ['src/widgets/site-header/site-header.tsx'],
    allow: { widgetToGenerated: true },
  },
];

export default [
  { ignores: ['.next/**', 'node_modules/**', 'src/generated/**', 'public/**', 'e2e/**', 'contracts/**'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // react-hooks is registered with no rules enabled only so existing `eslint-disable ... react-hooks/*`
    // directives resolve; they are not reported as unused because the rule is intentionally off here.
    plugins: { import: importPlugin, 'react-hooks': reactHooks },
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    settings: {
      'import/resolver': { typescript: { project: './tsconfig.json' } },
    },
    rules: {
      'import/no-restricted-paths': restrictedPaths(),
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@/features/*/*'], message: 'Import another feature only through its public barrel: @/features/<name>.' },
          { group: ['@/components', '@/components/*'], message: 'src/components is retired.' },
        ],
      }],
    },
  },
  ...EXCEPTIONS.map(({ files, allow }) => ({ files, rules: { 'import/no-restricted-paths': restrictedPaths(allow) } })),
  {
    // Store composition imports the cart slice/saga modules directly: the cart barrel re-exports hooks that
    // import app/store/hooks, so going through the barrel here would create an import cycle.
    files: ['src/app/store/store.ts', 'src/app/store/root.saga.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    // The catalog barrel is imported by the site header; exporting ProductDetailPage (which imports the
    // storefront layout -> header) from it would create a cycle, so the route imports the page module directly.
    files: ['src/app/(storefront)/products/[[]slug]/page.tsx'],
    rules: { 'no-restricted-imports': 'off' },
  },
];
