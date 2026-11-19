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
const ASSISTANT_UPSTREAM_TIMEOUT_MS = 85_000;

/** Trần cho API còn lại (kể cả báo giá vận chuyển/GHN có thể chậm): đủ rộng, nhưng không treo hàm tới 85 giây. */
const DEFAULT_UPSTREAM_TIMEOUT_MS = 30_000;

function upstreamTimeoutMs(pathname: string): number {
  return pathname.toLowerCase().startsWith('/api/v1/assistant/') ? ASSISTANT_UPSTREAM_TIMEOUT_MS : DEFAULT_UPSTREAM_TIMEOUT_MS;
}

/**
 * Ghép đường dẫn backend từ segment catch-all của Next (đã decode): mã hoá lại từng segment để `/`, `?`, `#`
 * trong segment không đổi cấu trúc URL đích.
 */
export function backendApiPath(prefix: string, segments: readonly string[]): string {
  return `${prefix}/${segments.map(encodeURIComponent).join('/')}`;
}

/**
 * SECURITY: nhóm API không thuộc Storefront (Admin, job nội bộ, webhook bên thứ ba, health). Storefront không
 * gọi chúng (`contracts/storefront`), nên proxy không làm cầu nối: đi qua proxy chúng sẽ mang secret proxy +
 * IP khách do proxy gắn (rate-limit theo IP của đăng nhập Admin dựa vào đó) và tốn thời gian chạy hàm.
 * Admin gọi thẳng backend. Thêm prefix Storefront mới thì kiểm danh sách này.
 */
const NON_STOREFRONT_PREFIXES = ['/api/v1/admin', '/api/v1/internal', '/api/v1/integrations', '/api/v1/health'] as const;

/** SECURITY: chỉ proxy vào `/api/v1/**` của đúng backend — chặn `.`/`..` (kể cả dạng `%2e`) thoát khỏi tiền tố. */
function isAllowedTarget(path: string, target: URL, origin: string): boolean {
  const hasDotSegment = path
    .split('?')[0]
    .split('/')
    .some((segment) => {
      const decoded = segment.replace(/%2e/gi, '.');
      return decoded === '.' || decoded === '..';
    });
  const pathname = target.pathname.toLowerCase();
  const nonStorefront = NON_STOREFRONT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return !hasDotSegment && !nonStorefront && target.origin === new URL(origin).origin && pathname.startsWith('/api/v1/');
}

/**
 * SECURITY: kiểm tra đầu vào ngay tại proxy, trước khi tốn một lượt gọi backend (và thời gian chạy hàm).
 * - URL (path + query) tối đa 4 KB: chặn query khổng lồ làm phình log/cache-busting.
 * - Thân request chỉ nhận JSON: ảnh/video upload thẳng lên Cloudinary bằng chữ ký
 *   (`lib/api/signed-media-upload.ts`), không đi qua proxy.
 * - Thân tối đa 256 KB, đếm theo byte thật khi đọc stream (không tin `content-length` — chunked không có).
 *   Backend mặc định nhận 100 KB JSON; trần ở đây chỉ để cắt sớm request bất thường.
 */
export const PROXY_MAX_URL_LENGTH = 4096;
export const PROXY_MAX_BODY_BYTES = 256 * 1024;

function proxyError(status: number, code: string, message: string): Response {
  return NextResponse.json({ statusCode: status, code, message }, { status });
}

export function validateProxyRequest(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.pathname.length + url.search.length > PROXY_MAX_URL_LENGTH) {
    return proxyError(414, 'URI_TOO_LONG', 'Yêu cầu quá dài.');
  }
  if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'DELETE') return null;
  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > PROXY_MAX_BODY_BYTES) {
    return proxyError(413, 'PAYLOAD_TOO_LARGE', 'Dữ liệu gửi lên quá lớn.');
  }
  const contentType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (contentType && contentType !== 'application/json') {
    return proxyError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Định dạng dữ liệu không được hỗ trợ.');
  }
  return null;
}

/** Đọc thân request, dừng ngay khi vượt `limit` byte (kể cả khi không có `content-length`). */
export async function readBodyWithLimit(request: Request, limit = PROXY_MAX_BODY_BYTES): Promise<ArrayBuffer | null> {
  if (!request.body) return new ArrayBuffer(0);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body.buffer;
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

/**
 * `Location` tuyệt đối trỏ về chính backend làm lộ địa chỉ backend (thứ proxy đang giấu): đổi về đường dẫn
 * tương đối để trình duyệt đi tiếp qua proxy cùng origin. URL bên ngoài (vd. cổng thanh toán) giữ nguyên.
 */
function hideBackendOrigin(location: string, origin: string): string {
  try {
    const url = new URL(location, `${origin}/`);
    return url.origin === new URL(origin).origin ? `${url.pathname}${url.search}${url.hash}` : location;
  } catch {
    return location;
  }
}

export async function proxyToBackend(request: Request, path: string): Promise<Response> {
  const incoming = new URL(request.url);
  const origin = backendOrigin();
  const target = new URL(path, `${origin}/`);
  target.search = incoming.search;
  if (!isAllowedTarget(path, target, origin)) {
    return NextResponse.json({ statusCode: 404, code: 'NOT_FOUND', message: 'Không tìm thấy.' }, { status: 404 });
  }

  const rejected = validateProxyRequest(request);
  if (rejected) return rejected;

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
  // Giữ nguyên byte JSON thay vì ép qua chuỗi; cắt ngay khi vượt trần.
  const body = hasBody ? await readBodyWithLimit(request) : undefined;
  if (body === null) return proxyError(413, 'PAYLOAD_TOO_LARGE', 'Dữ liệu gửi lên quá lớn.');

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body,
      // Proxy tự quản lý phiên qua header; không để fetch tự đính cookie của server.
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'manual',
      signal: AbortSignal.timeout(upstreamTimeoutMs(target.pathname)),
    });

    const outgoing = new NextResponse(response.status === 204 || response.status === 304 ? null : response.body, {
      status: response.status,
    });
    for (const name of FORWARDED_RESPONSE_HEADERS) {
      const value = response.headers.get(name);
      if (value) outgoing.headers.set(name, name === 'location' ? hideBackendOrigin(value, origin) : value);
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
