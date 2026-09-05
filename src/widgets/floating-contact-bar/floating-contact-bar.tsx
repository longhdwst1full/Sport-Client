'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, MapPin, ArrowUp, X } from 'lucide-react';

export function FloatingContactBar() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 320);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Quick Action Buttons Group */}
      <div className="flex flex-col items-end gap-2.5 pointer-events-auto">
        {/* Zalo Chat Button */}
        <a
          href="https://zalo.me/0939987456"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2.5 rounded-full bg-blue-600 p-3 text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:bg-blue-500 hover:scale-110"
          aria-label="Tư vấn Zalo"
        >
          {/* Label Tooltip */}
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
            Chat Zalo: 0939 987 456
          </span>
          <div className="relative size-5">
            <span className="absolute -inset-1 animate-ping rounded-full bg-blue-400 opacity-40"></span>
            <MessageSquare className="size-5" />
          </div>
        </a>

        {/* 24/7 Hotline Call Button */}
        <a
          href="tel:18000000"
          className="group relative flex items-center gap-2.5 rounded-full bg-emerald-600 p-3 text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:bg-emerald-500 hover:scale-110"
          aria-label="Gọi tổng đài tư vấn"
        >
          {/* Label Tooltip */}
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
            Hotline miễn phí: 1800 0000
          </span>
          <div className="relative size-5">
            <span className="absolute -inset-1 animate-ping rounded-full bg-emerald-400 opacity-40"></span>
            <Phone className="size-5" />
          </div>
        </a>

        {/* Showroom Locator */}
        <Link
          href="/contact"
          className="group relative flex items-center gap-2.5 rounded-full bg-slate-900 p-3 text-emerald-400 shadow-xl shadow-slate-900/40 transition-all duration-300 hover:bg-slate-800 hover:scale-110"
          aria-label="Tìm Showroom gần nhất"
        >
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
            Hệ thống 4 Showroom DCTD
          </span>
          <MapPin className="size-5 text-emerald-400" />
        </Link>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="pointer-events-auto group relative flex items-center justify-center rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-lg transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-105"
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUp className="size-4.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </button>
      )}
    </div>
  );
}
