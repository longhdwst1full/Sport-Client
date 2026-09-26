import axios, { type AxiosRequestConfig } from 'axios';
import type { TokenPairDto } from '@/generated/api/auth/auth.schemas';
import {
  clearCustomerAuthTokens,
  hasCustomerRefreshCredential,
  readCustomerAuthTokens,
  saveCustomerAuthTokens,
  usesCustomerAuthCookieTransport,
} from '../../features/auth/model/auth-token.store';

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

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

// Khi chạy trên trình duyệt tại localhost / 127.0.0.1 (như Playwright E2E hoặc local dev),
// chuyển baseURL về rỗng để request đi qua Next.js server proxy (rewrites `/api/v1/:path*`),
// tránh bị chặn bởi CORS của Staging API.
apiClient.interceptors.request.use((config) => {
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    config.baseURL = '';
  }
  return config;
});

let refreshPromise: Promise<TokenPairDto> | undefined;

async function rotateTokens(): Promise<TokenPairDto> {
  const refreshToken = readCustomerAuthTokens()?.refreshToken;
  if (!refreshToken && !usesCustomerAuthCookieTransport()) {
    throw new Error('No refresh token is available');
  }
  refreshPromise ??= axios
    .post<TokenPairDto>(
      '/api/v1/auth/refresh',
      refreshToken ? { refreshToken } : {},
      { baseURL: API_URL, withCredentials: true, headers: { Accept: 'application/json' } },
    )
    .then(({ data }) => {
      saveCustomerAuthTokens(data);
      return data;
    })
    .catch((error: unknown) => {
      clearCustomerAuthTokens();
      throw error;
    })
    .finally(() => {
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
  const accessToken = readCustomerAuthTokens()?.accessToken;
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
    const isAuthEndpoint = isCredentialEndpoint(config.url);
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      // Điều kiện là CÒN refresh token, không phải còn access token: access hết hạn
      // trước là đúng luồng, chặn ở đây thì không bao giờ xoay được token.
      hasCustomerRefreshCredential() &&
      !isAuthEndpoint
    ) {
      const tokens = await rotateTokens();
      const response = await apiClient.request<T>({
        ...requestConfig,
        headers: { ...requestConfig.headers, Authorization: `Bearer ${tokens.accessToken}` },
      });
      return response.data;
    }
    if (axios.isAxiosError(error)) {
      throw new ApiError(error.response?.status ?? 0, error.response?.data);
    }
    throw error;
  }
}

export type ErrorType<Error> = ApiError<Error>;
export type BodyType<BodyData> = BodyData;
