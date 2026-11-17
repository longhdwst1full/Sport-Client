'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useCallback, useId, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import type { MegaMenuEntry } from '@/features/catalog';
import { MegaMenuPanel } from './mega-menu-panel';
import { OverflowCategoryMenu } from './overflow-category-menu';
import { HeaderQuickLinks } from './header-quick-links';
import { isCategoryActive, isNavHrefActive } from './nav-active';

interface DesktopMegaMenuProps {
  megaMenuCategories: MegaMenuEntry[];
  hasFlashSaleCampaign: boolean;
  flashSaleMaxDiscountPercent: number | null | undefined;
}

/** Link cấp 1 trên thanh điều hướng thương hiệu: nền trắng sáng, chữ đậm nét, hover/active êm dịu. */
const NAV_ITEM_BASE =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 focus-ring-tight xl:px-3 xl:py-1.5 xl:text-sm';
const NAV_ITEM_IDLE = 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950';
/** Đang mở mega menu (hover/focus). */
const NAV_ITEM_ACTIVE = 'bg-neutral-100 text-neutral-950 font-bold';
/**
 * Trang đang xem: token "đang chọn" (nền brand-50, chữ brand-700) + vạch đỏ sát mép dưới thanh menu
 * (thanh cao 44px, mục ~30px → vạch lùi 7px để nằm đúng đường viền dưới).
 */
const NAV_ITEM_CURRENT =
  'relative bg-brand-50 font-bold text-brand-700 hover:bg-brand-50 hover:text-brand-700 after:pointer-events-none after:absolute after:inset-x-3 after:-bottom-[7px] after:h-0.5 after:rounded-full after:bg-brand-600';

function navItemClass(current: boolean, open = false): string {
  if (current) return `${NAV_ITEM_BASE} ${NAV_ITEM_CURRENT}`;
  return `${NAV_ITEM_BASE} ${open ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE}`;
}

export function DesktopMegaMenu({
  megaMenuCategories,
  hasFlashSaleCampaign,
  flashSaleMaxDiscountPercent,
}: DesktopMegaMenuProps) {
  const menuId = useId();
  const pathname = usePathname();
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const handleMegaMenuEnter = useCallback((label: string) => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setActiveMegaMenu(label);
  }, []);

  const handleMegaMenuLeave = useCallback(() => {
    megaMenuTimeout.current = setTimeout(() => setActiveMegaMenu(null), 200);
  }, []);

  // Màn cảm ứng ≥1024px (tablet ngang) không có hover: chạm lần đầu vào danh mục có mục con chỉ mở panel,
  // chạm lần hai mới điều hướng. Ghi trạng thái ở pointerdown vì trình duyệt phát mouseenter giả lập (mở
  // panel) trước click, nên lúc click không còn biết panel đã mở từ trước hay chưa.
  const touchTap = useRef<{ label: string; wasOpen: boolean } | null>(null);
  const handleTriggerPointerDown = useCallback(
    (event: PointerEvent<HTMLAnchorElement>, label: string) => {
      touchTap.current = event.pointerType === 'touch' ? { label, wasOpen: activeMegaMenu === label } : null;
    },
    [activeMegaMenu],
  );
  const handleTriggerClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, label: string) => {
      const tap = touchTap.current;
      touchTap.current = null;
      if (!tap || tap.label !== label || tap.wasOpen) return;
      event.preventDefault();
      handleMegaMenuEnter(label);
    },
    [handleMegaMenuEnter],
  );

  const closeNow = useCallback(() => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setActiveMegaMenu(null);
  }, []);

  // Bàn phím: focus vào mục mở panel, rời khỏi cả cụm (trigger + panel) thì đóng, Escape đóng.
  const handleGroupBlur = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeNow();
    },
    [closeNow],
  );
  const handleGroupKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.currentTarget.querySelector<HTMLElement>('a, button')?.focus();
      // Focus quay về trigger sẽ phát onFocus mở menu: đóng SAU focus để Escape không mở lại panel.
      closeNow();
    },
    [closeNow],
  );

  return (
    <nav
      style={{ zIndex: 10 }}
      className="relative hidden bg-white border-b border-neutral-200/80 shadow-2xs lg:block"
      aria-label="Điều hướng chính"
    >
      <div className="mx-auto flex h-11 max-w-7xl items-center justify-center gap-1 xl:gap-1.5 px-4 sm:px-6 lg:px-8 relative">
        {/* Main Centered Nav Row */}
        <div className="flex items-center gap-1 xl:gap-1.5">
          <Link
            href="/"
            aria-current={isNavHrefActive(pathname, '/') ? 'page' : undefined}
            className={navItemClass(isNavHrefActive(pathname, '/'))}
          >
            Trang chủ
          </Link>

          <Link
            href="/products"
            aria-current={isNavHrefActive(pathname, '/products') ? 'page' : undefined}
            className={navItemClass(isNavHrefActive(pathname, '/products'))}
          >
            Sản phẩm
          </Link>

          {megaMenuCategories.slice(0, 4).map((cat, catIdx) => {
            const hasSubmenu = Boolean(cat.children && cat.children.length > 0);
            const isOpen = hasSubmenu && activeMegaMenu === cat.label;
            const isCurrent = isCategoryActive(pathname, cat);
            const visibilityClass =
              catIdx === 2
                ? 'hidden xl:block'
                : catIdx === 3
                  ? 'hidden 2xl:block'
                  : '';
            return (
              <div
                key={cat.label}
                className={`relative ${visibilityClass}`}
                onMouseEnter={() => hasSubmenu && handleMegaMenuEnter(cat.label)}
                onMouseLeave={hasSubmenu ? handleMegaMenuLeave : undefined}
                onFocus={hasSubmenu ? () => handleMegaMenuEnter(cat.label) : undefined}
                onBlur={hasSubmenu ? handleGroupBlur : undefined}
                onKeyDown={hasSubmenu ? handleGroupKeyDown : undefined}
              >
                <Link
                  href={cat.href}
                  aria-expanded={hasSubmenu ? isOpen : undefined}
                  aria-controls={isOpen ? `${menuId}-${catIdx}` : undefined}
                  onPointerDown={hasSubmenu ? (event) => handleTriggerPointerDown(event, cat.label) : undefined}
                  onClick={hasSubmenu ? (event) => handleTriggerClick(event, cat.label) : undefined}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`${navItemClass(isCurrent, isOpen)} group`}
                >
                  <span>{cat.label}</span>
                  {hasSubmenu && (
                    <ChevronDown
                      aria-hidden
                      className={`size-3.5 transition-transform duration-200 xl:size-4 ${
                        isCurrent ? 'text-brand-600' : 'text-neutral-400 group-hover:text-neutral-800'
                      } ${isOpen ? 'rotate-180' : ''} ${isOpen && !isCurrent ? 'text-neutral-900' : ''}`}
                    />
                  )}
                </Link>

                {/* Mega Dropdown */}
                {isOpen && hasSubmenu && (
                  <div id={`${menuId}-${catIdx}`}>
                    <MegaMenuPanel
                      category={cat}
                      onMouseEnter={() => handleMegaMenuEnter(cat.label)}
                      onMouseLeave={handleMegaMenuLeave}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Overflow Dropdown for remaining categories */}
          <OverflowCategoryMenu
            categories={megaMenuCategories}
            isOpen={activeMegaMenu === '__extra_categories'}
            onOpen={() => handleMegaMenuEnter('__extra_categories')}
            onMouseLeave={handleMegaMenuLeave}
            onClose={closeNow}
            triggerClassName={NAV_ITEM_BASE}
            triggerIdleClassName={NAV_ITEM_IDLE}
            triggerActiveClassName={NAV_ITEM_ACTIVE}
            // Danh mục thứ 5 trở đi chỉ nằm trong menu này ở mọi cỡ màn hình.
            isCurrent={megaMenuCategories.slice(4).some((cat) => isCategoryActive(pathname, cat))}
            triggerCurrentClassName={NAV_ITEM_CURRENT}
          />
        </div>

        {/* Subtle Separator */}
        <div className="hidden xl:block h-4 w-px bg-neutral-200 mx-1" aria-hidden="true" />

        {/* Quick Features & Highlights */}
        <HeaderQuickLinks
          pathname={pathname}
          hasFlashSaleCampaign={hasFlashSaleCampaign}
          flashSaleMaxDiscountPercent={flashSaleMaxDiscountPercent}
        />
      </div>
    </nav>
  );
}
