'use client';

import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

/**
 * Hiện dần + trượt lên khi phần tử lần đầu vào tầm nhìn (thay `framer-motion` `whileInView`, ~45 kB JS).
 * Hiệu ứng là CSS `animation` trên `translate`/`opacity` (class `.reveal`, globals.css) nên không đụng
 * `transform` của hover (`hover:-translate-y-*`) hay `transition-*` của phần tử. Mọi `Reveal` dùng chung
 * một IntersectionObserver theo `rootMargin`. `prefers-reduced-motion` thì hiện ngay.
 */
const observers = new Map<string, IntersectionObserver>();

function observeOnce(element: Element, rootMargin: string) {
  let observer = observers.get(rootMargin);
  if (!observer) {
    observer = new IntersectionObserver(
      (entries, current) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-shown', '');
          current.unobserve(entry.target);
        }
      },
      { rootMargin },
    );
    observers.set(rootMargin, observer);
  }
  observer.observe(element);
  return () => observer.unobserve(element);
}

type RevealTag = 'div' | 'article' | 'li' | 'section';

export function Reveal({
  as: Tag = 'div',
  delayMs = 0,
  durationMs = 300,
  offsetY = 15,
  rootMargin = '0px',
  style,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & {
  as?: RevealTag;
  delayMs?: number;
  durationMs?: number;
  /** Độ lệch ban đầu theo trục Y (px). */
  offsetY?: number;
  /** Như `viewport.margin` của framer-motion, ví dụ `-50px` để hiện muộn hơn một chút. */
  rootMargin?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      element.setAttribute('data-shown', '');
      return;
    }
    return observeOnce(element, rootMargin);
  }, [rootMargin]);

  const revealStyle = {
    '--reveal-delay': `${delayMs}ms`,
    '--reveal-duration': `${durationMs}ms`,
    '--reveal-y': `${offsetY}px`,
    ...style,
  } as CSSProperties;

  return (
    <Tag ref={ref as never} className={className ? `reveal ${className}` : 'reveal'} style={revealStyle} {...rest}>
      {children}
    </Tag>
  );
}
