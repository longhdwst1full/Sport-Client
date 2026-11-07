'use client';

import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * Decrement/value/increment control. Callers keep their exact previous
 * wrapper/button/value classNames (disabled styling differs: cart uses the
 * native `disabled` attribute, the product panel only dims via className),
 * so this primitive only removes the duplicated 3-element shape.
 *
 * `onValueCommit` turns the value into a numeric text box: the draft is committed
 * on blur/Enter and the caller clamps it (the stepper knows no stock rule).
 */
export function QuantityStepper({
  value,
  onDecrement,
  onIncrement,
  onValueCommit,
  decrementDisabled,
  incrementDisabled,
  wrapperClassName,
  decrementClassName,
  incrementClassName,
  valueClassName,
  iconSize = 'size-3.5',
  decrementAriaLabel = 'Giảm số lượng',
  incrementAriaLabel = 'Tăng số lượng',
  valueAriaLabel = 'Số lượng',
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  onValueCommit?: (value: number) => void;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  wrapperClassName?: string;
  decrementClassName?: string;
  incrementClassName?: string;
  valueClassName?: string;
  iconSize?: string;
  decrementAriaLabel?: string;
  incrementAriaLabel?: string;
  valueAriaLabel?: string;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    if (!onValueCommit) return;
    const parsed = Number.parseInt(draft, 10);
    if (Number.isNaN(parsed)) setDraft(String(value));
    else onValueCommit(parsed);
  };

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
      {onValueCommit ? (
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={draft}
          onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
          onBlur={() => {
            commit();
            // Caller may keep the same value (clamped to the current one): show it again.
            setDraft(String(value));
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
          }}
          className={`${valueClassName ?? ''} bg-transparent outline-none`}
          aria-label={valueAriaLabel}
        />
      ) : (
        <span className={valueClassName}>{value}</span>
      )}
      <button
        type="button"
        onClick={onIncrement}
        disabled={incrementDisabled}
        className={incrementClassName}
        aria-label={incrementAriaLabel}
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
