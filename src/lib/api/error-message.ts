import { ApiError } from './fetcher';

export interface ApiErrorMessageOptions {
  /** Ưu tiên `details[0].message` (lỗi validate từng trường) trước `message` chung. */
  preferDetails?: boolean;
  /** Lỗi không phải `ApiError` (vd. validate file phía client ném `Error`) thì hiện `error.message`. */
  includeClientErrors?: boolean;
}

/**
 * Rút thông điệp tiếng Việt từ `ApiError.payload` (`{ message, details? }` của backend); dùng `fallback`
 * khi không có. Một chỗ duy nhất cho mọi feature — trước đây auth/returns/orders mỗi nơi tự viết một bản.
 */
export function apiErrorMessage(error: unknown, fallback: string, options: ApiErrorMessageOptions = {}): string {
  if (error instanceof ApiError) {
    const payload = (error.payload && typeof error.payload === 'object' ? error.payload : {}) as {
      message?: unknown;
      details?: Array<{ message?: unknown }>;
    };
    const detail = options.preferDetails ? payload.details?.[0]?.message : undefined;
    if (typeof detail === 'string' && detail.trim()) return detail;
    if (typeof payload.message === 'string' && payload.message.trim()) return payload.message;
    return fallback;
  }
  if (options.includeClientErrors && error instanceof Error && error.message) return error.message;
  return fallback;
}

/** Mã lỗi ổn định `code` trong payload của backend (ví dụ `FLASH_SALE_QUOTA_EXHAUSTED`). */
export function apiErrorCode(error: unknown): string | undefined {
  if (!(error instanceof ApiError) || !error.payload || typeof error.payload !== 'object') return undefined;
  const code = (error.payload as { code?: unknown }).code;
  return typeof code === 'string' ? code : undefined;
}
