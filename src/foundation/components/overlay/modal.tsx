'use client';

import { useRef, type ReactNode } from 'react';
import { useDialogA11y } from './use-dialog-a11y';

/**
 * Backdrop + dialog wrapper. Mirrors the structure already used by the one call site with
 * `role="dialog"`/`aria-modal` (backdrop click-outside close). Adds Escape-to-close (respecting
 * `disableClose`) and moves focus into the dialog on open, restoring it on close — no visual change.
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
  const dialogRef = useRef<HTMLElement | null>(null);
  useDialogA11y(dialogRef, { onClose, disableClose });

  return (
    <div
      className={backdropClassName}
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && !disableClose && onClose()}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={className}
        tabIndex={-1}
      >
        {children}
      </section>
    </div>
  );
}
