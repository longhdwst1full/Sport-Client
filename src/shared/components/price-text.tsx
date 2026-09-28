/**
 * Presentational price display: a primary label plus an optional struck-out
 * reference price. Callers pass already-formatted labels (formatted with
 * `formatVnd`) and their exact previous classNames/tag so the rendered price
 * never changes look — only the mapper/component decides the numbers.
 */
export function PriceText({
  label,
  strikeLabel,
  className,
  strikeClassName,
}: {
  label: string;
  strikeLabel?: string | null;
  className?: string;
  strikeClassName?: string;
}) {
  return (
    <>
      <strong className={className}>{label}</strong>
      {strikeLabel ? <span className={strikeClassName}>{strikeLabel}</span> : null}
    </>
  );
}
