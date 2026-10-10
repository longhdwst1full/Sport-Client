import { proxyToBackend } from '@/lib/api/server/proxy-to-backend';

/**
 * Cổng vào duy nhất của trình duyệt cho mọi API `/api/v1/**` (thay rewrite thẳng tới backend):
 * `trình duyệt → route này → backend thật`. Route cụ thể hơn (`payments/[...path]`) vẫn ưu tiên.
 * Lọc header hai chiều, gắn secret + IP khách cho backend (xem `proxy-to-backend.ts`).
 */
export const dynamic = 'force-dynamic';
/** Checkout/đặt đơn đo được ~10 giây ở backend; fetcher cho phép tới 30 giây. */
export const maxDuration = 30;

async function handle(request: Request, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const { path } = await params;
  return proxyToBackend(request, `/api/v1/${path.map(encodeURIComponent).join('/')}`);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
