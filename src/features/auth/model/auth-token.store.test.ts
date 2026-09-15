// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from '@/core/storage';
import { CookieKey } from '@/core/storage/constants';
import { CookieManager } from '@/core/storage/manager/cookie.manager';
import { isCustomerAuthenticated, readCustomerAuthTokens } from './auth-token.store';

describe('isCustomerAuthenticated', () => {
  beforeEach(() => {
    AuthService.clear();
  });

  /**
   * Hồi quy: hàm này từng xét riêng `accessToken`. Khi access token hết hạn trước
   * refresh token, khách bị coi là đã đăng xuất ở header, hồ sơ, đơn hàng và
   * checkout — dù phiên vẫn cứu được bằng refresh.
   */
  it('vẫn coi là đã đăng nhập khi access token hết hạn nhưng còn refresh token', () => {
    CookieManager.set(CookieKey.REFRESH_TOKEN, 'refresh-con-song');

    expect(isCustomerAuthenticated()).toBe(true);
    expect(readCustomerAuthTokens()?.refreshToken).toBe('refresh-con-song');
  });

  it('coi là chưa đăng nhập khi không còn cookie nào', () => {
    expect(isCustomerAuthenticated()).toBe(false);
  });

  it('coi là đã đăng nhập khi còn access token', () => {
    CookieManager.set(CookieKey.ACCESS_TOKEN, 'access-con-han');

    expect(isCustomerAuthenticated()).toBe(true);
  });
});
