/**
 * Hằng số của tầng transport (`fetcher.ts`). Không chứa DTO nghiệp vụ.
 *
 * Mã lỗi refresh do API phát (`api/src/modules/auth/auth.constants.ts`). Chúng không nằm trong
 * schema OpenAPI được sinh ra nên client giữ bản sao DUY NHẤT ở đây, không rải literal.
 */
export const AuthRefreshErrorCode = {
  /** 401 — refresh token sai/hết hạn/bị thu hồi. */
  INVALID: 'AUTH_REFRESH_INVALID',
  /** 401 — refresh token đã dùng rồi (reuse detection). */
  REUSED: 'AUTH_REFRESH_REUSED',
  /** 401 — không gửi refresh token/cookie (trước đây là 400). */
  MISSING: 'AUTH_REFRESH_MISSING',
  /** 409 — một lần xoay khác của cùng token đang chạy; thử lại được. */
  CONFLICT: 'AUTH_REFRESH_CONFLICT',
  /** 401 — mã chung của backend cũ trước khi có mã riêng cho refresh. */
  LEGACY_UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

export type AuthRefreshErrorCode = (typeof AuthRefreshErrorCode)[keyof typeof AuthRefreshErrorCode];

/** Tên Web Lock dùng chung mọi tab cùng origin để chỉ một tab xoay refresh token tại một thời điểm. */
export const AUTH_REFRESH_LOCK_NAME = 'dctd-client-auth-refresh';

/** Chờ trước khi thử lại đúng một lần khi refresh trả 409 `AUTH_REFRESH_CONFLICT`. */
export const AUTH_REFRESH_CONFLICT_RETRY_DELAY_MS = 300;

export const AUTH_REFRESH_PATH = '/api/v1/auth/refresh';
