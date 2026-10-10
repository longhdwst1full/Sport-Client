/**
 * Pagination dots for a carousel/slider. Callers keep their exact previous
 * base/active/inactive classNames (the "pill grows and changes color when
 * active" look differs slightly per screen), and supply `keyFor`/`ariaLabelFor`
 * so React keys and labels stay identical to what they replace.
 *
 * a11y: chấm hiển thị vẫn nhỏ (class của caller áp lên `<span>` bên trong) nhưng nút bọc ngoài có vùng
 * chạm tối thiểu 24×24px (WCAG 2.5.8); chấm đang chọn có `aria-current`.
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
  /** Mặc định "Chuyển tới slide n". */
  ariaLabelFor?: (index: number) => string;
}) {
  return (
    <div className={wrapperClassName}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={keyFor ? keyFor(index) : index}
          type="button"
          onClick={() => onSelect(index)}
          className="group grid min-h-6 min-w-6 place-items-center rounded-full p-1 focus-ring-inverse"
          aria-label={ariaLabelFor ? ariaLabelFor(index) : `Chuyển tới slide ${index + 1}`}
          aria-current={index === activeIndex ? 'true' : undefined}
        >
          <span
            aria-hidden
            className={`block ${baseClassName ?? ''} ${index === activeIndex ? activeClassName ?? '' : inactiveClassName ?? ''}`}
          />
        </button>
      ))}
    </div>
  );
}
