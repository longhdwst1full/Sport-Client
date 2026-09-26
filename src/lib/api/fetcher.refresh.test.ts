// @vitest-environment jsdom
import { AxiosError, type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TokenPairDto } from '@/generated/api/auth/auth.schemas';
import { AUTH_REFRESH_LOCK_NAME, AUTH_REFRESH_PATH, AuthRefreshErrorCode } from './constants';

/**
 * Xoay token trong `apiFetcher` ở transport BODY (refresh token JS đọc được), jsdom chạy tại
 * `http://localhost` — đúng môi trường local dev/E2E nơi lỗi cross-origin từng xảy ra.
 */
const SESSION_HINT_KEY = 'dctd.customer-session';

function tokens(access: string, refresh: string): TokenPairDto {
  return { accessToken: access, refreshToken: refresh, tokenType: 'Bearer', expiresIn: 900, mustChangePassword: false };
}

function respond(config: InternalAxiosRequestConfig, status: number, data: unknown): AxiosResponse {
  const response: AxiosResponse = { config, data, headers: {}, status, statusText: String(status) };
  if (status >= 400) {
    throw new AxiosError(`status ${status}`, AxiosError.ERR_BAD_REQUEST, config, null, response);
  }
  return response;
}

function bearer(config: InternalAxiosRequestConfig): string | undefined {
  const value = config.headers?.Authorization;
  return typeof value === 'string' ? value.replace(/^Bearer /, '') : undefined;
}

type RefreshReply = (config: InternalAxiosRequestConfig) => AxiosResponse | Promise<AxiosResponse>;

async function setup(refreshReplies: RefreshReply[]) {
  vi.resetModules();
  process.env.NEXT_PUBLIC_AUTH_TOKEN_TRANSPORT = 'BODY';
  const fetcher = await import('./fetcher');
  const store = await import('@/features/auth/model/auth-token.store');

  const refreshCalls: InternalAxiosRequestConfig[] = [];
  const resourceCalls: InternalAxiosRequestConfig[] = [];
  let validAccess = 'access-2';
  let onResource: ((config: InternalAxiosRequestConfig) => void) | undefined;

  const adapter: AxiosAdapter = async (config) => {
    if (config.url === AUTH_REFRESH_PATH) {
      refreshCalls.push(config);
      const reply = refreshReplies[refreshCalls.length - 1];
      if (!reply) throw new Error('unexpected refresh call');
      return reply(config);
    }
    resourceCalls.push(config);
    onResource?.(config);
    return bearer(config) === validAccess
      ? respond(config, 200, { ok: true })
      : respond(config, 401, { code: 'UNAUTHORIZED' });
  };
  fetcher.apiClient.defaults.adapter = adapter;

  return {
    fetcher,
    store,
    refreshCalls,
    resourceCalls,
    setValidAccess: (value: string) => {
      validAccess = value;
    },
    setOnResource: (fn: (config: InternalAxiosRequestConfig) => void) => {
      onResource = fn;
    },
    get: () => fetcher.apiFetcher<{ ok: boolean }>({ url: '/api/v1/account/orders', method: 'GET' }),
  };
}

const okRefresh: RefreshReply = (config) => respond(config, 200, tokens('access-2', 'refresh-2'));

const originalTransport = process.env.NEXT_PUBLIC_AUTH_TOKEN_TRANSPORT;

beforeEach(() => {
  window.localStorage.clear();
  document.cookie.split(';').forEach((part) => {
    const name = part.split('=')[0]?.trim();
    if (name) document.cookie = `${name}=; Path=/; Max-Age=0`;
  });
});

afterEach(() => {
  process.env.NEXT_PUBLIC_AUTH_TOKEN_TRANSPORT = originalTransport;
  vi.unstubAllGlobals();
});

describe('apiFetcher — xoay token khi 401', () => {
  it('N request 401 song song chỉ gây đúng một lần refresh', async () => {
    const ctx = await setup([
      async (config) => {
        await new Promise((resolve) => setTimeout(resolve, 20));
        return okRefresh(config);
      },
    ]);
    ctx.store.saveCustomerAuthTokens(tokens('access-1', 'refresh-1'));

    const results = await Promise.all([ctx.get(), ctx.get(), ctx.get()]);

    expect(results).toEqual([{ ok: true }, { ok: true }, { ok: true }]);
    expect(ctx.refreshCalls).toHaveLength(1);
    expect(ctx.refreshCalls[0]?.data).toBe(JSON.stringify({ refreshToken: 'refresh-1' }));
    expect(ctx.store.readCustomerAuthTokens()?.refreshToken).toBe('refresh-2');
  });

  it('refresh đi same-origin (baseURL rỗng) trên localhost như request thường', async () => {
    const ctx = await setup([okRefresh]);
    ctx.store.saveCustomerAuthTokens(tokens('access-1', 'refresh-1'));

    await ctx.get();

    expect(window.location.hostname).toBe('localhost');
    expect(ctx.refreshCalls[0]?.baseURL).toBe('');
    expect(ctx.refreshCalls[0]?.withCredentials).toBe(true);
    expect(ctx.resourceCalls.every((config) => config.baseURL === '')).toBe(true);
  });

  it('401 mà token hiện tại đã mới hơn (tab khác vừa xoay) ⇒ thử lại bằng token đó, không refresh', async () => {
    const ctx = await setup([]);
    ctx.store.saveCustomerAuthTokens(tokens('access-1', 'refresh-1'));
    ctx.setOnResource((config) => {
      // Mô phỏng tab khác ghi cookie mới trong lúc request này đang bay với token cũ.
      if (bearer(config) === 'access-1') ctx.store.saveCustomerAuthTokens(tokens('access-2', 'refresh-2'));
    });

    await expect(ctx.get()).resolves.toEqual({ ok: true });

    expect(ctx.refreshCalls).toHaveLength(0);
    expect(ctx.resourceCalls.map(bearer)).toEqual(['access-1', 'access-2']);
  });

  it.each([
    AuthRefreshErrorCode.INVALID,
    AuthRefreshErrorCode.REUSED,
    AuthRefreshErrorCode.MISSING,
    AuthRefreshErrorCode.LEGACY_UNAUTHORIZED,
  ])('refresh 401 %s ⇒ xoá token + cờ phiên và trả 401 gốc', async (code) => {
    const ctx = await setup([(config) => respond(config, 401, { code })]);
    ctx.store.saveCustomerAuthTokens(tokens('access-1', 'refresh-1'));

    const error = await ctx.get().catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ctx.fetcher.ApiError);
    expect((error as InstanceType<typeof ctx.fetcher.ApiError>).status).toBe(401);
    expect(ctx.store.readCustomerAuthTokens()).toBeUndefined();
    expect(window.localStorage.getItem(SESSION_HINT_KEY)).toBeNull();
  });

  it.each([500, 503, 429])('refresh %i ⇒ giữ phiên, trả lỗi refresh dạng ApiError', async (status) => {
    const ctx = await setup([(config) => respond(config, status, { code: 'INTERNAL_ERROR' })]);
    ctx.store.saveCustomerAuthTokens(tokens('access-1', 'refresh-1'));

    const error = await ctx.get().catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ctx.fetcher.ApiError);
    expect((error as InstanceType<typeof ctx.fetcher.ApiError>).status).toBe(status);
    expect(ctx.store.readCustomerAuthTokens()?.refreshToken).toBe('refresh-1');
    expect(window.localStorage.getItem(SESSION_HINT_KEY)).toBe('1');
  });

  it('refresh lỗi mạng ⇒ giữ phiên, trả ApiError status 0', async () => {
    const ctx = await setup([
      (config) => {
        throw new AxiosError('Network Error', AxiosError.ERR_NETWORK, config);
      },
    ]);
    ctx.store.saveCustomerAuthTokens(tokens('access-1', 'refresh-1'));

    const error = await ctx.get().catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ctx.fetcher.ApiError);
    expect((error as InstanceType<typeof ctx.fetcher.ApiError>).status).toBe(0);
    expect(ctx.store.readCustomerAuthTokens()?.refreshToken).toBe('refresh-1');
    expect(ctx.store.isCustomerAuthenticated()).toBe(true);
  });

  it('refresh 409 AUTH_REFRESH_CONFLICT ⇒ thử lại đúng một lần rồi thành công', async () => {
    const ctx = await setup([
      (config) => respond(config, 409, { code: AuthRefreshErrorCode.CONFLICT }),
      okRefresh,
    ]);
    ctx.store.saveCustomerAuthTokens(tokens('access-1', 'refresh-1'));

    await expect(ctx.get()).resolves.toEqual({ ok: true });
    expect(ctx.refreshCalls).toHaveLength(2);
  });

  it('refresh 409 hai lần ⇒ dừng sau một lần thử lại, giữ phiên', async () => {
    const conflict: RefreshReply = (config) => respond(config, 409, { code: AuthRefreshErrorCode.CONFLICT });
    const ctx = await setup([conflict, conflict]);
    ctx.store.saveCustomerAuthTokens(tokens('access-1', 'refresh-1'));

    const error = await ctx.get().catch((reason: unknown) => reason);

    expect((error as InstanceType<typeof ctx.fetcher.ApiError>).status).toBe(409);
    expect(ctx.refreshCalls).toHaveLength(2);
    expect(ctx.store.readCustomerAuthTokens()?.refreshToken).toBe('refresh-1');
  });

  it('lỗi của request thử lại cũng được chuẩn hoá thành ApiError', async () => {
    const ctx = await setup([okRefresh]);
    ctx.store.saveCustomerAuthTokens(tokens('access-1', 'refresh-1'));
    ctx.setValidAccess('never-valid');
    ctx.setOnResource((config) => {
      if (bearer(config) === 'access-2') respond(config, 500, { code: 'INTERNAL_ERROR' });
    });

    const error = await ctx.get().catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ctx.fetcher.ApiError);
    expect((error as InstanceType<typeof ctx.fetcher.ApiError>).status).toBe(500);
  });

  it('dùng Web Lock chéo tab khi trình duyệt hỗ trợ', async () => {
    const request = vi.fn((_name: string, _options: unknown, callback: () => Promise<unknown>) => callback());
    vi.stubGlobal('navigator', { ...window.navigator, locks: { request } });
    const ctx = await setup([okRefresh]);
    ctx.store.saveCustomerAuthTokens(tokens('access-1', 'refresh-1'));

    await Promise.all([ctx.get(), ctx.get()]);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0]?.[0]).toBe(AUTH_REFRESH_LOCK_NAME);
    expect(ctx.refreshCalls).toHaveLength(1);
  });

  it('chờ lock xong mà tab khác đã xoay ⇒ dùng token mới, không gọi refresh', async () => {
    let storeRef: Awaited<ReturnType<typeof setup>>['store'] | undefined;
    const request = vi.fn(async (_name: string, _options: unknown, callback: () => Promise<unknown>) => {
      // Tab giữ lock trước đã xoay xong và ghi cookie mới trước khi lock nhường cho tab này.
      storeRef?.saveCustomerAuthTokens(tokens('access-2', 'refresh-2'));
      return callback();
    });
    vi.stubGlobal('navigator', { ...window.navigator, locks: { request } });
    const ctx = await setup([]);
    storeRef = ctx.store;
    ctx.store.saveCustomerAuthTokens(tokens('access-1', 'refresh-1'));

    await expect(ctx.get()).resolves.toEqual({ ok: true });
    expect(ctx.refreshCalls).toHaveLength(0);
  });
});
