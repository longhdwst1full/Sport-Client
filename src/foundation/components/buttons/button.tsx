import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Spinner } from '../feedback/spinner';
import { buttonVariants, type ButtonSize, type ButtonVariant } from './button-variants';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Hiện Spinner, đặt `aria-busy` và khoá nút trong lúc chờ. */
  loading?: boolean;
  /** Icon trước nhãn; đang `loading` thì Spinner thế chỗ để nút không đổi bề rộng. */
  leftIcon?: ReactNode;
  /** Icon sau nhãn; ẩn khi đang `loading`. */
  rightIcon?: ReactNode;
}

/**
 * Nút của design system. Mặc định `type="button"`.
 *
 * Tương thích ngược: không truyền `variant`/`size`/`fullWidth` thì KHÔNG gắn style nào (giữ hành vi
 * passthrough cho các call site cũ tự mang className đầy đủ). Có ít nhất một prop style thì dùng
 * `buttonVariants` (variant mặc định `primary`, size mặc định `md`) và merge `className` của caller.
 *
 * `size="icon"` + `loading`: Spinner thay luôn `children` (nút chỉ có icon).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, loading = false, leftIcon, rightIcon, className, type = 'button', disabled, children, ...rest },
  ref,
) {
  const styled = variant !== undefined || size !== undefined || fullWidth !== undefined;
  const classes = styled ? buttonVariants({ variant, size, fullWidth, className }) : className;
  const spinner = loading ? <Spinner className="size-4" /> : null;
  const iconOnly = size === 'icon';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={loading && classes ? twMerge(classes, 'disabled:cursor-wait') : classes}
      {...rest}
    >
      {spinner ?? leftIcon}
      {iconOnly && loading ? null : children}
      {!loading && rightIcon}
    </button>
  );
});
