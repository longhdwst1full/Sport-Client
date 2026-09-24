import { ApiError } from '@/lib/api/fetcher';

/** Thông điệp lỗi từ API (đã là tiếng Việt) hoặc câu mặc định; không lộ request id cho khách. */
export function returnErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.payload && typeof error.payload === 'object' && 'message' in error.payload) {
    const value = (error.payload as { message?: unknown }).message;
    if (typeof value === 'string' && value.trim()) return value;
  }
  return error instanceof Error && error.message && !(error instanceof ApiError) ? error.message : fallback;
}
