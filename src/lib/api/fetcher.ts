import axios, { type AxiosRequestConfig } from 'axios';
import type { TokenPairDto } from '@/generated/api/auth/auth.schemas';
import {
  clearCustomerAuthTokens,
  hasCustomerRefreshCredential,
  readCustomerAuthTokens,
  saveCustomerAuthTokens,
  usesCustomerAuthCookieTransport,
} from '../../features/auth/model/auth-token.store';
import {
  AUTH_REFRESH_CONFLICT_RETRY_DELAY_MS,
  AUTH_REFRESH_LOCK_NAME,
  AUTH_REFRESH_PATH,
  AuthRefreshErrorCode,
} from './constants';

/**
 * Mặc định trỏ API chạy máy local.
 *
 * Trước đây giá trị dự phòng là URL production: quên đặt `NEXT_PUBLIC_API_URL` ở bất kỳ môi trường
 * nào — máy dev, CI, preview — là âm thầm gọi thẳng vào hệ thống thật. Môi trường triển khai luôn
 * khai biến này (`.env.production`), nên hạ mặc định xuống local không đổi hành vi khi deploy.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError<T = unknown> extends Error {
  constructor(
    public readonly status: number,
    public readonly payload: T,
  ) {
    super(status ? `API request failed with status ${status}` : 'API request failed');
    this.name = 'ApiError';
  }
}

/**
 * Chạy trên trình duyệt tại localhost / 127.0.0.1 (local dev, Playwright E2E) thì đi same-origin
 * qua Next rewrite `/api/v1/:path*`, tránh CORS/trusted-origin của API deploy. Mọi môi trường khác
 * giữ nguyên `NEXT_PUBLIC_API_URL` — không đổi topology production.
 */
export function resolveApiBaseURL(): string {
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return '';
  }
  return API_URL;
}

/** @internal Chỉ export cho test transport. Feature phải đi qua `apiFetcher`/generated SDK. */
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  config.baseURL = resolveApiBaseURL();
  return config;
});

function toApiError(error: unknown): unknown {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) return new ApiError(error.response?.status ?? 0, error.response?.data);
  return error;
}

function errorCode(error: ApiError): string | undefined {
  const payload = error.payload as { code?: unknown } | undefined;
  return typeof payload?.code === 'string' ? payload.code : undefined;
}

function isRefreshConflict(error: ApiError): boolean {
  return error.status === 409 || errorCode(error) === AuthRefreshErrorCode.CONFLICT;
}

/**
 * Chỉ 401 từ `/auth/refresh` là phiên chết thật (`AUTH_REFRESH_INVALID|REUSED|MISSING`, hoặc
 * `UNAUTHORIZED` của backend cũ). Mạng lỗi, 429, 5xx, timeout là sự cố tạm thời: xoá token lúc đó
 * sẽ đăng xuất khách ở MỌI tab (cờ phiên nằm ở localStorage) vì một lần API chập chờn.
 */
function isTerminalRefreshFailure(error: ApiError): boolean {
  return error.status === 401;
}

function currentAccessToken(): string | undefined {
  return readCustomerAuthTokens()?.accessToken || undefined;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * IDEMPOTENCY: refresh token là dùng-một-lần (rotation + reuse detection phía API). Hai tab cùng
 * gửi một refresh token thì tab thua nhận `AUTH_REFRESH_REUSED` và API có thể thu hồi cả họ token.
 * Web Locks tuần tự hoá refresh giữa các tab cùng origin; trình duyệt không có Web Locks thì chỉ
 * còn single-flight trong tab (`refreshPromise`) và nhánh "tab khác đã xoay" trong `refreshUnderLock`.
 */
function withRefreshLock<T>(task: () => Promise<T>): Promise<T> {
  const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined;
  if (!locks || typeof locks.request !== 'function') return task();
  // lib.dom khai kết quả là Promise<ReturnType<callback>> = Promise<Promise<T>>; runtime tự flatten.
  return locks.request(AUTH_REFRESH_LOCK_NAME, { mode: 'exclusive' }, task) as unknown as Promise<T>;
}

async function refreshUnderLock(staleAccessToken: string | undefined): Promise<string> {
  for (let attempt = 0; ; attempt += 1) {
    // Đọc lại storage SAU khi có lock: tab giữ lock trước có thể đã xoay xong và ghi cookie mới.
    const before = readCustomerAuthTokens();
    const beforeAccess = before?.accessToken || undefined;
    if (beforeAccess && beforeAccess !== staleAccessToken) return beforeAccess;

    const refreshToken = before?.refreshToken;
    if (!refreshToken && !usesCustomerAuthCookieTransport()) {
      clearCustomerAuthTokens();
      throw new ApiError(401, { code: AuthRefreshErrorCode.MISSING });
    }
    try {
      // Dùng chính `apiClient` để cùng baseURL same-origin trên localhost. Không đệ quy 401:
      // nhánh xoay token nằm trong `apiFetcher`, còn lời gọi này không đi qua `apiFetcher`.
      const { data } = await apiClient.post<TokenPairDto>(
        AUTH_REFRESH_PATH,
        refreshToken ? { refreshToken } : {},
      );
      saveCustomerAuthTokens(data);
      return data.accessToken;
    } catch (error) {
      const failure = toApiError(error);
      if (!(failure instanceof ApiError)) throw failure;
      // IDEMPOTENCY: 409 = một lần xoay khác của cùng token đang chạy; chờ rồi thử lại đúng MỘT lần.
      // Vòng sau đọc lại storage nên nếu bên kia đã ghi token mới thì dùng luôn, không gọi lại API.
      if (isRefreshConflict(failure) && attempt === 0) {
        await wait(AUTH_REFRESH_CONFLICT_RETRY_DELAY_MS);
        continue;
      }
      if (isTerminalRefreshFailure(failure)) {
        // Không có Web Locks: tab khác có thể vừa xoay xong và làm token của tab này thành "reused".
        // Token trong storage đã đổi nghĩa là phiên vẫn sống — dùng token đó thay vì đăng xuất.
        const after = currentAccessToken();
        if (after && after !== staleAccessToken && after !== beforeAccess) return after;
        // SECURITY: chỉ ở đây mới xoá token + cờ phiên (đăng xuất mọi tab).
        clearCustomerAuthTokens();
      }
      throw failure;
    }
  }
}

let refreshPromise: Promise<string> | undefined;

/**
 * Trả access token dùng được cho lần thử lại sau 401.
 *
 * - Token hiện tại khác token request đã dùng ⇒ ai đó (request khác/tab khác) đã xoay rồi: dùng
 *   luôn, không refresh.
 * - Ngược lại N request 401 song song chia chung MỘT `refreshPromise` ⇒ đúng một lần refresh.
 */
function recoverAccessToken(staleAccessToken: string | undefined): Promise<string> {
  const current = currentAccessToken();
  if (current && current !== staleAccessToken) return Promise.resolve(current);
  refreshPromise ??= withRefreshLock(() => refreshUnderLock(staleAccessToken)).finally(() => {
    refreshPromise = undefined;
  });
  return refreshPromise;
}

/**
 * Chỉ những endpoint tự nó CẤP hoặc HUỶ token mới được miễn xoay token khi gặp 401 —
 * xoay ở đó sẽ đệ quy vô hạn.
 *
 * `/auth/me` KHÔNG thuộc nhóm này: nó là tài nguyên được bảo vệ và là đúng lời gọi khôi phục
 * phiên khi tải lại trang. Trước đây bộ lọc bắt cả chuỗi `/auth/` nên `/me` bị loại nhầm,
 * khiến access token hết hạn là mất phiên thay vì tự gia hạn.
 */
const CREDENTIAL_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
];

export function isCredentialEndpoint(url: string | undefined): boolean {
  const value = String(url ?? '');
  return CREDENTIAL_ENDPOINTS.some((path) => value.includes(path));
}

export async function apiFetcher<T>(
  config: AxiosRequestConfig,
  options: AxiosRequestConfig = {},
): Promise<T> {
  const accessToken = currentAccessToken();
  const requestConfig: AxiosRequestConfig = {
    ...config,
    ...options,
    headers: {
      ...config.headers,
      ...options.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };
  try {
    const response = await apiClient.request<T>(requestConfig);
    return response.data;
  } catch (error) {
    const originalError = toApiError(error);
    if (
      !(originalError instanceof ApiError) ||
      originalError.status !== 401 ||
      isCredentialEndpoint(config.url) ||
      // Điều kiện là CÒN refresh token, không phải còn access token: access hết hạn
      // trước là đúng luồng, chặn ở đây thì không bao giờ xoay được token.
      !hasCustomerRefreshCredential()
    ) {
      throw originalError;
    }

    let nextAccessToken: string;
    try {
      nextAccessToken = await recoverAccessToken(accessToken);
    } catch (refreshError) {
      // Phiên chết thật ⇒ trả đúng 401 của request gốc. Lỗi tạm thời (0/429/5xx/409) ⇒ trả lỗi
      // refresh, KHÔNG trả 401 gốc: nơi gọi (vd. `useCustomerAuth`) coi 401 là đăng xuất.
      if (refreshError instanceof ApiError && isTerminalRefreshFailure(refreshError)) throw originalError;
      throw refreshError;
    }

    try {
      const response = await apiClient.request<T>({
        ...requestConfig,
        headers: { ...requestConfig.headers, Authorization: `Bearer ${nextAccessToken}` },
      });
      return response.data;
    } catch (retryError) {
      throw toApiError(retryError);
    }
  }
}

export type ErrorType<Error> = ApiError<Error>;
export type BodyType<BodyData> = BodyData;
