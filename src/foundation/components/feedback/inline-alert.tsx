import type { ElementType, ReactNode } from 'react';

/**
 * Presentational inline alert. Every call site keeps its exact previous
 * className/tag/role so migrating a spot never changes its look — this
 * primitive only removes the duplicated JSX shape, not the styling.
 */
export function InlineAlert({
  as: Tag = 'div',
  role,
  className,
  children,
}: {
  as?: ElementType;
  role?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag role={role} className={className}>
      {children}
    </Tag>
  );
}
