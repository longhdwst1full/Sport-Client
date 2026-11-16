'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, MapPin, ArrowUp } from 'lucide-react';
import { STORE_CONTACT } from '@/shared/constants';

/**
 * Cụm nút nổi ở mép phải: Zalo, gọi hotline, showroom và "Lên đầu trang".
 * Trang có thanh hành động dính đáy trên mobile (chi tiết sản phẩm `[data-sticky-buy-bar]`, checkout)
 * bị cụm z-50 đè lên nên ẩn dưới `lg`; desktop giữ nguyên.
 */
const MOBILE_HIDDEN_ROUTES: readonly RegExp[] = [/^\/products\/[^/]+\/?$/, /^\/checkout(\/|$)/];

/** Ngưỡng cuộn (px) để hiện nút lên đầu trang. */
const BACK_TO_TOP_OFFSET = 320;

/** Nút nổi đồng bộ: tròn 44px (vùng chạm tối thiểu), nền trắng sang trọng, viền mảnh, bóng đổ mềm. */
const FLOAT_BUTTON_CLASS =
  'group relative grid size-11 place-items-center rounded-full border border-neutral-200/90 bg-white/95 text-neutral-700 shadow-md shadow-neutral-950/10 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-xl focus-ring';

function FloatTooltip({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
      {children}
    </span>
  );
}

export function FloatingContactBar() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const pathname = usePathname();
  const hideOnMobile = MOBILE_HIDDEN_ROUTES.some((pattern) => pattern.test(pathname ?? ''));

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > BACK_TO_TOP_OFFSET);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    // Một cột nút tròn đồng nhất ở mép phải, xếp ngay trên nút trợ lý AI (AssistantLauncher 44px + khoảng cách 10px), có safe-area iOS.
    <div
      className={`pointer-events-none fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] right-3.5 z-50 ${
        hideOnMobile ? 'hidden lg:flex' : 'flex'
      } flex-col items-end gap-2.5 sm:bottom-[4.75rem] sm:right-5`}
    >
      {/* Nút lên đầu trang */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`pointer-events-auto ${FLOAT_BUTTON_CLASS} text-neutral-600 hover:text-neutral-950`}
          aria-label="Cuộn lên đầu trang"
        >
          <FloatTooltip>Cuộn lên đầu trang</FloatTooltip>
          <ArrowUp aria-hidden className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </button>
      )}

      {/* Showroom Locator (ẩn mobile để tránh che nội dung) */}
      <Link
        href="/contact"
        className={`pointer-events-auto hidden sm:grid ${FLOAT_BUTTON_CLASS} text-neutral-700 hover:border-brand-200 hover:bg-brand-50/50 hover:text-brand-600`}
        aria-label="Tìm Showroom gần nhất"
      >
        <FloatTooltip>Showroom Bảo An Sport</FloatTooltip>
        <MapPin aria-hidden className="size-5 transition-transform duration-200 group-hover:scale-110" />
      </Link>

      {/* Zalo Chat Button (nhận diện xanh Zalo, ẩn mobile) */}
      <a
        href={STORE_CONTACT.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`pointer-events-auto hidden sm:grid ${FLOAT_BUTTON_CLASS} text-[#0068FF] hover:border-[#0068FF]/30 hover:bg-blue-50/50`}
        aria-label="Chat Zalo với tư vấn viên (mở tab mới)"
      >
        <FloatTooltip>Chat Zalo: {STORE_CONTACT.primaryHotline}</FloatTooltip>
        <MessageCircle aria-hidden className="size-5 animate-phone-vibrate" />
      </a>

      {/* Hotline Call Button (có chấm trạng thái trực tổng đài) */}
      <a
        href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
        className={`pointer-events-auto ${FLOAT_BUTTON_CLASS} text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700`}
        aria-label={`Gọi hotline ${STORE_CONTACT.primaryHotline}`}
      >
        <FloatTooltip>Hotline: {STORE_CONTACT.primaryHotline}</FloatTooltip>
        <span className="absolute -right-0.5 -top-0.5 flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
        </span>
        <Phone aria-hidden className="size-5 animate-phone-ring" />
      </a>
    </div>
  );
}
