'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, MapPin, ArrowUp } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { STORE_CONTACT } from '@/shared/constants';

/**
 * Trang có thanh hành động dính đáy trên mobile: chi tiết sản phẩm (`[data-sticky-buy-bar]`) và checkout
 * (thanh "Đặt hàng"). Cụm nút nổi z-50 đè lên các thanh đó nên ẩn dưới `lg`; desktop giữ nguyên.
 */
/** Nút nổi đồng bộ: nền trắng, viền mảnh, icon mang màu kênh — không nhiều khối màu đặc chen nhau. */
const FLOAT_BUTTON =
  "group relative grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2";
const FLOAT_TOOLTIP =
  'pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block';

const MOBILE_HIDDEN_ROUTES: readonly RegExp[] = [/^\/products\/[^/]+\/?$/, /^\/checkout(\/|$)/];

export function FloatingContactBar() {
  const [showBackToTop, setShowBackToTop] = useState(false);
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
    // Một cột dọc duy nhất ở mép phải, ngay trên nút trợ lý (AssistantLauncher 44px + khoảng 8px), có
    // safe-area iOS — cùng vị trí ở mọi breakpoint để không đè khung giá/nút mua bên phải trang. Mobile chỉ
    // giữ nút Gọi (Zalo/Showroom có ở footer và menu) để cột nút không che nội dung màn hình hẹp.
    <div className={`fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] right-3.5 z-50 ${hideOnMobile ? 'hidden lg:flex' : 'flex'} flex-col items-end gap-2 pointer-events-none sm:bottom-[4.75rem] sm:right-5`}>
      {/* Quick Action Buttons Group */}
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        {/* Zalo Chat Button */}
        <a
          href={STORE_CONTACT.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`hidden sm:grid ${FLOAT_BUTTON}`}
          aria-label="Chat Zalo với tư vấn viên (mở tab mới)"
        >
          <span className={FLOAT_TOOLTIP}>
            Chat Zalo: {STORE_CONTACT.primaryHotline}
          </span>
          <span className="absolute inset-0 rounded-full border border-sky-400 animate-pulse-ring pointer-events-none" />
          <MessageSquare aria-hidden className="size-5 text-sky-600 animate-phone-vibrate" />
        </a>

        {/* 24/7 Hotline Call Button */}
        <a
          href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
          className={FLOAT_BUTTON}
          aria-label={`Gọi hotline ${STORE_CONTACT.primaryHotline}`}
        >
          {/* Label Tooltip */}
          <span className={FLOAT_TOOLTIP}>
            Hotline: {STORE_CONTACT.primaryHotline}
          </span>
          <span className="absolute inset-0 rounded-full border border-emerald-400 animate-pulse-ring pointer-events-none" />
          <span className="absolute -right-0.5 -top-0.5 flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <Phone aria-hidden className="size-5 text-emerald-600 animate-phone-ring" />
        </a>

        {/* Showroom Locator */}
        <Link
          href="/contact"
          className={`hidden sm:grid ${FLOAT_BUTTON}`}
          aria-label="Tìm Showroom gần nhất"
        >
          <span className={FLOAT_TOOLTIP}>
            Showroom Bảo An Sport
          </span>
          <MapPin aria-hidden className="size-5 text-slate-700" />
        </Link>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className={`pointer-events-auto ${FLOAT_BUTTON}`}
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUp aria-hidden className="size-5" />
        </Button>
      )}
    </div>
  );
}
