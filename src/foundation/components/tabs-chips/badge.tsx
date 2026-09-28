import type { ElementType, ReactNode } from 'react';

/**
 * Presentational status pill. Callers keep passing their exact previous
 * className (color/border/backdrop tokens differ per domain status), so this
 * primitive only removes the duplicated `<span className="...">` shape.
 */
export function Badge({
  as: Tag = 'span',
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={className}>{children}</Tag>;
}
