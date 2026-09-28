/**
 * Pagination dots for a carousel/slider. Callers keep their exact previous
 * base/active/inactive classNames (the "pill grows and changes color when
 * active" look differs slightly per screen), and supply `keyFor`/`ariaLabelFor`
 * so React keys and labels stay identical to what they replace.
 */
export function CarouselDots({
  count,
  activeIndex,
  onSelect,
  wrapperClassName,
  baseClassName,
  activeClassName,
  inactiveClassName,
  keyFor,
  ariaLabelFor,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  wrapperClassName?: string;
  baseClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  keyFor?: (index: number) => string | number;
  ariaLabelFor: (index: number) => string;
}) {
  return (
    <div className={wrapperClassName}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={keyFor ? keyFor(index) : index}
          type="button"
          onClick={() => onSelect(index)}
          className={`${baseClassName} ${index === activeIndex ? activeClassName : inactiveClassName}`}
          aria-label={ariaLabelFor(index)}
        />
      ))}
    </div>
  );
}
