import type { TokenPairDto } from '@/generated/api/auth/auth.schemas';
import { CookieKey } from '../constants';
import { CookieManager } from '../manager/cookie.manager';

/**
 * Nguồn token duy nhất của Storefront — kế thừa `AuthService` của
 * `admin-client`/`dragon-web-v2`. Trên trình duyệt cookie là nguồn sự thật (đọc lại mỗi lần để
 * đồng bộ giữa các tab); memory chỉ là cache khớp cookie và là nguồn duy nhất ngoài trình duyệt.
 *
 * Không dùng localStorage: cookie hết hạn theo `expiresIn` server trả về,
 * `SameSite=Lax` + `Secure` do `CookieManager` đặt sẵn.
 */
let memoryTokens: TokenPairDto | undefined;

const COOKIE_OPTS = { sameSite: 'Lax' as const };

export const AuthService = {
  read(): TokenPairDto | undefined {
    // Ngoài trình duyệt (SSR/test node) không có cookie: memory là nguồn duy nhất.
    if (typeof document === 'undefined') return memoryTokens;
    // SECURITY: trên trình duyệt cookie là nguồn sự thật và được đọc lại MỖI lần. Cookie dùng chung
    // mọi tab; cache memory vĩnh viễn làm tab B giữ refresh token mà tab A đã xoay (dùng-một-lần)
    // ⇒ lần refresh kế của tab B bị API coi là reuse và đăng xuất khách.
    const accessToken = CookieManager.get(CookieKey.ACCESS_TOKEN);
    const refreshToken = CookieManager.get(CookieKey.REFRESH_TOKEN) || undefined;
    // Cookie access token hết hạn trước refresh token là trạng thái BÌNH THƯỜNG:
    // access sống theo `expiresIn`, refresh là session cookie. Trả undefined ở đây
    // sẽ vứt mất refresh token còn dùng được và ép khách đăng nhập lại.
    if (!accessToken && !refreshToken) {
      memoryTokens = undefined;
      return undefined;
    }
    // Memory chỉ còn giá trị khi khớp cookie (giữ `expiresIn`… của lần save gần nhất ở tab này).
    if (memoryTokens?.accessToken === accessToken && memoryTokens.refreshToken === refreshToken) {
      return memoryTokens;
    }
    // Phiên trước đã persist hoặc tab khác vừa ghi token mới: dựng lại đủ dùng cho header + refresh.
    memoryTokens = {
      accessToken,
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
