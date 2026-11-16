'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, MapPin, ArrowUp } from 'lucide-react';
import { Button, buttonVariants } from '@/foundation/components/buttons';
import { STORE_CONTACT } from '@/shared/constants';

/**
 * Cụm nút nổi ở mép phải: Zalo, gọi hotline, showroom và "Lên đầu trang".
 * Trang có thanh hành động dính đáy trên mobile (chi tiết sản phẩm `[data-sticky-buy-bar]`, checkout)
 * bị cụm z-50 đè lên nên ẩn dưới `lg`; desktop giữ nguyên.
 */
const MOBILE_HIDDEN_ROUTES: readonly RegExp[] = [/^\/products\/[^/]+\/?$/, /^\/checkout(\/|$)/];

/** Ngưỡng cuộn (px) để hiện nút lên đầu trang. */
const BACK_TO_TOP_OFFSET = 320;

/** Nút 44px (vùng chạm tối thiểu), bo tròn; màu kênh đặt ở từng nút. */
const FLOAT_BUTTON = 'group relative rounded-full text-white hover:scale-105';

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
    // Một cột ở mép phải, ngay trên nút trợ lý AI, có safe-area iOS.
    <div
      className={`pointer-events-none fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-3.5 z-50 ${
        hideOnMobile ? 'hidden lg:flex' : 'flex'
      } flex-col items-center gap-2 sm:bottom-[4.875rem] sm:right-5`}
    >
      {showBackToTop && (
        <Button
          variant="secondary"
          size="icon"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group pointer-events-auto rounded-full shadow-md"
          aria-label="Cuộn lên đầu trang"
        >
          <FloatTooltip>Cuộn lên đầu trang</FloatTooltip>
          <ArrowUp aria-hidden className="!size-5" />
        </Button>
      )}

      <div className="pointer-events-auto flex flex-col items-center gap-1.5 rounded-full border border-neutral-200 bg-white p-1.5 shadow-xl">
        {/* Màu Zalo là nhận diện bên thứ ba (RULE-DS-01 cho phép ở nút của chính họ). */}
        <a
          href={STORE_CONTACT.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: 'static', size: 'icon', className: `${FLOAT_BUTTON} bg-[#0068FF] hover:bg-[#0057D9]` })}
          aria-label="Chat Zalo với tư vấn viên (mở tab mới)"
        >
          <FloatTooltip>Chat Zalo: {STORE_CONTACT.primaryHotline}</FloatTooltip>
          <MessageCircle aria-hidden className="!size-5 animate-phone-vibrate" />
        </a>

        <a
          href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
          className={buttonVariants({ variant: 'static', size: 'icon', className: `${FLOAT_BUTTON} bg-success-600 hover:bg-success-700` })}
          aria-label={`Gọi hotline ${STORE_CONTACT.primaryHotline}`}
        >
          <FloatTooltip>Hotline: {STORE_CONTACT.primaryHotline}</FloatTooltip>
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full border border-success-400 animate-pulse-ring" />
          <Phone aria-hidden className="!size-5 animate-phone-ring" />
        </a>

        <Link
          href="/contact"
          className={buttonVariants({ variant: 'secondary', size: 'icon', className: 'group relative hidden rounded-full border-transparent bg-neutral-100 hover:scale-105 sm:grid' })}
          aria-label="Tìm Showroom gần nhất"
        >
          <FloatTooltip>Showroom Bảo An Sport</FloatTooltip>
          <MapPin aria-hidden className="!size-5" />
        </Link>
      </div>
    </div>
  );
}
