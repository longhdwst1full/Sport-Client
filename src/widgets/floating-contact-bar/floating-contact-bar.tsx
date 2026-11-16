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
/** Nút trong thanh nổi: tròn 44px, màu theo kênh; hover nâng nhẹ. Thanh chứa là khối tối kính mờ. */
const FLOAT_BUTTON =
  "group relative grid size-11 place-items-center rounded-full text-white transition duration-200 hover:-translate-y-0.5 focus-ring-inverse";
/** Nút "lên đầu trang" đứng riêng: nền trắng để nổi trên cả nền tối (footer) lẫn nền sáng. */
const FLOAT_BUTTON_LIGHT =
  "group relative grid size-11 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-lg shadow-neutral-900/10 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-xl focus-ring";
const FLOAT_TOOLTIP =
  'pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block';

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
      <div className="flex flex-col items-center gap-1.5 rounded-full bg-neutral-900/90 p-1.5 shadow-xl shadow-neutral-900/25 ring-1 ring-white/10 backdrop-blur-md pointer-events-auto">
        {/* Zalo Chat Button */}
        <a
          href={STORE_CONTACT.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`hidden sm:grid bg-[#0068FF] hover:bg-[#0057D9] ${FLOAT_BUTTON}`}
          aria-label="Chat Zalo với tư vấn viên (mở tab mới)"
        >
          <span className={FLOAT_TOOLTIP}>
            Chat Zalo: {STORE_CONTACT.primaryHotline}
          </span>
          <MessageSquare aria-hidden className="size-5 animate-phone-vibrate" />
        </a>

        {/* Hotline Call Button */}
        <a
          href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
          className={`bg-success-600 hover:bg-success-700 ${FLOAT_BUTTON}`}
          aria-label={`Gọi hotline ${STORE_CONTACT.primaryHotline}`}
        >
          {/* Label Tooltip */}
          <span className={FLOAT_TOOLTIP}>
            Hotline: {STORE_CONTACT.primaryHotline}
          </span>
          <span className="absolute inset-0 rounded-full border border-success-400 animate-pulse-ring pointer-events-none" />
          <Phone aria-hidden className="size-5 animate-phone-ring" />
        </a>

        {/* Showroom Locator */}
        <Link
          href="/contact"
          className={`hidden sm:grid bg-white/10 hover:bg-white/20 ${FLOAT_BUTTON}`}
          aria-label="Tìm Showroom gần nhất"
        >
          <span className={FLOAT_TOOLTIP}>
            Showroom Bảo An Sport
          </span>
          <MapPin aria-hidden className="size-5" />
        </Link>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className={`pointer-events-auto ${FLOAT_BUTTON_LIGHT}`}
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUp aria-hidden className="size-5" />
        </Button>
      )}
    </div>
  );
}
