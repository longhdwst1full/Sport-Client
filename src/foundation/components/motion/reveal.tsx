'use client';

import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

/**
 * Hiện dần khi phần tử lần đầu vào tầm nhìn (thay `framer-motion` `whileInView`, ~45 kB JS).
 * Hiệu ứng là CSS `animation` trên các thuộc tính riêng `translate`/`scale`/`opacity`/`filter`/`clip-path`
 * (class `.reveal`, globals.css) nên không đụng `transform` của hover (`hover:-translate-y-*`, Tailwind 3)
 * hay `transition-*` của phần tử. Fill mode `backwards`: hết hiệu ứng thì không để lại style nào.
 * Mọi `Reveal` dùng chung một IntersectionObserver theo `rootMargin`. `prefers-reduced-motion` thì hiện ngay.
 */
export type RevealVariant = 'fade-up' | 'fade' | 'zoom-in' | 'slide-left' | 'slide-right' | 'blur-in';

/** Bước trễ mặc định giữa các phần tử `stagger` cùng vào tầm nhìn. */
export const REVEAL_STAGGER_STEP_MS = 80;
/** Trễ stagger tối đa: hàng dài không bắt khách chờ phần tử cuối. */
export const REVEAL_STAGGER_MAX_MS = 480;

/** Độ trễ của phần tử thứ `index` trong một nhóm stagger, có chặn trần. */
export function staggerDelay(index: number, stepMs = REVEAL_STAGGER_STEP_MS, maxMs = REVEAL_STAGGER_MAX_MS) {
  return Math.min(index * stepMs, maxMs);
}

const observers = new Map<string, IntersectionObserver>();

function byDocumentOrder(left: Element, right: Element) {
  return left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

/**
 * Stagger theo lô (kiểu `ScrollTrigger.batch`): các phần tử `data-reveal-stagger` cùng vào tầm nhìn trong
 * một lần callback và cùng cha được trễ lần lượt theo thứ tự DOM — đúng số cột thực tế ở mọi breakpoint,
 * hàng sau cuộn tới lại bắt đầu từ 0.
 */
function reveal(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
  const visible = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target as HTMLElement);
  const groupIndex = new Map<Element | null, number>();
  for (const element of visible.sort(byDocumentOrder)) {
    const step = element.dataset.revealStagger;
    if (step !== undefined) {
      const index = groupIndex.get(element.parentElement) ?? 0;
      groupIndex.set(element.parentElement, index + 1);
      element.style.setProperty('--reveal-stagger', `${staggerDelay(index, Number(step) || REVEAL_STAGGER_STEP_MS)}ms`);
    }
    element.setAttribute('data-shown', '');
    observer.unobserve(element);
  }
}

function observeOnce(element: Element, rootMargin: string) {
  let observer = observers.get(rootMargin);
  if (!observer) {
    observer = new IntersectionObserver(reveal, { rootMargin });
    observers.set(rootMargin, observer);
  }
  observer.observe(element);
  return () => observer.unobserve(element);
}

type RevealTag = 'div' | 'article' | 'li' | 'section';

export function Reveal({
  as: Tag = 'div',
  variant = 'fade-up',
  delayMs = 0,
  durationMs = 600,
  offsetY,
  stagger,
  accent = false,
  rootMargin = '0px',
  style,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & {
  as?: RevealTag;
  variant?: RevealVariant;
  delayMs?: number;
  durationMs?: number;
  /** Độ lệch ban đầu (px) theo trục của biến thể; bỏ trống thì dùng mặc định trong CSS. */
  offsetY?: number;
  /** Trễ lần lượt với các phần tử anh em cùng vào tầm nhìn; `true` = 80ms/bước, số = bước (ms). */
  stagger?: boolean | number;
  /** Vạch nhấn trước `.eyebrow` bên trong được "vẽ" ra (scaleX) khi khối hiện. */
  accent?: boolean;
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
    ...(offsetY === undefined ? null : { '--reveal-offset': `${offsetY}px` }),
    ...style,
  } as CSSProperties;

  const staggerStep = stagger === true ? REVEAL_STAGGER_STEP_MS : stagger || undefined;

  return (
    <Tag
      ref={ref as never}
      className={className ? `reveal ${className}` : 'reveal'}
      style={revealStyle}
      data-reveal={variant}
      data-reveal-stagger={staggerStep}
      data-reveal-accent={accent ? '' : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
