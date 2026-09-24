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

  /**
   * Server chỉ đưa REFRESH token vào cookie HttpOnly; access token vẫn nằm trong response body và
   * mọi request được bảo vệ phải tự gắn nó vào header.
   *
   * Hồi quy: bản trước bỏ luôn cả cặp token khi chạy COOKIE, nên mỗi lời gọi đều đi không kèm
   * Bearer → 401 → xoay token → thử lại → access token mới lại bị bỏ. Hai vòng mạng và một lần
   * xoay refresh token cho MỌI request.
   */
  it('giữ access token để gắn vào header, nhưng không giữ refresh token', async () => {
    const store = await loadStore('COOKIE');
    store.saveCustomerAuthTokens(TOKENS);

    expect(store.readCustomerAuthTokens()?.accessToken).toBe('access');
    // SECURITY: refresh token thuộc về cookie HttpOnly của server.
    expect(store.readCustomerAuthTokens()?.refreshToken).toBeUndefined();
  });

  /** Không được nhầm access token đọc được thành "còn refresh credential". */
  it('có access token vẫn không coi là đọc được refresh token', async () => {
    const store = await loadStore('COOKIE');
    store.saveCustomerAuthTokens(TOKENS);
    window.localStorage.clear();

    expect(store.readCustomerAuthTokens()?.accessToken).toBe('access');
    expect(store.hasCustomerRefreshCredential()).toBe(false);
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
