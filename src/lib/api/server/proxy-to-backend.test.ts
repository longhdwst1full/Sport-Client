import { afterEach, describe, expect, it, vi } from 'vitest';
import { proxyToBackend } from './proxy-to-backend';

const upstream = (init: { status?: number; headers?: [string, string][]; body?: string } = {}) => {
  const headers = new Headers();
  for (const [k, v] of init.headers ?? []) headers.append(k, v);
  return new Response(init.body ?? '{"ok":true}', { status: init.status ?? 200, headers });
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('proxyToBackend', () => {
  it('gọi đúng backend + query, chỉ gửi header cho phép, gắn secret và IP khách khi có cấu hình', async () => {
    vi.stubEnv('API_URL', 'https://be.internal');
    vi.stubEnv('STOREFRONT_PROXY_SECRET', 's'.repeat(32));
    const fetchMock = vi.fn().mockResolvedValue(upstream());
    vi.stubGlobal('fetch', fetchMock);

    await proxyToBackend(
      new Request('https://shop.test/api/v1/catalog/products?page=2', {
        headers: { authorization: 'Bearer t', 'x-forwarded-for': '1.2.3.4, 10.0.0.1', 'x-evil': '1' },
      }),
      '/api/v1/catalog/products',
    );

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe('https://be.internal/api/v1/catalog/products?page=2');
    const sent = init.headers as Headers;
    expect(sent.get('authorization')).toBe('Bearer t');
    expect(sent.get('x-evil')).toBeNull();
    expect(sent.get('x-storefront-proxy-secret')).toBe('s'.repeat(32));
    expect(sent.get('x-storefront-client-ip')).toBe('1.2.3.4');
  });

  it('bỏ header x-storefront-* do trình duyệt tự gửi (chống giả IP để lách giới hạn tần suất)', async () => {
    vi.stubEnv('STOREFRONT_PROXY_SECRET', 's'.repeat(32));
    const fetchMock = vi.fn().mockResolvedValue(upstream());
    vi.stubGlobal('fetch', fetchMock);
    await proxyToBackend(
      new Request('https://shop.test/api/v1/x', {
        headers: { 'x-forwarded-for': '1.2.3.4', 'x-storefront-client-ip': '9.9.9.9', 'x-storefront-proxy-secret': 'fake' },
      }),
      '/api/v1/x',
    );
    const sent = fetchMock.mock.calls[0][1].headers as Headers;
    expect(sent.get('x-storefront-client-ip')).toBe('1.2.3.4');
    expect(sent.get('x-storefront-proxy-secret')).toBe('s'.repeat(32));
  });

  it('không có secret thì không gửi header secret/IP', async () => {
    vi.stubEnv('STOREFRONT_PROXY_SECRET', '');
    const fetchMock = vi.fn().mockResolvedValue(upstream());
    vi.stubGlobal('fetch', fetchMock);
    await proxyToBackend(
      new Request('https://shop.test/api/v1/x', { headers: { 'x-forwarded-for': '1.2.3.4', 'x-storefront-client-ip': '9.9.9.9' } }),
      '/api/v1/x',
    );
    const sent = fetchMock.mock.calls[0][1].headers as Headers;
    expect(sent.get('x-storefront-proxy-secret')).toBeNull();
    expect(sent.get('x-storefront-client-ip')).toBeNull();
  });

  it('chỉ trả header an toàn, giữ nhiều set-cookie và retry-after', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        upstream({
          status: 429,
          headers: [
            ['content-type', 'application/json'],
            ['retry-after', '30'],
            ['set-cookie', 'a=1; Path=/; HttpOnly'],
            ['set-cookie', 'b=2; Path=/; HttpOnly'],
            ['server', 'Vercel'],
            ['x-vercel-id', 'abc'],
            ['access-control-allow-origin', '*'],
          ],
        }),
      ),
    );
    const res = await proxyToBackend(new Request('https://shop.test/api/v1/x', { method: 'POST', body: '{}' }), '/api/v1/x');
    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toBe('30');
    expect(res.headers.getSetCookie()).toEqual(['a=1; Path=/; HttpOnly', 'b=2; Path=/; HttpOnly']);
    expect(res.headers.get('server')).toBeNull();
    expect(res.headers.get('x-vercel-id')).toBeNull();
    expect(res.headers.get('access-control-allow-origin')).toBeNull();
  });

  it('backend không phản hồi → 502 không lộ địa chỉ', async () => {
    vi.stubEnv('API_URL', 'https://be.internal');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('connect ECONNREFUSED be.internal')));
    const res = await proxyToBackend(new Request('https://shop.test/api/v1/x'), '/api/v1/x');
    expect(res.status).toBe(502);
    expect(await res.text()).not.toContain('be.internal');
  });
});
