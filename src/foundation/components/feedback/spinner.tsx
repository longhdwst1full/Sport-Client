import { LoaderCircle } from 'lucide-react';

/**
 * Thin wrapper around the loading icon used across the app. Callers pass their
 * exact previous `className` (size + color) so visual output stays unchanged;
 * this primitive only centralizes which icon renders as "the spinner".
 */
export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle className={className} />;
}
