import type { ReactNode } from 'react';

/**
 * Label + control wrapper. Kept intentionally minimal (label then control)
 * so a call site's exact previous label className/text can be reproduced —
 * it does not render its own error/hint slot because existing call sites all
 * render that separately (see `InlineAlert`).
 */
export function Field({
  label,
  labelClassName,
  children,
}: {
  label: ReactNode;
  labelClassName?: string;
  children: ReactNode;
}) {
  return (
    <>
      <label className={labelClassName}>{label}</label>
      {children}
    </>
  );
}
