import type { ElementType, ReactNode } from 'react';

/**
 * Presentational panel wrapper. The many `rounded-3xl border ... bg-white`
 * blocks across features differ in padding/shadow/tag, so this primitive
 * only centralizes the shape, not a fixed style — callers keep their exact
 * previous className/tag.
 */
export function Card({
  as: Tag = 'div',
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={className}>{children}</Tag>;
}
