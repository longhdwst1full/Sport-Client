import { NextResponse } from 'next/server';

/**
 * Chuyển tiếp yêu cầu thanh toán từ trình duyệt sang backend thật.
 *
 * Trình duyệt chỉ nói chuyện với origin của Next; địa chỉ backend không xuất hiện
 * trong mã nguồn phía client. Nhờ vậy đổi hạ tầng backend không phải build lại FE,
 * và các header nhạy cảm chỉ tồn tại ở phía server.
 *
 * Proxy KHÔNG diễn giải nội dung: mã lỗi và thân phản hồi của backend được trả lại
 * nguyên vẹn, vì backend mới là nơi quyết định nghiệp vụ thanh toán.
 */
const BACKEND_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:4000';

/** Chỉ chuyển tiếp header cần thiết; không bê nguyên header của trình duyệt sang. */
const FORWARDED_HEADERS = [
  'authorization',
  'content-type',
  'accept',
  'accept-language',
  'cookie',
  'idempotency-key',
  'x-cart-token',
  'x-request-id',
];

export async function proxyToBackend(request: Request, path: string): Promise<Response> {
  const incoming = new URL(request.url);
  const target = new URL(path, BACKEND_URL);
  target.search = incoming.search;

  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.text() : undefined,
      // Proxy tự quản lý phiên qua header; không để fetch tự đính cookie của server.
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'manual',
    });

    const body = await response.text();
    const outgoing = new NextResponse(body || null, { status: response.status });
    const contentType = response.headers.get('content-type');
    if (contentType) outgoing.headers.set('content-type', contentType);
    // Cho phép backend set cookie phiên khi chạy chế độ cookie transport.
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) outgoing.headers.set('set-cookie', setCookie);
    return outgoing;
  } catch {
    // Không lộ địa chỉ backend hay chi tiết lỗi mạng ra trình duyệt.
    return NextResponse.json(
      { statusCode: 502, message: 'Không kết nối được cổng thanh toán. Vui lòng thử lại.' },
      { status: 502 },
    );
  }
}
