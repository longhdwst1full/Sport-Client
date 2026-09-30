import { createBrowserStore, SessionStorageKey } from '@/core/storage';

/** Grant xem đơn do `verifyGuestOrderLookup` cấp (token chỉ trả một lần, server chỉ lưu hash). */
export type GuestOrderLookupGrant = { orderNo: string; lookupToken: string; expiresAt: string };

type GrantMap = Record<string, Omit<GuestOrderLookupGrant, 'orderNo'>>;

function normalizeOrderNo(orderNo: string): string {
  return orderNo.trim().toUpperCase();
}

function isLive(expiresAt: string, now: number): boolean {
  const time = Date.parse(expiresAt);
  return Number.isFinite(time) && time > now;
}

function parseGrants(raw: unknown): GrantMap | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const now = Date.now();
  const grants: GrantMap = {};
  for (const [orderNo, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!value || typeof value !== 'object') continue;
    const { lookupToken, expiresAt } = value as Record<string, unknown>;
    if (typeof lookupToken === 'string' && lookupToken && typeof expiresAt === 'string' && isLive(expiresAt, now)) {
      grants[orderNo] = { lookupToken, expiresAt };
    }
  }
  return grants;
}

/**
 * SECURITY: grant tra cứu là quyền xem một đơn trong 30 phút. Chỉ giữ ở **sessionStorage** (mất khi đóng tab, không
 * lan sang tab/máy khác), không bao giờ localStorage; bản ghi hết hạn bị bỏ ngay khi đọc. `createBrowserStore` bọc mọi
 * truy cập trong try/catch (private mode, storage bị chặn, bản ghi hỏng).
 */
const store = createBrowserStore<GrantMap>(SessionStorageKey.GUEST_ORDER_LOOKUP, { area: 'session', parse: parseGrants });

// Dự phòng trong bộ nhớ khi sessionStorage bị chặn: điều hướng client-side sang trang đơn vẫn dùng được grant vừa nhận;
// tải lại trang thì mất, khách xác thực lại.
let memoryGrants: GrantMap = {};

function readAll(): GrantMap {
  const now = Date.now();
  memoryGrants = Object.fromEntries(Object.entries(memoryGrants).filter(([, entry]) => isLive(entry.expiresAt, now)));
  return { ...memoryGrants, ...(store.read() ?? {}) };
}

export function saveGuestOrderLookupGrant(grant: GuestOrderLookupGrant): boolean {
  const key = normalizeOrderNo(grant.orderNo);
  const entry = { lookupToken: grant.lookupToken, expiresAt: grant.expiresAt };
  memoryGrants = { ...memoryGrants, [key]: entry };
  return store.write({ ...readAll(), [key]: entry });
}

export function readGuestOrderLookupGrant(orderNo: string): GuestOrderLookupGrant | null {
  const key = normalizeOrderNo(orderNo);
  const entry = readAll()[key];
  return entry ? { orderNo: key, ...entry } : null;
}

/** Grant còn hạn mới nhất trong tab — dùng cho trợ lý chat của khách ẩn danh (không gắn với một đơn cụ thể). */
export function readLatestGuestOrderLookupGrant(): GuestOrderLookupGrant | null {
  const entries = Object.entries(readAll());
  if (entries.length === 0) return null;
  const [orderNo, entry] = entries.reduce((latest, current) =>
    Date.parse(current[1].expiresAt) > Date.parse(latest[1].expiresAt) ? current : latest,
  );
  return { orderNo, ...entry };
}

export function clearGuestOrderLookupGrant(orderNo: string): void {
  const key = normalizeOrderNo(orderNo);
  const { [key]: _removed, ...rest } = memoryGrants;
  memoryGrants = rest;
  const grants = readAll();
  delete grants[key];
  if (Object.keys(grants).length === 0) store.clear();
  else store.write(grants);
}
