import { LocalStorageKey, safeStorage } from '@/core/storage';

const GUEST_ORDER_ACCESS_KEY = LocalStorageKey.GUEST_ORDER_ACCESS;
const DEFAULT_GUEST_ORDER_TOKEN_TTL_DAYS = 90;

interface GuestOrderAccessEntry {
  token: string;
  savedAt: number;
  expiresAt: number;
}

type GuestOrderAccess = Record<string, GuestOrderAccessEntry>;

// Session fallback keeps the just-created Order accessible when private mode or
// a browser policy blocks localStorage. It deliberately disappears on refresh.
let sessionAccess: GuestOrderAccess = {};

function ttlMilliseconds(): number {
  const configured = Number(process.env.NEXT_PUBLIC_GUEST_ORDER_TOKEN_TTL_DAYS);
  const days = Number.isFinite(configured) && configured >= 1 && configured <= 365
    ? configured
    : DEFAULT_GUEST_ORDER_TOKEN_TTL_DAYS;
  return days * 24 * 60 * 60 * 1000;
}

function normalizeEntry(value: unknown, now: number): GuestOrderAccessEntry | null {
  // CONTRACT: Migrate bản v1 lưu raw string tại lần đọc đầu tiên để người dùng
  // không mất quyền xem đơn cũ ngay khi deploy storage schema mới.
  if (typeof value === 'string' && value) {
    return { token: value, savedAt: now, expiresAt: now + ttlMilliseconds() };
  }
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<GuestOrderAccessEntry>;
  return typeof candidate.token === 'string'
    && typeof candidate.savedAt === 'number'
    && typeof candidate.expiresAt === 'number'
    && candidate.expiresAt > now
    ? candidate as GuestOrderAccessEntry
    : null;
}

function persist(access: GuestOrderAccess): void {
  safeStorage()?.setItem(GUEST_ORDER_ACCESS_KEY, JSON.stringify(access));
}

function readAll(): GuestOrderAccess {
  const storage = safeStorage();
  if (!storage) return sessionAccess;
  try {
    const now = Date.now();
    const parsed: unknown = JSON.parse(storage.getItem(GUEST_ORDER_ACCESS_KEY) ?? '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return sessionAccess;
    const persistedAccess = Object.fromEntries(
      Object.entries(parsed)
        .map(([orderNo, value]) => [orderNo, normalizeEntry(value, now)] as const)
        .filter((entry): entry is readonly [string, GuestOrderAccessEntry] => entry[1] !== null),
    );
    sessionAccess = Object.fromEntries(
      Object.entries(sessionAccess).filter(([, entry]) => entry.expiresAt > now),
    );
    const access = { ...persistedAccess, ...sessionAccess };
    persist(persistedAccess);
    return access;
  } catch {
    return sessionAccess;
  }
}

export function saveGuestOrderAccessToken(orderNo: string, token: string): boolean {
  if (typeof window === 'undefined') return false;
  const normalizedOrderNo = orderNo.trim().toUpperCase();
  const now = Date.now();
  const entry = { token, savedAt: now, expiresAt: now + ttlMilliseconds() };
  sessionAccess = { ...sessionAccess, [normalizedOrderNo]: entry };
  // SECURITY: Mỗi Order giữ token riêng. Không dùng chung key với cart vì cart kế
  // tiếp sẽ rotate token và vô tình làm khách mất quyền xem Order trước đó.
  try {
    persist({
      ...readAll(),
      [normalizedOrderNo]: entry,
    });
    return true;
  } catch {
    // CONTRACT: Order đã được tạo thành công ở server; lỗi browser storage không
    // được biến response thành checkout thất bại và kích hoạt người dùng retry.
    return false;
  }
}

export function readGuestOrderAccessToken(orderNo: string): string | null {
  return readAll()[orderNo.trim().toUpperCase()]?.token ?? null;
}

export function retireGuestOrderAccessToken(orderNo: string): void {
  if (typeof window === 'undefined') return;
  const normalizedOrderNo = orderNo.trim().toUpperCase();
  try {
    const persisted = readAll();
    delete persisted[normalizedOrderNo];
    persist(persisted);
    // UX: Giữ session fallback cho trang terminal đang mở; token biến mất khi
    // refresh/đóng tab và không còn được lưu dài hạn trên thiết bị.
  } catch {
    // Cleanup browser storage là best-effort; không được làm hỏng trang Order.
  }
}
