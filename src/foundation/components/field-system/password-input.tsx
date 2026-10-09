import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { inputVariants, type InputSize } from './input-variants';

/**
 * Password input with a show/hide toggle. Callers pass their exact previous
 * wrapper/input/icon/toggle classNames so the rendered result is unchanged;
 * this primitive only owns the `showPassword` boolean so call sites stop
 * duplicating that piece of state.
 */
export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
    wrapperClassName?: string;
    leadingIcon?: ReactNode;
    toggleClassName?: string;
    showLabel?: string;
    hideLabel?: string;
    /** Bật style chuẩn (`inputVariants` + nút ẩn/hiện đặt sẵn bên phải). Bỏ trống = passthrough như cũ. */
    size?: InputSize;
    invalid?: boolean;
  }
>(function PasswordInput(
  { wrapperClassName, leadingIcon, toggleClassName, showLabel = 'Hiện mật khẩu', hideLabel = 'Ẩn mật khẩu', className, size, invalid, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const styled = size !== undefined || invalid !== undefined;
  return (
    <div className={styled ? twMerge('relative', wrapperClassName) : wrapperClassName}>
      <input
        ref={ref}
        type={visible ? 'text' : 'password'}
        aria-invalid={invalid || undefined}
        className={styled ? inputVariants({ size, invalid, className: twMerge('pr-12', className) }) : className}
        {...props}
      />
      {leadingIcon}
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className={
          styled
            ? twMerge(
                'absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-neutral-500 hover:text-neutral-800 focus-ring-tight',
                toggleClassName,
              )
            : toggleClassName
        }
        aria-label={visible ? hideLabel : showLabel}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
});
