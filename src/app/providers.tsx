'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { hydrateCart, resetCartForSignOut } from '@/app/store/cart.slice';
import { readPersistedCart } from '@/app/store/root.saga';
import { storefrontStore } from '@/app/store/store';
import { readCustomerAuthTokens } from '@/features/auth';
import { isCustomerAuthenticated } from '@/features/auth/model/auth-token.store';
import { pullAccountCart } from '@/features/cart/api/cart-sync';
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
    // Đang đăng nhập: giỏ tài khoản là nguồn chung giữa các máy, nên thay giỏ local bằng giỏ server.
    // Lỗi mạng thì giữ giỏ local; checkout vẫn đồng bộ lại trước khi báo giá.
    if (isCustomerAuthenticated()) {
      pullAccountCart()
        .then((items) => storefrontStore.dispatch(hydrateCart(items)))
        .catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    let activeSubject = readAuthenticatedSubject();
    let wasAuthenticated = isCustomerAuthenticated();
    const isolateAuthenticatedCache = () => {
      const nextSubject = readAuthenticatedSubject();
      const nowAuthenticated = isCustomerAuthenticated();
      const signedOut = wasAuthenticated && !nowAuthenticated;
      const switchedAccount = Boolean(activeSubject && nextSubject && activeSubject !== nextSubject);
      if (activeSubject && activeSubject !== nextSubject) {
        // SECURITY: mọi logout, token hết hạn hoặc đổi tài khoản phải xóa cache
        // cá nhân trước khi màn hình tiếp theo có thể đọc dữ liệu Order/Profile cũ.
        // Refresh token cùng subject không làm mất query đang hiển thị.
        queryClient.clear();
      }
      if (signedOut || switchedAccount) {
        // SECURITY: giỏ trên máy lúc này là giỏ của tài khoản vừa rời đi; xoá để người dùng sau
        // (máy dùng chung) không thấy và không bị gộp nhầm vào tài khoản khác. Giỏ vẫn còn trên server.
        storefrontStore.dispatch(resetCartForSignOut());
      }
      activeSubject = nextSubject;
      wasAuthenticated = nowAuthenticated;
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
