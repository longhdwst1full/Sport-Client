import { timingSafeEqual } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { parseRevalidateRequest, revalidateTags, revalidateTargets } from './revalidate-targets';

export const dynamic = 'force-dynamic';

/**
 * Webhook làm mới ISR ngay khi Admin/API đăng hoặc sửa nội dung công khai.
 *
 * `POST /api/revalidate` với header `x-revalidate-secret: <REVALIDATE_SECRET>` (hoặc
 * `Authorization: Bearer <REVALIDATE_SECRET>`) và body `{ "resource": "post"|"product"|"category"|"all",
 * "slug"?: string }`. Không gọi thì nội dung mới vẫn hiện sau cửa sổ `revalidate` của từng trang
 * (2–5 phút).
 *
 * SECURITY: secret chỉ là biến server (`REVALIDATE_SECRET`, không có tiền tố `NEXT_PUBLIC_`).
 * Chưa cấu hình thì endpoint tắt hẳn (503), không chạy ở chế độ mở.
 */
function readSecret(request: NextRequest): string {
  const header = request.headers.get('x-revalidate-secret');
  if (header) return header;
  const authorization = request.headers.get('authorization') ?? '';
  return authorization.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : '';
}

function secretMatches(provided: string, expected: string): boolean {
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json({ code: 'REVALIDATE_DISABLED' }, { status: 503 });
  }
  if (!secretMatches(readSecret(request), expected)) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = undefined;
  }
  const input = parseRevalidateRequest(body);
  if (!input) {
    return NextResponse.json({ code: 'INVALID_REVALIDATE_REQUEST' }, { status: 400 });
  }

  const targets = revalidateTargets(input);
  const tags = revalidateTags(input);
  for (const tag of tags) revalidateTag(tag);
  for (const target of targets) {
    revalidatePath(target.path, target.type);
  }
  return NextResponse.json(
    { revalidated: targets.map((target) => target.path), tags },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
