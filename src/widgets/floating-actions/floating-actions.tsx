'use client';

import { ArrowUp, MessageCircle, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { STORE_CONTACT } from '@/constants';

export function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-center gap-3 sm:bottom-8 sm:right-6">
      {/* Zalo */}
      <a
        href={STORE_CONTACT.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative grid size-12 place-items-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-110 hover:shadow-xl hover:shadow-blue-500/30 sm:size-14"
        aria-label="Chat Zalo"
      >
        <MessageCircle className="size-5 sm:size-6" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
          Chat Zalo
        </span>
      </a>

      {/* Phone */}
      <a
        href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
        className="group relative grid size-12 place-items-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/25 transition-all hover:scale-110 hover:shadow-xl hover:shadow-brand-600/30 sm:size-14"
        aria-label="Gọi hotline"
      >
        <Phone className="size-5 sm:size-6" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
          {STORE_CONTACT.primaryHotline}
        </span>
        {/* Pulsing ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-600/30" />
      </a>

      {/* Back to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`grid size-11 place-items-center rounded-full bg-white text-ink shadow-lg ring-1 ring-ink/10 transition-all hover:bg-ink hover:text-white sm:size-12 ${
          showBackToTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        aria-label="Lên đầu trang"
      >
        <ArrowUp className="size-5" />
      </button>
    </div>
  );
}
