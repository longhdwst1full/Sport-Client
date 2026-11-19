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
    const res = await proxyToBackend(new Request('https://shop.test/api/v1/x', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }), '/api/v1/x');
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

  it.each(['/api/v1/admin/auth/login', '/api/v1/ADMIN/orders', '/api/v1/internal/jobs/run', '/api/v1/integrations/ghn/webhook', '/api/v1/health'])(
    'không proxy API ngoài Storefront: %s → 404, không gọi backend',
    async (path) => {
      vi.stubEnv('API_URL', 'https://be.internal');
      vi.stubEnv('STOREFRONT_PROXY_SECRET', 's'.repeat(32));
      const fetchMock = vi.fn().mockResolvedValue(upstream());
      vi.stubGlobal('fetch', fetchMock);

      const response = await proxyToBackend(new Request(`https://shop.test${path}`, { method: 'POST' }), path);

      expect(response.status).toBe(404);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it('prefix gần giống vẫn đi qua (vd. /api/v1/administrators không phải /admin)', async () => {
    vi.stubEnv('API_URL', 'https://be.internal');
    const fetchMock = vi.fn().mockResolvedValue(upstream());
    vi.stubGlobal('fetch', fetchMock);
    await proxyToBackend(new Request('https://shop.test/api/v1/administrators'), '/api/v1/administrators');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('Location trỏ về backend được đổi thành đường dẫn tương đối; URL ngoài giữ nguyên', async () => {
    vi.stubEnv('API_URL', 'https://be.internal');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(upstream({ status: 302, headers: [['location', 'https://be.internal/api/v1/orders/guest/X?a=1']] }))
      .mockResolvedValueOnce(upstream({ status: 302, headers: [['location', 'https://sandbox.vnpayment.vn/pay?x=1']] }));
    vi.stubGlobal('fetch', fetchMock);

    const own = await proxyToBackend(new Request('https://shop.test/api/v1/orders/guest/X'), '/api/v1/orders/guest/X');
    const external = await proxyToBackend(new Request('https://shop.test/api/v1/payments/vnpay/x'), '/api/v1/payments/vnpay/x');

    expect(own.headers.get('location')).toBe('/api/v1/orders/guest/X?a=1');
    expect(external.headers.get('location')).toBe('https://sandbox.vnpayment.vn/pay?x=1');
  });

  it('trần chờ theo đường dẫn: trợ lý 85 giây, API khác 30 giây', async () => {
    const timeoutSpy = vi.spyOn(AbortSignal, 'timeout');
    const fetchMock = vi.fn().mockImplementation(async () => upstream());
    vi.stubGlobal('fetch', fetchMock);
    await proxyToBackend(new Request('https://shop.test/api/v1/assistant/conversations/1/messages', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }), '/api/v1/assistant/conversations/1/messages');
    await proxyToBackend(new Request('https://shop.test/api/v1/catalog/products'), '/api/v1/catalog/products');
    expect(timeoutSpy.mock.calls.map((c) => c[0])).toEqual([85_000, 30_000]);
    timeoutSpy.mockRestore();
  });

  it('hết giờ chờ backend trả 504 UPSTREAM_TIMEOUT', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('t', 'TimeoutError')));
    const res = await proxyToBackend(new Request('https://shop.test/api/v1/shipping/quote'), '/api/v1/shipping/quote');
    expect(res.status).toBe(504);
    expect((await res.json()).code).toBe('UPSTREAM_TIMEOUT');
  });

  describe('kiểm tra đầu vào tại proxy', () => {
    const setup = () => {
      vi.stubEnv('API_URL', 'https://be.internal');
      const fetchMock = vi.fn().mockResolvedValue(upstream());
      vi.stubGlobal('fetch', fetchMock);
      return fetchMock;
    };

    it('URL quá 4 KB → 414, không gọi backend', async () => {
      const fetchMock = setup();
      const res = await proxyToBackend(new Request(`https://shop.test/api/v1/catalog/products?q=${'a'.repeat(5000)}`), '/api/v1/catalog/products');
      expect(res.status).toBe(414);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('content-type không phải JSON → 415', async () => {
      const fetchMock = setup();
      const res = await proxyToBackend(
        new Request('https://shop.test/api/v1/carts', { method: 'POST', headers: { 'content-type': 'multipart/form-data; boundary=x' }, body: 'x' }),
        '/api/v1/carts',
      );
      expect(res.status).toBe(415);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('content-length khai quá trần → 413', async () => {
      const fetchMock = setup();
      const res = await proxyToBackend(
        new Request('https://shop.test/api/v1/carts', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'content-length': String(10 * 1024 * 1024) },
          body: '{}',
        }),
        '/api/v1/carts',
      );
      expect(res.status).toBe(413);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('body thật vượt trần dù không khai content-length (stream) → 413', async () => {
      const fetchMock = setup();
      const big = new ReadableStream<Uint8Array>({
        start(controller) {
          for (let i = 0; i < 40; i += 1) controller.enqueue(new Uint8Array(10 * 1024));
          controller.close();
        },
      });
      const res = await proxyToBackend(
        new Request('https://shop.test/api/v1/carts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: big, duplex: 'half' } as RequestInit),
        '/api/v1/carts',
      );
      expect(res.status).toBe(413);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('text/plain (kiểu request "đơn giản" dùng cho CSRF qua form) → 415', async () => {
      const fetchMock = setup();
      const res = await proxyToBackend(new Request('https://shop.test/api/v1/carts', { method: 'POST', body: '{}' }), '/api/v1/carts');
      expect(res.status).toBe(415);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('JSON hợp lệ vẫn được chuyển nguyên byte', async () => {
      const fetchMock = setup();
      const payload = JSON.stringify({ name: 'Nguyễn Văn A', quantity: 2 });
      const res = await proxyToBackend(
        new Request('https://shop.test/api/v1/carts', { method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' }, body: payload }),
        '/api/v1/carts',
      );
      expect(res.status).toBe(200);
      const [, init] = fetchMock.mock.calls[0];
      expect(new TextDecoder().decode(init.body as ArrayBuffer)).toBe(payload);
    });
  });
});
