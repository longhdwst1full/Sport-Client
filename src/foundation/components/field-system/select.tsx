import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { resolveInputClassName, type InputSize } from './input-variants';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: InputSize;
  invalid?: boolean;
  /** Class cho khung bọc (chứa icon mũi tên). */
  wrapperClassName?: string;
}

/**
 * `<select>` gốc với style `inputVariants` + icon mũi tên riêng (`appearance-none`).
 * Tương thích ngược: không truyền `size`/`invalid` mà có `className` thì render `<select>` trần như trước.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size, invalid, className, wrapperClassName, ...props },
  ref,
) {
  const passthrough = size === undefined && invalid === undefined && Boolean(className);
  if (passthrough) {
    return <select ref={ref} {...props} className={className} />;
  }

  return (
    <div className={twMerge('relative', wrapperClassName)}>
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        {...props}
        className={resolveInputClassName({ size, invalid, className }, 'appearance-none pr-10')}
      />
      <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
    </div>
  );
});
