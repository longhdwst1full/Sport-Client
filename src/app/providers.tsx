'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { hydrateCart } from '@/app/store/cart.slice';
import { readPersistedCart } from '@/app/store/root.saga';
import { storefrontStore } from '@/app/store/store';
import { PwaRegistration } from '@/pwa/pwa-registration';

import { GlobalToastProvider } from '@/shared/components/global-toast';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } }),
  );

  useEffect(() => {
    storefrontStore.dispatch(hydrateCart(readPersistedCart()));
  }, []);

  return (
    <ReduxProvider store={storefrontStore}>
      <QueryClientProvider client={queryClient}>
        <GlobalToastProvider>
          {children}
          <PwaRegistration />
        </GlobalToastProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
