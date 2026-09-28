import { Minus, Plus } from 'lucide-react';

/**
 * Decrement/value/increment control. Callers keep their exact previous
 * wrapper/button/value classNames (disabled styling differs: cart uses the
 * native `disabled` attribute, the product panel only dims via className),
 * so this primitive only removes the duplicated 3-element shape.
 */
export function QuantityStepper({
  value,
  onDecrement,
  onIncrement,
  decrementDisabled,
  wrapperClassName,
  decrementClassName,
  incrementClassName,
  valueClassName,
  iconSize = 'size-3.5',
  decrementAriaLabel = 'Giảm số lượng',
  incrementAriaLabel = 'Tăng số lượng',
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  decrementDisabled?: boolean;
  wrapperClassName?: string;
  decrementClassName?: string;
  incrementClassName?: string;
  valueClassName?: string;
  iconSize?: string;
  decrementAriaLabel?: string;
  incrementAriaLabel?: string;
}) {
  return (
    <div className={wrapperClassName}>
      <button
        type="button"
        onClick={onDecrement}
        disabled={decrementDisabled}
        className={decrementClassName}
        aria-label={decrementAriaLabel}
      >
        <Minus className={iconSize} />
      </button>
      <span className={valueClassName}>{value}</span>
      <button type="button" onClick={onIncrement} className={incrementClassName} aria-label={incrementAriaLabel}>
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
