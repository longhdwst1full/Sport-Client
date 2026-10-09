import type { ReactNode } from 'react';
import { InlineAlert } from '@/foundation/components/feedback';
import { Field } from '@/foundation/components/field-system';

/**
 * Phần riêng của ô nhập trang đăng nhập/đăng ký (nền xám nhạt, bo lớn, chừa chỗ icon trái), đè lên
 * `TextInput`/`PasswordInput` `size="lg"`.
 */
export const AUTH_INPUT_CLASS = 'rounded-xl border-neutral-200 bg-neutral-50/60 pl-10.5 text-xs sm:text-sm focus-visible:bg-white';

export const AUTH_LEADING_ICON_CLASS = 'pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400';

/** Nhãn (+ hành động phụ bên phải qua `Field.labelAction`) → control → lỗi, dùng chung cho form đăng nhập/đăng ký. */
export function AuthField({
  id,
  label,
  labelAction,
  error,
  hint,
  children,
}: {
  id: string;
  label: ReactNode;
  labelAction?: ReactNode;
  error?: string;
  /** Gợi ý hiển thị dưới dòng lỗi. */
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <Field
        label={label}
        htmlFor={id}
        labelAction={labelAction}
        labelClassName="block text-xs font-bold uppercase tracking-wider text-neutral-700"
      >
        {children}
      </Field>
      {error && (
        <InlineAlert as="span" role="alert" className="mt-1 block text-xs font-medium text-red-600">
          {error}
        </InlineAlert>
      )}
      {hint}
    </div>
  );
}

/** Phần riêng của nút gửi form auth, đè lên `Button size="lg" fullWidth`. */
export const AUTH_SUBMIT_CLASS =
  'mt-4 sm:mt-5 h-11 sm:h-12 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 font-black text-xs sm:text-sm shadow-md shadow-neutral-900/20 hover:shadow-neutral-900/30 active:scale-[0.99] disabled:opacity-60';

/** Nhãn ô nhập của các trang khôi phục mật khẩu (quên / đặt lại). */
export const RECOVERY_LABEL_CLASS = 'block text-xs font-bold uppercase tracking-wider text-neutral-600';

/** Khung căn giữa dùng chung cho mọi trạng thái của trang quên / đặt lại mật khẩu. */
export function AuthRecoveryMain({ children }: { children: ReactNode }) {
  return <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">{children}</main>;
}
