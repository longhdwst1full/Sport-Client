import { defineConfig } from 'orval';

const CONTRACT_BASE = './contracts/storefront';
const OUTPUT_BASE = './src/generated/api';

function operationOverrides(domain: string): Record<string, { requestOptions: boolean }> {
  if (domain === 'orders') {
    return {
      cancelGuestOrder: { requestOptions: true },
      cancelAccountOrder: { requestOptions: true },
    };
  }
  if (domain === 'payments') {
    return {
      submitGuestPaymentEvidence: { requestOptions: true },
      submitAccountPaymentEvidence: { requestOptions: true },
    };
  }
  return {};
}

function createDomainConfig(domain: string) {
  return {
    input: { target: `${CONTRACT_BASE}/${domain}.yaml` },
    output: {
      target: `${OUTPUT_BASE}/${domain}/${domain}.ts`,
      schemas: `${OUTPUT_BASE}/${domain}/models`,
      mode: 'single' as const,
      client: 'react-query' as const,
      clean: true,
      prettier: true,
      override: {
        mutator: { path: './src/lib/api/fetcher.ts', name: 'apiFetcher' },
        query: { useQuery: true, useMutation: true, signal: true },
        operations: operationOverrides(domain),
      },
    },
  };
}

export default defineConfig({
  auth: createDomainConfig('auth'),
  catalog: createDomainConfig('catalog'),
  content: createDomainConfig('content'),
  reviews: createDomainConfig('reviews'),
  cart: createDomainConfig('cart'),
  customer: createDomainConfig('customer'),
  shipping: createDomainConfig('shipping'),
  checkout: createDomainConfig('checkout'),
  orders: createDomainConfig('orders'),
  payments: createDomainConfig('payments'),
});
