'use client';

import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

function subscribeReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const isDocumentVisible = () => !document.hidden;
const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION_QUERY).matches;

/**
 * Cho biết vòng tự chạy (slider, ticker) có nên chạy lúc này hay không: phần tử đang trong
 * viewport, tab đang mở và người dùng không bật `prefers-reduced-motion: reduce`.
 *
 * Mặc định coi phần tử là đang hiển thị cho tới khi IntersectionObserver báo khác, nên với người
 * dùng bình thường vòng quay bắt đầu đúng lúc như trước; chỉ dừng khi cuộn khỏi màn hình hoặc ẩn
 * tab, và chạy lại khi quay về.
 */
export function useAutoplayAllowed(ref: RefObject<Element | null>): boolean {
  const [inViewport, setInViewport] = useState(true);
  const visible = useSyncExternalStore(subscribeVisibility, isDocumentVisible, () => true);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inViewport && visible && !reducedMotion;
}
