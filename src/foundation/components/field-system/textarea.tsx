import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { resolveInputClassName } from './input-variants';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

/** Ô nhập nhiều dòng; cùng style `inputVariants`, chiều cao tự do (`min-h-24`). Tương thích ngược như `TextInput`. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      {...props}
      className={resolveInputClassName({ invalid, className }, 'h-auto min-h-24 py-2.5')}
    />
  );
});
