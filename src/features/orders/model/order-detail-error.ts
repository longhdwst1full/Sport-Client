import { apiErrorMessage } from '@/lib/api/error-message';

export function errorMessage(error: unknown): string {
  return apiErrorMessage(error, 'Không tải được đơn hàng. Vui lòng kiểm tra tài khoản hoặc đường dẫn truy cập.');
}
