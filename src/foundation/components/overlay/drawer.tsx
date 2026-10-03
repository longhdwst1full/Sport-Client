'use client';

import { useRef, type ReactNode } from 'react';
import { useDialogA11y } from './use-dialog-a11y';

/**
 * Backdrop + sliding panel wrapper. `onClose`/`disableClose` are optional so call sites that keep
 * managing their own close behavior are unaffected; when passed, wires Escape-to-close (respecting
 * `disableClose`) and moves focus into the panel on open, restoring it on close — no visual change.
 */
export function Drawer({
  onClose,
  disableClose,
  labelledBy,
  ariaLabel,
  backdropClassName,
  className,
  children,
}: {
  onClose?: () => void;
  disableClose?: boolean;
  /** id của tiêu đề (aria-labelledby); ưu tiên hơn `ariaLabel`. */
  labelledBy?: string;
  ariaLabel?: string;
  backdropClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  useDialogA11y(panelRef, { onClose, disableClose, trapFocus: true });

  return (
    <div className={backdropClassName}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : ariaLabel}
        className={className}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
