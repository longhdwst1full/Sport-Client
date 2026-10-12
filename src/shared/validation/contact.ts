/**
 * Kiểm tra sơ bộ SĐT/email ở client để báo lỗi ngay khi nhập, trước khi gọi API.
 *
 * CONTRACT: Backend (`normalizeVietnamesePhone`, libphonenumber `VN`) vẫn là nơi quyết định cuối;
 * ở đây chỉ chặn các giá trị chắc chắn sai (thiếu/thừa số, đầu số không tồn tại) để không bắn báo giá
 * hay lưu địa chỉ với SĐT hỏng rồi nhận lỗi tiếng Anh từ server.
 */

/** Bỏ khoảng trắng/dấu chấm/gạch/ngoặc và đưa `+84`/`84`/`0084` về dạng `0xxxxxxxxx`. */
export function toLocalVietnamesePhone(value: string): string {
  let digits = value.trim().replace(/[\s.()-]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('84') && digits.length >= 11) digits = `0${digits.slice(2).replace(/^0/, '')}`;
  return digits;
}

// Di động: 03/05/07/08/09 + 8 số. Cố định: 02 + 9 số (mã vùng mới).
const VN_PHONE = /^0(?:[35789]\d{8}|2\d{9})$/;

export function isVietnamesePhone(value: string): boolean {
  return VN_PHONE.test(toLocalVietnamesePhone(value));
}

// Tương đương kiểm tra `type="email"` của trình duyệt, cộng thêm bắt buộc có tên miền cấp cao.
const EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

export function isEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length <= 254 && EMAIL.test(trimmed);
}

export const CONTACT_ERROR = {
  PHONE_REQUIRED: 'Vui lòng nhập số điện thoại.',
  PHONE_INVALID: 'Số điện thoại chưa đúng (VD: 0912 345 678).',
  EMAIL_INVALID: 'Email chưa đúng định dạng (VD: ten@gmail.com).',
} as const;

/** Lỗi SĐT để hiện dưới ô nhập; `undefined` khi hợp lệ. */
export function phoneError(value: string, { required = true } = {}): string | undefined {
  if (!value.trim()) return required ? CONTACT_ERROR.PHONE_REQUIRED : undefined;
  return isVietnamesePhone(value) ? undefined : CONTACT_ERROR.PHONE_INVALID;
}

/** Lỗi email (không bắt buộc mặc định); `undefined` khi hợp lệ hoặc để trống. */
export function emailError(value: string, { required = false } = {}): string | undefined {
  if (!value.trim()) return required ? 'Vui lòng nhập email.' : undefined;
  return isEmail(value) ? undefined : CONTACT_ERROR.EMAIL_INVALID;
}
