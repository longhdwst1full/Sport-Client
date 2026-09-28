import { forwardRef, type InputHTMLAttributes } from 'react';

/**
 * Native `<input>` passthrough, same rationale as `Button`: every call site
 * already owns a fully-formed className, so this has no default style.
 */
export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput(props, ref) {
    return <input ref={ref} {...props} />;
  },
);
