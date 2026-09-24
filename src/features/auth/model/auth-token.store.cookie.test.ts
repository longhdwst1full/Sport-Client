// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TokenPairDto } from '@/generated/api/auth/models';

/**
 * Hành vi ở transport COOKIE.
 *
 * `.env.local` và `.env.production` đều đặt `NEXT_PUBLIC_AUTH_TOKEN_TRANSPORT=COOKIE`, nên đây là
 * đường chạy thật của khách — không phải một nhánh dự phòng.
 */
const TOKENS: TokenPairDto = {
  accessToken: 'access',
  refreshToken: 'refresh',
  tokenType: 'Bearer',
  expiresIn: 900,
  mustChangePassword: false,
};

async function loadStore(transport: 'COOKIE' | 'BODY') {
  vi.resetModules();
  process.env.NEXT_PUBLIC_AUTH_TOKEN_TRANSPORT = transport;
  return import('./auth-token.store');
}

const originalTransport = process.env.NEXT_PUBLIC_AUTH_TOKEN_TRANSPORT;

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  process.env.NEXT_PUBLIC_AUTH_TOKEN_TRANSPORT = originalTransport;
  window.localStorage.clear();
});

describe('auth store — transport COOKIE', () => {
  /**
   * Hồi quy: `isCustomerAuthenticated` từng trả `Boolean(readCustomerAuthTokens())`, mà hàm đó
   * luôn trả `undefined` ở chế độ COOKIE. Hậu quả: khách đăng nhập thành công nhưng giao diện coi
   * như chưa đăng nhập — header hiện nút đăng nhập, `/profile` đá ngược về `/login`, và lời gọi
   * lấy hồ sơ không bao giờ chạy vì bị chặn bởi chính cờ này.
   */
  it('đăng nhập xong thì coi là đã đăng nhập', async () => {
    const store = await loadStore('COOKIE');

    expect(store.isCustomerAuthenticated()).toBe(false);
    store.saveCustomerAuthTokens(TOKENS);

    expect(store.isCustomerAuthenticated()).toBe(true);
  });

  /** Token nằm trong cookie HttpOnly: JavaScript không được giữ bản sao. */
  it('không giữ bản sao token trong JavaScript', async () => {
    const store = await loadStore('COOKIE');
    store.saveCustomerAuthTokens(TOKENS);

    expect(store.readCustomerAuthTokens()).toBeUndefined();
  });

  it('đăng xuất thì trở lại chưa đăng nhập', async () => {
    const store = await loadStore('COOKIE');
    store.saveCustomerAuthTokens(TOKENS);

    store.clearCustomerAuthTokens();

    expect(store.isCustomerAuthenticated()).toBe(false);
  });

  /**
   * Khách vãng lai gặp 401 ở trang công khai KHÔNG được kéo theo một lời gọi `/auth/refresh`.
   * Bản trước trả `true` vô điều kiện ở chế độ COOKIE nên mọi 401 đều sinh thêm một request thừa.
   */
  it('chưa đăng nhập thì không coi là còn phiên cứu được', async () => {
    const store = await loadStore('COOKIE');

    expect(store.hasCustomerRefreshCredential()).toBe(false);

    store.saveCustomerAuthTokens(TOKENS);
    expect(store.hasCustomerRefreshCredential()).toBe(true);
  });

  it('lưu trữ bị chặn thì coi như chưa đăng nhập, không ném lỗi', async () => {
    const store = await loadStore('COOKIE');
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('storage disabled');
      });

    expect(() => store.saveCustomerAuthTokens(TOKENS)).not.toThrow();
    setItem.mockRestore();

    expect(store.isCustomerAuthenticated()).toBe(false);
  });
});

describe('auth store — transport BODY', () => {
  it('vẫn xét theo token đọc được, không phụ thuộc cờ phiên', async () => {
    const store = await loadStore('BODY');
    store.saveCustomerAuthTokens(TOKENS);

    expect(store.readCustomerAuthTokens()?.refreshToken).toBe('refresh');
    expect(store.isCustomerAuthenticated()).toBe(true);

    store.clearCustomerAuthTokens();
    expect(store.isCustomerAuthenticated()).toBe(false);
  });
});
