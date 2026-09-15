import type { TokenPairDto } from '@/generated/api/auth/models';
import { CookieKey } from '../constants';
import { CookieManager } from '../manager/cookie.manager';

/**
 * Nguồn token duy nhất của Storefront — kế thừa `AuthService` của
 * `admin-client`/`dragon-web-v2`: memory trước, cookie làm lớp bền.
 *
 * Không dùng localStorage: cookie hết hạn theo `expiresIn` server trả về,
 * `SameSite=Lax` + `Secure` do `CookieManager` đặt sẵn.
 */
let memoryTokens: TokenPairDto | undefined;

const COOKIE_OPTS = { sameSite: 'Lax' as const };

export const AuthService = {
  read(): TokenPairDto | undefined {
    if (memoryTokens) return memoryTokens;
    const accessToken = CookieManager.get(CookieKey.ACCESS_TOKEN);
    const refreshToken = CookieManager.get(CookieKey.REFRESH_TOKEN) || undefined;
    // Cookie access token hết hạn trước refresh token là trạng thái BÌNH THƯỜNG:
    // access sống theo `expiresIn`, refresh là session cookie. Trả undefined ở đây
    // sẽ vứt mất refresh token còn dùng được và ép khách đăng nhập lại.
    if (!accessToken && !refreshToken) return undefined;
    // Phiên trước đã persist: dựng lại đủ dùng cho header + refresh.
    memoryTokens = {
      accessToken: accessToken ?? '',
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 0,
      mustChangePassword: false,
    };
    return memoryTokens;
  },

  save(tokens: TokenPairDto): void {
    memoryTokens = tokens;
    // Max-Age lấy từ `expiresIn` của server; refresh token sống lâu hơn access
    // token nên không gắn Max-Age của access cho nó.
    CookieManager.set(CookieKey.ACCESS_TOKEN, tokens.accessToken, {
      ...COOKIE_OPTS,
      seconds: tokens.expiresIn > 0 ? tokens.expiresIn : undefined,
    });
    if (tokens.refreshToken) {
      CookieManager.set(CookieKey.REFRESH_TOKEN, tokens.refreshToken, COOKIE_OPTS);
    }
  },

  clear(): void {
    memoryTokens = undefined;
    CookieManager.remove(CookieKey.ACCESS_TOKEN, COOKIE_OPTS);
    CookieManager.remove(CookieKey.REFRESH_TOKEN, COOKIE_OPTS);
  },

  getAccessToken(): string | undefined {
    // Chuỗi rỗng nghĩa là access token đã hết hạn nhưng refresh vẫn còn.
    return this.read()?.accessToken || undefined;
  },
};
