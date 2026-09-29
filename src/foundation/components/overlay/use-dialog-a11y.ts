'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * Shared a11y wiring for Modal/Drawer: Escape-to-close (unless `disableClose`) and moving focus
 * into the dialog on open, restoring it to whatever had focus before on close/unmount. Both
 * overlays render while mounted (call sites unmount on close), so "on open" is "on mount".
 */
export function useDialogA11y(
  containerRef: RefObject<HTMLElement | null>,
  { onClose, disableClose }: { onClose?: () => void; disableClose?: boolean },
) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const container = containerRef.current;
    const focusable = container?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    (focusable ?? container)?.focus({ preventScroll: true });

    return () => {
      previouslyFocused.current?.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !disableClose) onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, disableClose]);
}
