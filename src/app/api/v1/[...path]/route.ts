import { backendApiPath, proxyToBackend } from '@/lib/api/server/proxy-to-backend';

/**
 * Cổng vào duy nhất của trình duyệt cho mọi API `/api/v1/**` (thay rewrite thẳng tới backend):
 * `trình duyệt → route này → backend thật`. Route cụ thể hơn (`payments/[...path]`) vẫn ưu tiên.
 * Lọc header hai chiều, gắn secret + IP khách cho backend (xem `proxy-to-backend.ts`).
 */
export const dynamic = 'force-dynamic';
/**
 * Lượt chat trợ lý chờ tới 90 giây (`ASSISTANT_SEND_TIMEOUT_MS`); proxy tự cắt ở 85 giây (`UPSTREAM_TIMEOUT_MS`).
 * Giá trị phải là literal (Next đọc tĩnh) và không vượt hạn mức gói Vercel.
 */
export const maxDuration = 90;

async function handle(request: Request, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const { path } = await params;
  return proxyToBackend(request, backendApiPath('/api/v1', path));
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
