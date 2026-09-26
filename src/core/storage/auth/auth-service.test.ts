// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from './auth-service';
import { CookieKey } from '../constants';
import { CookieManager } from '../manager/cookie.manager';

const tokens = {
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
  tokenType: 'Bearer',
  expiresIn: 900,
  mustChangePassword: false,
};

describe('AuthService', () => {
  beforeEach(() => {
    AuthService.clear();
  });

  it('persists tokens to cookies, never to web storage', () => {
    AuthService.save(tokens);

    expect(CookieManager.get(CookieKey.ACCESS_TOKEN)).toBe('access-1');
    expect(CookieManager.get(CookieKey.REFRESH_TOKEN)).toBe('refresh-1');
    expect(window.localStorage.getItem(CookieKey.ACCESS_TOKEN)).toBeNull();
    expect(window.sessionStorage.getItem(CookieKey.ACCESS_TOKEN)).toBeNull();
  });

  it('rehydrates from cookie when memory is empty', () => {
    CookieManager.set(CookieKey.ACCESS_TOKEN, 'from-cookie');

    expect(AuthService.getAccessToken()).toBe('from-cookie');
  });

  /**
   * Hồi quy: cookie access token hết hạn theo `expiresIn`, còn refresh token là
   * session cookie nên sống lâu hơn. `read()` từng trả undefined ngay khi thiếu
   * access token, làm mất refresh token còn dùng được.
   */
  it('vẫn trả refresh token khi access token đã hết hạn', () => {
    CookieManager.set(CookieKey.REFRESH_TOKEN, 'refresh-con-song');

    expect(AuthService.getAccessToken()).toBeUndefined();
    expect(AuthService.read()?.refreshToken).toBe('refresh-con-song');
  });

  it('chỉ coi là chưa đăng nhập khi mất cả hai cookie', () => {
    expect(AuthService.read()).toBeUndefined();
  });

  it('clears both cookies on logout', () => {
    AuthService.save(tokens);
    AuthService.clear();

    expect(AuthService.read()).toBeUndefined();
    expect(CookieManager.get(CookieKey.REFRESH_TOKEN)).toBe('');
  });

  /**
   * Hồi quy: `read()` từng trả bản memory mãi mãi. Tab A xoay refresh token (dùng-một-lần) và ghi
   * cookie mới, nhưng tab B vẫn gửi refresh token cũ ⇒ API báo reuse và đăng xuất khách.
   */
  it('đọc lại cookie khi tab khác đã ghi token mới', () => {
    AuthService.save(tokens);
    CookieManager.set(CookieKey.ACCESS_TOKEN, 'access-2');
    CookieManager.set(CookieKey.REFRESH_TOKEN, 'refresh-2');

    expect(AuthService.read()?.accessToken).toBe('access-2');
    expect(AuthService.read()?.refreshToken).toBe('refresh-2');
  });

  it('coi là đăng xuất khi tab khác đã xoá cookie', () => {
    AuthService.save(tokens);
    CookieManager.remove(CookieKey.ACCESS_TOKEN);
    CookieManager.remove(CookieKey.REFRESH_TOKEN);

    expect(AuthService.read()).toBeUndefined();
  });
});
