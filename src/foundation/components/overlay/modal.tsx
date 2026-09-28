import type { ReactNode } from 'react';

/**
 * Backdrop + dialog wrapper. This mirrors exactly the structure already used
 * by the one call site with `role="dialog"`/`aria-modal` today (backdrop
 * click-outside close, no Esc handling, no focus trap yet) — it only removes
 * duplicated JSX, it does not add new a11y behavior a call site didn't
 * already have.
 */
export function Modal({
  onClose,
  disableClose,
  labelledBy,
  backdropClassName,
  className,
  children,
}: {
  onClose: () => void;
  disableClose?: boolean;
  labelledBy: string;
  backdropClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={backdropClassName}
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && !disableClose && onClose()}
    >
      <section role="dialog" aria-modal="true" aria-labelledby={labelledBy} className={className}>
        {children}
      </section>
    </div>
  );
}
