import { proxyToBackend } from '@/lib/api/server/proxy-to-backend';

/**
 * Cổng vào duy nhất của trình duyệt cho thanh toán khách vãng lai.
 * Mọi lời gọi đi `client -> route này -> backend thật`.
 */
export const dynamic = 'force-dynamic';

async function handle(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await params;
  return proxyToBackend(request, `/api/v1/payments/${path.join('/')}`);
}

export const GET = handle;
export const POST = handle;
