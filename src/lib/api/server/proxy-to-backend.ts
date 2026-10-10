import { NextResponse } from 'next/server';
import {
  STOREFRONT_CLIENT_IP_HEADER,
  STOREFRONT_PROXY_SECRET_HEADER,
  backendOrigin,
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
  'idempotency-key',
  'x-cart-token',
  'x-guest-access-token',
  'x-request-id',
  'user-agent',
];

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

/** IP khách theo hạ tầng phía trước Next (Vercel đặt `x-forwarded-for`, phần tử đầu là khách). */
function clientIp(request: Request): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || undefined;
}

export async function proxyToBackend(request: Request, path: string): Promise<Response> {
  const incoming = new URL(request.url);
  const target = new URL(path, `${backendOrigin()}/`);
  target.search = incoming.search;

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const secret = storefrontProxySecret();
  if (secret) {
    headers.set(STOREFRONT_PROXY_SECRET_HEADER, secret);
    const ip = clientIp(request);
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
  } catch {
    // Không lộ địa chỉ backend hay chi tiết lỗi mạng ra trình duyệt.
    return NextResponse.json(
      { statusCode: 502, code: 'UPSTREAM_UNAVAILABLE', message: 'Không kết nối được máy chủ. Vui lòng thử lại.' },
      { status: 502 },
    );
  }
}
