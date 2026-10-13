'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Số liệu đếm lên một lần khi vào tầm nhìn. SSR/không JS/`prefers-reduced-motion` hiển thị nguyên chuỗi
 * gốc (không lệch hydration). Bản sao ẩn ở `::before` giữ đúng bề rộng chuỗi cuối nên khi đếm không
 * xô layout.
 */
const NUMBER_PATTERN = /^(\d{1,3}(?:\.\d{3})+|\d+(?:\.\d+)?)(.*)$/;

function parseStat(value: string) {
  const match = NUMBER_PATTERN.exec(value);
  if (!match) return null;
  const [, raw, suffix] = match;
  // `30.000` (nhóm nghìn kiểu vi-VN) khác `4.9` (thập phân).
  const grouped = /^\d{1,3}(?:\.\d{3})+$/.test(raw);
  const target = grouped ? Number(raw.replace(/\./g, '')) : Number(raw);
  const decimals = grouped ? 0 : (raw.split('.')[1]?.length ?? 0);
  return { target, decimals, grouped, suffix };
}

function easeOutExpo(progress: number) {
  return progress >= 1 ? 1 : 1 - 2 ** (-10 * progress);
}

export function useCountUp(value: string, durationMs = 1400) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const element = ref.current;
    const stat = parseStat(value);
    if (!element || !stat || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const format = (current: number) => {
      const number = stat.grouped
        ? Math.round(current).toLocaleString('vi-VN')
        : current.toFixed(stat.decimals);
      return `${number}${stat.suffix}`;
    };

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          setDisplay(progress >= 1 ? value : format(stat.target * easeOutExpo(progress)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        setDisplay(format(0));
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: '-40px' },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      setDisplay(value);
    };
  }, [value, durationMs]);

  return { ref, display };
}

export function CountUp({ value, durationMs, className }: { value: string; durationMs?: number; className?: string }) {
  const { ref, display } = useCountUp(value, durationMs);
  // Bản sao chuỗi cuối nằm ở `::before` (không thành text trong DOM) chỉ để giữ bề rộng.
  const base =
    'inline-grid tabular-nums before:invisible before:col-start-1 before:row-start-1 before:content-[attr(data-value)]';
  return (
    <span ref={ref} data-value={value} className={className ? `${base} ${className}` : base}>
      <span className="col-start-1 row-start-1">{display}</span>
    </span>
  );
}
