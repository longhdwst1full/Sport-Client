import type { TokenPairDto } from '@/generated/api/auth/models';

const STORAGE_KEY = 'dctd.storefront.auth.v1';
const cookieTransport = process.env.NEXT_PUBLIC_AUTH_TOKEN_TRANSPORT === 'COOKIE';
let memoryTokens: TokenPairDto | undefined;

function storage(): Storage | undefined {
  return typeof window === 'undefined' ? undefined : window.sessionStorage;
}

export function saveCustomerAuthTokens(tokens: TokenPairDto): void {
  memoryTokens = tokens;
  if (!cookieTransport) {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(tokens));
    try {
      window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(tokens));
    } catch {
      // Ignore localStorage errors in private mode
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('dctd:auth-change'));
  }
}

export function readCustomerAuthTokens(): TokenPairDto | undefined {
  if (memoryTokens) return memoryTokens;
  if (cookieTransport) return undefined;
  const raw = storage()?.getItem(STORAGE_KEY) || (typeof window !== 'undefined' ? window.localStorage?.getItem(STORAGE_KEY) : null);
  if (!raw) return undefined;
  try {
    memoryTokens = JSON.parse(raw) as TokenPairDto;
    return memoryTokens;
  } catch {
    storage()?.removeItem(STORAGE_KEY);
    if (typeof window !== 'undefined') window.localStorage?.removeItem(STORAGE_KEY);
    return undefined;
  }
}

export function usesCustomerAuthCookieTransport(): boolean {
  return cookieTransport;
}

export function clearCustomerAuthTokens(): void {
  memoryTokens = undefined;
  storage()?.removeItem(STORAGE_KEY);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage?.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    window.dispatchEvent(new Event('dctd:auth-change'));
  }
}

export function isCustomerAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(readCustomerAuthTokens()?.accessToken);
}

