import type { FieldErrors, FieldValues, Resolver, ResolverResult } from 'react-hook-form';
import type { LoginDto, RegisterCustomerDto } from '@/generated/api/auth/auth.schemas';
import { CONTACT_ERROR, isEmail, isVietnamesePhone } from '@/shared/validation';

/**
 * PERFORMANCE: resolver viết tay thay cho `yup` + `@hookform/resolvers` (~25 KB gzip chỉ cho /login và
 * /register). Hai form chỉ có vài luật cố định; giữ đúng hành vi cũ: trim họ tên/định danh, email/SĐT rỗng
 * → `undefined` (không gửi), lỗi đầu tiên của mỗi ô, và "cần email hoặc SĐT" báo ở ô email.
 */

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

const PASSWORD_ERROR = {
  REQUIRED: 'Vui lòng nhập mật khẩu',
  MIN: `Mật khẩu tối thiểu ${PASSWORD_MIN} ký tự`,
  MAX: `Mật khẩu tối đa ${PASSWORD_MAX} ký tự`,
} as const;

const tooLong = (max: number) => `Tối đa ${max} ký tự`;

function passwordError(password: string | undefined): string | undefined {
  if (!password) return PASSWORD_ERROR.REQUIRED;
  if (password.length < PASSWORD_MIN) return PASSWORD_ERROR.MIN;
  if (password.length > PASSWORD_MAX) return PASSWORD_ERROR.MAX;
  return undefined;
}

type Messages<T> = Partial<Record<keyof T, string | undefined>>;

function toResult<T extends FieldValues>(values: T, messages: Messages<T>): ResolverResult<T> {
  const errors: Record<string, { type: string; message: string }> = {};
  for (const [field, message] of Object.entries(messages)) {
    if (message) errors[field] = { type: 'validate', message: message as string };
  }
  return Object.keys(errors).length ? { values: {}, errors: errors as FieldErrors<T> } : { values, errors: {} };
}

export function validateLogin(input: LoginDto) {
  const identifier = (input.identifier ?? '').trim();
  const values: LoginDto = { ...input, identifier };
  return toResult(values, {
    identifier: !identifier
      ? 'Vui lòng nhập email hoặc số điện thoại'
      : identifier.length > 255
        ? tooLong(255)
        : undefined,
    password: passwordError(input.password),
  });
}

export function validateRegister(input: RegisterCustomerDto) {
  const displayName = (input.displayName ?? '').trim();
  const email = input.email?.trim() || undefined;
  const phone = input.phone?.trim() || undefined;
  const values: RegisterCustomerDto = { ...input, displayName, email, phone };
  const emailError = email
    ? email.length > 255
      ? tooLong(255)
      : isEmail(email)
        ? undefined
        : CONTACT_ERROR.EMAIL_INVALID
    : phone
      ? undefined
      : 'Vui lòng cung cấp email hoặc số điện thoại';
  return toResult(values, {
    displayName: !displayName ? 'Vui lòng nhập họ và tên của bạn' : displayName.length > 255 ? tooLong(255) : undefined,
    email: emailError,
    phone: phone && (phone.length > 32 ? tooLong(32) : isVietnamesePhone(phone) ? undefined : CONTACT_ERROR.PHONE_INVALID),
    password: passwordError(input.password),
  });
}

export const loginResolver: Resolver<LoginDto> = async (values) => validateLogin(values);
export const registerResolver: Resolver<RegisterCustomerDto> = async (values) => validateRegister(values);
