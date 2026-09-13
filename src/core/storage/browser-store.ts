/**
 * Adapter storage duy nhất của Storefront (RULE-CORE-01).
 *
 * Lý do tồn tại: mọi truy cập storage phải chịu được ba tình huống thật — không có
 * `window` (server component / prerender), storage bị chặn (private mode, quota),
 * và bản ghi cũ/hỏng không parse được. Feature chỉ khai báo key + schema.
 */
export type BrowserStoreArea = 'local' | 'session';

export interface BrowserStore<T> {
  read(): T | undefined;
  write(value: T): boolean;
  clear(): void;
}

/** Truy cập storage an toàn cho code có logic lưu trữ riêng (ví dụ guest order TTL). */
export function safeStorage(area: BrowserStoreArea = 'local'): Storage | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return area === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    return undefined;
  }
}

export function createBrowserStore<T>(
  key: string,
  options: { area?: BrowserStoreArea; parse?: (raw: unknown) => T | undefined } = {},
): BrowserStore<T> {
  const { area = 'local', parse } = options;

  return {
    read() {
      const raw = safeStorage(area)?.getItem(key);
      if (!raw) return undefined;
      try {
        const parsed: unknown = JSON.parse(raw);
        return parse ? parse(parsed) : (parsed as T);
      } catch {
        safeStorage(area)?.removeItem(key);
        return undefined;
      }
    },
    write(value: T) {
      const storage = safeStorage(area);
      if (!storage) return false;
      try {
        storage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    clear() {
      try {
        safeStorage(area)?.removeItem(key);
      } catch {
        // Best-effort cleanup.
      }
    },
  };
}
