import { forwardRef, type ButtonHTMLAttributes } from 'react';

/**
 * Native `<button>` passthrough. Every existing call site already carries a
 * fully-formed className (color/size/shadow tokens differ per screen), so
 * this primitive intentionally has no default style — it only removes the
 * duplicated element declaration.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function Button(props, ref) {
    return <button ref={ref} {...props} />;
  },
);
