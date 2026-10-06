import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Nhãn bấm được; bỏ trống thì caller phải truyền `aria-label`. */
  label?: ReactNode;
  /** Mô tả phụ dưới nhãn. */
  description?: ReactNode;
  wrapperClassName?: string;
}

/**
 * Checkbox native (giữ hành vi bàn phím/form của trình duyệt) với style chuẩn: ô 20px, màu brand,
 * vùng bấm gồm cả nhãn để đạt kích thước chạm trên mobile.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, wrapperClassName, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const input = (
    <input
      ref={ref}
      id={inputId}
      type="checkbox"
      className={twMerge(
        'size-5 shrink-0 cursor-pointer rounded border-slate-300 accent-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
  if (!label) return input;
  return (
    <label htmlFor={inputId} className={twMerge('flex min-h-11 cursor-pointer items-start gap-3 py-2', wrapperClassName)}>
      <span className="pt-0.5">{input}</span>
      <span className="text-sm text-slate-700">
        {label}
        {description ? <span className="mt-0.5 block text-xs text-slate-500">{description}</span> : null}
      </span>
    </label>
  );
});
