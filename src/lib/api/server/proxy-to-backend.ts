import { headers as requestHeaders } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  STOREFRONT_CLIENT_IP_HEADER,
  STOREFRONT_PROXY_SECRET_HEADER,
  backendOrigin,
  clientIpFromHeaders,
  storefrontProxySecret,
} from './backend-origin';

/**
 * Chuyển tiếp yêu cầu từ trình duyệt sang backend thật (BFF mỏng).
 *
 * Trình duyệt chỉ nói chuyện với origin của Next; địa chỉ backend không có trong JS phía client. Proxy
 * KHÔNG diễn giải nội dung: mã lỗi và thân phản hồi của backend trả nguyên vẹn — backend vẫn là nơi
 * quyết định nghiệp vụ. Header được lọc hai chiều: chỉ gửi đi header cần thiết, chỉ trả về header an toàn
 * (không lộ `server`, `x-vercel-*`, `access-control-*` của backend).
 */

/** Header trình duyệt → backend. */
const FORWARDED_REQUEST_HEADERS = [
  'authorization',
  'content-type',
  'accept',
  'accept-language',
  'cookie',
  // SECURITY: refresh bằng cookie kiểm `Origin` (hoặc `Referer`) thuộc CORS_ORIGINS bên API
  // (`AuthTokenTransportService.assertTrustedOrigin`); thiếu hai header này refresh luôn 403.
  'origin',
  'referer',
  'if-none-match',
  'idempotency-key',
  'x-cart-token',
  'x-guest-access-token',
  'x-order-lookup-token',
  'x-assistant-session',
  'x-request-id',
  'user-agent',
];

/**
 * Trần chờ backend. Lượt chat trợ lý được phép tới 90 giây (`ASSISTANT_SEND_TIMEOUT_MS`), nên để thấp hơn
 * `maxDuration` của route một chút: hết giờ thì trả 504 có mã ổn định thay vì để nền tảng cắt hàm.
 */
const UPSTREAM_TIMEOUT_MS = 85_000;

/**
 * Ghép đường dẫn backend từ segment catch-all của Next (đã decode): mã hoá lại từng segment để `/`, `?`, `#`
 * trong segment không đổi cấu trúc URL đích.
 */
export function backendApiPath(prefix: string, segments: readonly string[]): string {
  return `${prefix}/${segments.map(encodeURIComponent).join('/')}`;
}

/** SECURITY: chỉ proxy vào `/api/v1/**` của đúng backend — chặn `.`/`..` (kể cả dạng `%2e`) thoát khỏi tiền tố. */
function isAllowedTarget(path: string, target: URL, origin: string): boolean {
  const hasDotSegment = path
    .split('?')[0]
    .split('/')
    .some((segment) => {
      const decoded = segment.replace(/%2e/gi, '.');
      return decoded === '.' || decoded === '..';
    });
  return !hasDotSegment && target.origin === new URL(origin).origin && target.pathname.startsWith('/api/v1/');
}

/** Header backend → trình duyệt (`set-cookie` xử lý riêng vì có thể nhiều dòng). */
const FORWARDED_RESPONSE_HEADERS = [
  'content-type',
  'content-disposition',
  'cache-control',
  'retry-after',
  'etag',
  'last-modified',
  'location',
  'x-request-id',
];

/**
 * Header IP khách cho lời gọi backend trực tiếp từ server component (SDK qua `apiFetcher`, secret do
 * interceptor gắn). Không có header này backend thấy IP server Vercel ⇒ mọi lượt SSR chung một hạn mức.
 *
 * CHỈ gọi trong render động theo từng request (trang đọc `searchParams`/`force-dynamic`): `headers()`
 * ép route sang dynamic và ném lỗi trong `unstable_cache` — không dùng cho dữ liệu công khai ISR/cache.
 */
export async function storefrontClientIpHeaders(): Promise<Record<string, string>> {
  if (!storefrontProxySecret()) return {};
  const ip = clientIpFromHeaders(await requestHeaders());
  return ip ? { [STOREFRONT_CLIENT_IP_HEADER]: ip } : {};
}

export async function proxyToBackend(request: Request, path: string): Promise<Response> {
  const incoming = new URL(request.url);
  const origin = backendOrigin();
  const target = new URL(path, `${origin}/`);
  target.search = incoming.search;
  if (!isAllowedTarget(path, target, origin)) {
    return NextResponse.json({ statusCode: 404, code: 'NOT_FOUND', message: 'Không tìm thấy.' }, { status: 404 });
  }

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  // Backend chỉ cần origin của Referer; không chuyển path/query (có thể chứa mã tra đơn) sang log backend.
  const referer = headers.get('referer');
  if (referer) {
    try {
      headers.set('referer', `${new URL(referer).origin}/`);
    } catch {
      headers.delete('referer');
    }
  }
  const secret = storefrontProxySecret();
  if (secret) {
    headers.set(STOREFRONT_PROXY_SECRET_HEADER, secret);
    const ip = clientIpFromHeaders(request.headers);
    if (ip) headers.set(STOREFRONT_CLIENT_IP_HEADER, ip);
  }

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      // arrayBuffer: giữ nguyên byte (JSON, multipart) thay vì ép qua chuỗi.
      body: hasBody ? await request.arrayBuffer() : undefined,
      // Proxy tự quản lý phiên qua header; không để fetch tự đính cookie của server.
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'manual',
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const outgoing = new NextResponse(response.status === 204 || response.status === 304 ? null : response.body, {
      status: response.status,
    });
    for (const name of FORWARDED_RESPONSE_HEADERS) {
      const value = response.headers.get(name);
      if (value) outgoing.headers.set(name, value);
    }
    // Nhiều cookie (access + refresh) phải giữ thành nhiều dòng `set-cookie`; `get()` gộp bằng dấu phẩy.
    for (const cookie of response.headers.getSetCookie()) outgoing.headers.append('set-cookie', cookie);
    return outgoing;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return NextResponse.json(
        { statusCode: 504, code: 'UPSTREAM_TIMEOUT', message: 'Máy chủ phản hồi quá lâu. Vui lòng thử lại.' },
        { status: 504 },
      );
    }
    // Không lộ địa chỉ backend hay chi tiết lỗi mạng ra trình duyệt.
    return NextResponse.json(
      { statusCode: 502, code: 'UPSTREAM_UNAVAILABLE', message: 'Không kết nối được máy chủ. Vui lòng thử lại.' },
      { status: 502 },
    );
  }
}
