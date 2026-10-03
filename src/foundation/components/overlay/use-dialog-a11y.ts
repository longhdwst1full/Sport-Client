'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared a11y wiring for Modal/Drawer and hand-rolled dialogs: Escape-to-close (unless `disableClose`),
 * moving focus into the dialog on open, restoring it to whatever had focus before on close/unmount,
 * and an optional Tab/Shift+Tab focus trap (`trapFocus`). `initialFocus: 'container'` focuses the
 * container itself instead of its first focusable (e.g. to avoid opening a mobile keyboard).
 * Overlays render while mounted (call sites unmount on close), so "on open" is "on mount".
 */
export function useDialogA11y(
  containerRef: RefObject<HTMLElement | null>,
  {
    onClose,
    disableClose,
    trapFocus,
    initialFocus = 'first',
  }: {
    onClose?: () => void;
    disableClose?: boolean;
    trapFocus?: boolean;
    initialFocus?: 'first' | 'container';
  },
) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const container = containerRef.current;
    const focusable =
      initialFocus === 'first' ? container?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) : null;
    (focusable ?? container)?.focus({ preventScroll: true });

    return () => {
      previouslyFocused.current?.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!onClose && !trapFocus) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (onClose && !disableClose) onClose();
        return;
      }
      if (event.key !== 'Tab' || !trapFocus) return;

      const container = containerRef.current;
      if (!container) return;
      const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (items.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === container || !container.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !container.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, onClose, disableClose, trapFocus]);
}
