import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { resolveInputClassName } from './input-variants';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** Dùng style chuẩn và chỉ thêm `className` (Textarea không có `size` để bật style). */
  styled?: boolean;
}

/** Ô nhập nhiều dòng; cùng style `inputVariants`, chiều cao tự do (`min-h-24`). Tương thích ngược như `TextInput`. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, styled, className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      {...props}
      className={resolveInputClassName({ invalid, styled, className }, 'h-auto min-h-24 py-2.5')}
    />
  );
});
