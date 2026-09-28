import { ApiError } from './fetcher';

/**
 * Rút `message` từ `ApiError.payload` (dạng `{ message: string }` do backend trả về);
 * dùng `fallback` khi lỗi không phải `ApiError`, payload không có `message` dạng string,
 * hoặc lỗi không rõ nguồn gốc. Gom một chỗ thay cho ~7 bản `messageOf`/`errorMessage`
 * lặp lại logic giống hệt nhau ở từng feature.
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (
    error instanceof ApiError &&
    error.payload &&
    typeof error.payload === 'object' &&
    'message' in error.payload
  ) {
    const message = (error.payload as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return fallback;
}
