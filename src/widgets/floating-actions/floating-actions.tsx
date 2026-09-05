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
    <div className="fixed bottom-4 right-3.5 z-40 flex flex-col items-center gap-2 sm:bottom-6 sm:right-5 sm:gap-2.5">
      {/* Zalo */}
      <a
        href={STORE_CONTACT.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative grid size-10 place-items-center rounded-full bg-blue-500 text-white shadow-md shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-lg sm:size-12"
        aria-label="Chat Zalo"
      >
        <MessageCircle className="size-4.5 sm:size-5" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
          Chat Zalo
        </span>
      </a>

      {/* Phone */}
      <a
        href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
        className="group relative grid size-10 place-items-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-600/25 transition-all hover:scale-105 hover:shadow-lg sm:size-12"
        aria-label="Gọi hotline"
      >
        <Phone className="size-4.5 sm:size-5" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
          {STORE_CONTACT.primaryHotline}
        </span>
        {/* Pulsing ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-600/30" />
      </a>

      {/* Back to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`grid size-9 place-items-center rounded-full bg-white text-slate-800 shadow-md ring-1 ring-slate-200 transition-all hover:bg-slate-900 hover:text-white sm:size-10 ${
          showBackToTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
        aria-label="Lên đầu trang"
      >
        <ArrowUp className="size-4 sm:size-4.5" />
      </button>
    </div>
  );
}
