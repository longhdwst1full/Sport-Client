import type { TokenPairDto } from '@/generated/api/auth/models';
import { AuthService } from '@/core/storage';

const cookieTransport = process.env.NEXT_PUBLIC_AUTH_TOKEN_TRANSPORT === 'COOKIE';

function notifyAuthChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('dctd:auth-change'));
  }
}

export function saveCustomerAuthTokens(tokens: TokenPairDto): void {
  // COOKIE transport: server đã set HttpOnly cookie, client không được giữ bản sao.
  if (!cookieTransport) AuthService.save(tokens);
  notifyAuthChange();
}

export function readCustomerAuthTokens(): TokenPairDto | undefined {
  if (cookieTransport) return undefined;
  return AuthService.read();
}

export function usesCustomerAuthCookieTransport(): boolean {
  return cookieTransport;
}

export function clearCustomerAuthTokens(): void {
  AuthService.clear();
  notifyAuthChange();
}

export function isCustomerAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  // Xét theo việc CÒN token hay không, không xét riêng access token: access hết hạn
  // trước refresh là đúng luồng, và fetcher tự xoay lại. Bám vào accessToken sẽ làm
  // khách trông như đã đăng xuất dù phiên vẫn cứu được.
  return Boolean(readCustomerAuthTokens());
}

/** Còn refresh token nghĩa là phiên vẫn cứu được, kể cả khi access token đã hết hạn. */
export function hasCustomerRefreshCredential(): boolean {
  if (typeof window === 'undefined') return false;
  return cookieTransport || Boolean(readCustomerAuthTokens()?.refreshToken);
}
