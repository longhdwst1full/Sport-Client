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
  backdropClassName,
  className,
  children,
}: {
  onClose?: () => void;
  disableClose?: boolean;
  backdropClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  useDialogA11y(panelRef, { onClose, disableClose });

  return (
    <div className={backdropClassName}>
      <div ref={panelRef} className={className} tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}
