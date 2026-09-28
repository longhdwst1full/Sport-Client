import { Star } from 'lucide-react';

/**
 * 5-star rating, display-only by default. Passing `onChange` switches each
 * star to a clickable button (used by the review form). Callers keep their
 * exact previous wrapper/icon/inactive classNames so tone (light vs dark
 * background) never changes, and display mode renders the icon directly (no
 * extra wrapper element) to match the previous markup exactly.
 */
export function RatingStars({
  value,
  onChange,
  size = 'size-4',
  activeClassName = 'fill-current',
  inactiveClassName,
  wrapperClassName,
  ariaLabel,
  starButtonClassName,
  starAriaLabel,
}: {
  value: number;
  onChange?: (next: number) => void;
  size?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  wrapperClassName?: string;
  ariaLabel?: string;
  starButtonClassName?: string;
  starAriaLabel?: (star: number) => string;
}) {
  return (
    <div className={wrapperClassName} aria-label={ariaLabel}>
      {[1, 2, 3, 4, 5].map((star) =>
        onChange ? (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={starButtonClassName}
            aria-label={starAriaLabel?.(star)}
          >
            <Star className={`${size} ${star <= value ? activeClassName : inactiveClassName}`} />
          </button>
        ) : (
          <Star key={star} className={`${size} ${star <= value ? activeClassName : inactiveClassName}`} />
        ),
      )}
    </div>
  );
}
