import { forwardRef, type InputHTMLAttributes } from 'react';
import { resolveInputClassName, type InputSize } from './input-variants';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  /** Viền đỏ + `aria-invalid`. */
  invalid?: boolean;
}

/**
 * Ô nhập của design system. Tương thích ngược: không truyền `size`/`invalid` mà có `className` thì
 * giữ nguyên passthrough (call site cũ tự mang className đầy đủ). Dùng được trong `Field` (nhận `id`).
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { size, invalid, className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      {...props}
      className={resolveInputClassName({ size, invalid, className })}
    />
  );
});
