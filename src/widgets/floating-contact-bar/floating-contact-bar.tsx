'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, MapPin, ArrowUp, X } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { STORE_CONTACT } from '@/shared/constants';

/**
 * Trang có thanh hành động dính đáy trên mobile: chi tiết sản phẩm (`[data-sticky-buy-bar]`) và checkout
 * (thanh "Đặt hàng"). Cụm nút nổi z-50 đè lên các thanh đó nên ẩn dưới `lg`; desktop giữ nguyên.
 */
const MOBILE_HIDDEN_ROUTES: readonly RegExp[] = [/^\/products\/[^/]+\/?$/, /^\/checkout(\/|$)/];

export function FloatingContactBar() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const hideOnMobile = MOBILE_HIDDEN_ROUTES.some((pattern) => pattern.test(pathname ?? ''));

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
    // Mobile: cột này nằm ngay trên nút trợ lý (AssistantLauncher, 38px + gap 8px) để cả cụm là một cột dọc
    // ở mép phải, có tính safe-area của iOS. Từ `sm` trở lên giữ nguyên vị trí desktop cũ.
    <div className={`fixed bottom-[calc(3.875rem+env(safe-area-inset-bottom))] right-3.5 z-50 ${hideOnMobile ? 'hidden lg:flex' : 'flex'} flex-col items-end gap-2 pointer-events-none sm:bottom-6 sm:right-5 sm:gap-3`}>
      {/* Quick Action Buttons Group */}
      <div className="flex flex-col items-end gap-2 pointer-events-auto sm:gap-2.5">
        {/* Zalo Chat Button */}
        <a
          href={STORE_CONTACT.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2.5 rounded-full bg-blue-600 p-2.5 before:absolute before:-inset-1 before:rounded-full before:content-[''] sm:p-3 text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:bg-blue-500 hover:scale-110 active:scale-95"
          aria-label="Chat Zalo với tư vấn viên (mở tab mới)"
        >
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
            Chat Zalo: {STORE_CONTACT.primaryHotline}
          </span>
          <div className="relative size-[18px] sm:size-5">
            <span aria-hidden className="absolute -inset-1 animate-ping rounded-full bg-blue-400 opacity-40"></span>
            <MessageSquare aria-hidden className="size-[18px] sm:size-5" />
          </div>
        </a>

        {/* 24/7 Hotline Call Button */}
        <a
          href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-tr from-brand-700 via-brand-600 to-brand-500 p-2.5 before:absolute before:-inset-1 before:rounded-full before:content-[''] sm:p-3 text-white shadow-xl shadow-brand-600/40 border-t border-white/25 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label={`Gọi hotline ${STORE_CONTACT.primaryHotline}`}
        >
          {/* Label Tooltip */}
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
            Hotline: {STORE_CONTACT.primaryHotline}
          </span>
          <Phone aria-hidden className="size-[18px] sm:size-5" />
        </a>

        {/* Showroom Locator */}
        <Link
          href="/contact"
          className="group relative flex items-center gap-2.5 rounded-full bg-slate-900 p-2.5 before:absolute before:-inset-1 before:rounded-full before:content-[''] sm:p-3 text-brand-400 shadow-xl shadow-slate-900/40 transition-all duration-300 hover:bg-slate-800 hover:scale-110 active:scale-95"
          aria-label="Tìm Showroom gần nhất"
        >
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
            Showroom Bảo An Sport
          </span>
          <MapPin aria-hidden className="size-[18px] text-brand-400 sm:size-5" />
        </Link>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="pointer-events-auto group relative flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 before:absolute before:-inset-1.5 before:rounded-full before:content-[''] shadow-lg transition-all duration-300 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 hover:scale-105 active:scale-95 sm:p-2.5"
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUp aria-hidden className="size-4 sm:size-4.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </Button>
      )}
    </div>
  );
}
