'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { hydrateCart } from '@/app/store/cart.slice';
import { readPersistedCart } from '@/app/store/root.saga';
import { storefrontStore } from '@/app/store/store';
import { readCustomerAuthTokens } from '@/features/auth';
import { PwaRegistration } from '@/pwa/pwa-registration';

import { GlobalToastProvider } from '@/shared/components/global-toast';

const CartHydrationContext = createContext(false);

export function useCartHydrated(): boolean {
  return useContext(CartHydrationContext);
}

function readAuthenticatedSubject(): string | undefined {
  const accessToken = readCustomerAuthTokens()?.accessToken;
  if (!accessToken) return undefined;
  try {
    const payload = accessToken.split('.')[1];
    if (!payload) return accessToken;
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(window.atob(normalizedPayload)) as { sub?: unknown };
    return typeof decoded.sub === 'string' ? decoded.sub : accessToken;
  } catch {
    // An opaque/future token format still gets isolated by its complete value.
    return accessToken;
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const [cartHydrated, setCartHydrated] = useState(false);
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } }),
  );

  useEffect(() => {
    storefrontStore.dispatch(hydrateCart(readPersistedCart()));
    setCartHydrated(true);
  }, []);

  useEffect(() => {
    let activeSubject = readAuthenticatedSubject();
    const isolateAuthenticatedCache = () => {
      const nextSubject = readAuthenticatedSubject();
      if (activeSubject && activeSubject !== nextSubject) {
        // SECURITY: mọi logout, token hết hạn hoặc đổi tài khoản phải xóa cache
        // cá nhân trước khi màn hình tiếp theo có thể đọc dữ liệu Order/Profile cũ.
        // Refresh token cùng subject không làm mất query đang hiển thị.
        queryClient.clear();
      }
      activeSubject = nextSubject;
    };
    window.addEventListener('dctd:auth-change', isolateAuthenticatedCache);
    window.addEventListener('storage', isolateAuthenticatedCache);
    return () => {
      window.removeEventListener('dctd:auth-change', isolateAuthenticatedCache);
      window.removeEventListener('storage', isolateAuthenticatedCache);
    };
  }, [queryClient]);

  return (
    <ReduxProvider store={storefrontStore}>
      <QueryClientProvider client={queryClient}>
        <CartHydrationContext.Provider value={cartHydrated}>
          <GlobalToastProvider>
            {children}
            <PwaRegistration />
          </GlobalToastProvider>
        </CartHydrationContext.Provider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
