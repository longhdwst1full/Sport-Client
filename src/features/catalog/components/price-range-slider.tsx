'use client';

import { useEffect, useRef, useState } from 'react';
import { formatVnd } from '@/shared/format/money';
import {
  PRICE_SLIDER,
  formatPriceInput,
  normalizePriceRange,
  parsePriceInput,
  snapToStep,
} from '../model/catalog-price-range';

export interface PriceRangeSliderProps {
  /** Giá trị đang áp (từ URL); `null` = không giới hạn phía đó. */
  min: number | null;
  max: number | null;
  /** Ghi vào URL. Gọi khi thả tay/phím, rời ô nhập, hoặc sau `COMMIT_DELAY_MS` ngừng thao tác. */
  onChange: (min: number | null, max: number | null) => void;
}

const COMMIT_DELAY_MS = 300;
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1';
const THUMB =
  'pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent ' +
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-action [&::-webkit-slider-thumb]:shadow ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-action ' +
  'focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-neutral-900 focus-visible:[&::-moz-range-thumb]:ring-2 focus-visible:[&::-moz-range-thumb]:ring-neutral-900';

/**
 * Bộ lọc khoảng giá hai tay cầm (hai `<input type="range">` native, phím mũi tên/Home/End dùng được)
 * kèm hai ô nhập số. URL là nguồn sự thật: state nháp chỉ giữ giữa các lần kéo và đồng bộ lại khi
 * `min`/`max` từ URL đổi; mỗi pixel kéo không gửi request, chỉ commit sau khi thả hoặc ngừng 300ms.
 */
export function PriceRangeSlider({ min, max, onChange }: PriceRangeSliderProps) {
  const [draftMin, setDraftMin] = useState<number>(min ?? PRICE_SLIDER.min);
  const [draftMax, setDraftMax] = useState<number>(max ?? PRICE_SLIDER.max);
  const [minText, setMinText] = useState<string | null>(null);
  const [maxText, setMaxText] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef({ draftMin, draftMax, onChange });
  latest.current = { draftMin, draftMax, onChange };

  // URL đổi (reset, chip, link ngân sách, back/forward) → kéo nháp về đúng giá trị URL.
  useEffect(() => {
    setDraftMin(min ?? PRICE_SLIDER.min);
    setDraftMax(max ?? PRICE_SLIDER.max);
  }, [min, max]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const commit = (nextMin: number | null, nextMax: number | null) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const normalized = normalizePriceRange(nextMin, nextMax);
    setDraftMin(normalized.min ?? PRICE_SLIDER.min);
    setDraftMax(normalized.max ?? PRICE_SLIDER.max);
    if (normalized.min !== min || normalized.max !== max) latest.current.onChange(normalized.min, normalized.max);
  };
  const commitDraft = () => commit(latest.current.draftMin, latest.current.draftMax);
  const scheduleCommit = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(commitDraft, COMMIT_DELAY_MS);
  };

  const onMinSlide = (value: number) => {
    setDraftMin(Math.min(value, draftMax - PRICE_SLIDER.step));
    scheduleCommit();
  };
  const onMaxSlide = (value: number) => {
    setDraftMax(Math.max(value, draftMin + PRICE_SLIDER.step));
    scheduleCommit();
  };

  const commitMinText = () => {
    const parsed = parsePriceInput(minText ?? '');
    setMinText(null);
    if (parsed === null) return commit(null, draftMax >= PRICE_SLIDER.max ? null : draftMax);
    commit(parsed, draftMax >= PRICE_SLIDER.max ? null : draftMax);
  };
  const commitMaxText = () => {
    const parsed = parsePriceInput(maxText ?? '');
    setMaxText(null);
    commit(draftMin <= PRICE_SLIDER.min ? null : draftMin, parsed);
  };

  const span = PRICE_SLIDER.max - PRICE_SLIDER.min;
  const left = ((draftMin - PRICE_SLIDER.min) / span) * 100;
  const right = ((draftMax - PRICE_SLIDER.min) / span) * 100;
  const maxUnlimited = draftMax >= PRICE_SLIDER.max;
  const minOnTop = draftMin > PRICE_SLIDER.max - PRICE_SLIDER.step * 2;

  const rangeProps = {
    min: PRICE_SLIDER.min,
    max: PRICE_SLIDER.max,
    step: PRICE_SLIDER.step,
    onPointerUp: commitDraft,
    onKeyUp: commitDraft,
    onBlur: commitDraft,
  };

  return (
    <div className="space-y-3" role="group" aria-label="Khoảng giá">
      <div className="relative mx-2 h-5">
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-neutral-200" />
        <div
          aria-hidden
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-action"
          style={{ left: `${left}%`, right: `${100 - right}%` }}
        />
        <input
          type="range"
          aria-label="Giá thấp nhất"
          aria-valuetext={formatVnd(draftMin)}
          value={draftMin}
          onChange={(event) => onMinSlide(snapToStep(Number(event.target.value)))}
          className={`${THUMB} ${minOnTop ? 'z-20' : 'z-10'}`}
          {...rangeProps}
        />
        <input
          type="range"
          aria-label="Giá cao nhất"
          aria-valuetext={maxUnlimited ? 'Không giới hạn' : formatVnd(draftMax)}
          value={draftMax}
          onChange={(event) => onMaxSlide(snapToStep(Number(event.target.value)))}
          className={`${THUMB} z-10`}
          {...rangeProps}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Giá từ (VND)</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Từ"
            aria-label="Giá từ (VND)"
            value={minText ?? (draftMin <= PRICE_SLIDER.min ? '' : formatPriceInput(draftMin))}
            onChange={(event) => setMinText(event.target.value)}
            onBlur={() => minText !== null && commitMinText()}
            onKeyDown={(event) => event.key === 'Enter' && commitMinText()}
            className={`w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-600 ${FOCUS_RING}`}
          />
        </label>
        <span aria-hidden className="text-neutral-600">–</span>
        <label className="min-w-0 flex-1">
          <span className="sr-only">Giá đến (VND)</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Không giới hạn"
            aria-label="Giá đến (VND)"
            value={maxText ?? (maxUnlimited ? '' : formatPriceInput(draftMax))}
            onChange={(event) => setMaxText(event.target.value)}
            onBlur={() => maxText !== null && commitMaxText()}
            onKeyDown={(event) => event.key === 'Enter' && commitMaxText()}
            className={`w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-600 ${FOCUS_RING}`}
          />
        </label>
      </div>
      <p className="text-3xs font-semibold text-neutral-600" aria-live="polite">
        {formatVnd(draftMin)} – {maxUnlimited ? 'Không giới hạn' : formatVnd(draftMax)}
      </p>
    </div>
  );
}
