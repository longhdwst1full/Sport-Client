import type { ReactNode } from 'react';

/**
 * Backdrop + sliding panel wrapper. Deliberately has no built-in close
 * handling — call sites keep managing their own close button/behavior so
 * converting a site to this primitive changes no behavior, only removes the
 * duplicated two-`div` shape.
 */
export function Drawer({
  backdropClassName,
  className,
  children,
}: {
  backdropClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={backdropClassName}>
      <div className={className}>{children}</div>
    </div>
  );
}
