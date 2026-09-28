import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Password input with a show/hide toggle. Callers pass their exact previous
 * wrapper/input/icon/toggle classNames so the rendered result is unchanged;
 * this primitive only owns the `showPassword` boolean so call sites stop
 * duplicating that piece of state.
 */
export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    wrapperClassName?: string;
    leadingIcon?: ReactNode;
    toggleClassName?: string;
    showLabel?: string;
    hideLabel?: string;
  }
>(function PasswordInput(
  { wrapperClassName, leadingIcon, toggleClassName, showLabel = 'Hiện mật khẩu', hideLabel = 'Ẩn mật khẩu', className, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={wrapperClassName}>
      <input ref={ref} type={visible ? 'text' : 'password'} className={className} {...props} />
      {leadingIcon}
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className={toggleClassName}
        aria-label={visible ? hideLabel : showLabel}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
});
