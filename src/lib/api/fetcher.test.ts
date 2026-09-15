import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { describe, expect, it } from 'vitest';
import { apiFetcher, isCredentialEndpoint } from './fetcher';

describe('apiFetcher', () => {
  it('passes generated query parameters to Axios', async () => {
    let request: InternalAxiosRequestConfig | undefined;
    const adapter: AxiosAdapter = async (config) => {
      request = config;
      return {
        config,
        data: { items: [] },
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    };

    const result = await apiFetcher<{ items: unknown[] }>(
      {
        url: '/api/v1/catalog/products',
        method: 'GET',
        params: { page: 1, search: 'tạ tay' },
      },
      { adapter },
    );

    expect(result).toEqual({ items: [] });
    expect(request?.baseURL).toBe('http://localhost:4000');
    expect(request?.params).toEqual({ page: 1, search: 'tạ tay' });
    expect(request?.withCredentials).toBe(true);
  });
  /**
   * Hồi quy: `/auth/me` là lời gọi khôi phục phiên khi tải lại trang. Bộ lọc cũ bắt cả
   * chuỗi `/auth/` nên `/me` bị coi là endpoint cấp token và không được xoay token khi
   * gặp 401 — access token hết hạn là mất phiên thay vì tự gia hạn.
   */
  it('không coi /auth/me là endpoint cấp token, để nó được xoay token khi 401', () => {
    expect(isCredentialEndpoint('/api/v1/auth/me')).toBe(false);
  });

  it('miễn xoay token cho đúng các endpoint cấp hoặc huỷ token', () => {
    expect(isCredentialEndpoint('/api/v1/auth/login')).toBe(true);
    expect(isCredentialEndpoint('/api/v1/auth/register')).toBe(true);
    expect(isCredentialEndpoint('/api/v1/auth/refresh')).toBe(true);
    expect(isCredentialEndpoint('/api/v1/auth/logout')).toBe(true);
  });

  it('tài nguyên thường vẫn được xoay token', () => {
    expect(isCredentialEndpoint('/api/v1/account/orders')).toBe(false);
    expect(isCredentialEndpoint('/api/v1/catalog/products')).toBe(false);
  });
});
