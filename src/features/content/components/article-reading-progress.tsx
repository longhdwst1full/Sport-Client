'use client';

import { useEffect, useState } from 'react';

/**
 * Top reading progress indicator for editorial articles.
 * Uses requestAnimationFrame for buttery smooth 60fps rendering without jank.
 */
export function ArticleReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docElement = document.documentElement;
          const totalHeight = docElement.scrollHeight - docElement.clientHeight;
          if (totalHeight > 0) {
            const currentScroll = window.scrollY || docElement.scrollTop;
            const scrollPercentage = Math.min(
              100,
              Math.max(0, (currentScroll / totalHeight) * 100),
            );
            setProgress(scrollPercentage);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-[65] h-1 w-full bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-amber-400 transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
