import type { ReactNode } from 'react';
import { X } from 'lucide-react';

/**
 * Removable filter chip. Callers keep their exact previous className for the
 * pill and for the remove button so tone (emerald vs slate, etc.) never
 * changes; this primitive only removes the duplicated label+remove-button
 * shape.
 */
export function Chip({
  className,
  children,
  onRemove,
  removeAriaLabel,
  removeClassName,
}: {
  className?: string;
  children: ReactNode;
  onRemove?: () => void;
  removeAriaLabel?: string;
  removeClassName?: string;
}) {
  return (
    <span className={className}>
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} className={removeClassName} aria-label={removeAriaLabel}>
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
