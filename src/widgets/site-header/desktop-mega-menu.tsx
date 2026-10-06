'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useCallback, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import type { MegaMenuEntry } from '@/features/catalog';
import { MegaMenuPanel } from './mega-menu-panel';
import { OverflowCategoryMenu } from './overflow-category-menu';
import { HeaderQuickLinks } from './header-quick-links';

interface DesktopMegaMenuProps {
  megaMenuCategories: MegaMenuEntry[];
  hasFlashSaleCampaign: boolean;
  flashSaleMaxDiscountPercent: number | null | undefined;
}

/** Link cấp 1 trên thanh điều hướng thương hiệu: nền trắng sáng, chữ đậm nét, hover/active êm dịu. */
const NAV_ITEM_BASE =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 xl:px-3 xl:py-1.5 xl:text-sm';
const NAV_ITEM_IDLE = 'text-slate-700 hover:bg-slate-100 hover:text-brand-600';
const NAV_ITEM_ACTIVE = 'bg-brand-50 text-brand-600 font-bold';

export function DesktopMegaMenu({
  megaMenuCategories,
  hasFlashSaleCampaign,
  flashSaleMaxDiscountPercent,
}: DesktopMegaMenuProps) {
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
      closeNow();
      event.currentTarget.querySelector<HTMLElement>('a, button')?.focus();
    },
    [closeNow],
  );

  return (
    <nav
      style={{ zIndex: 10 }}
      className="relative hidden bg-white border-b border-slate-200/80 shadow-2xs lg:block"
      aria-label="Điều hướng chính"
    >
      <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Main Category Dropdowns */}
        <div className="flex shrink-0 items-center gap-1 xl:gap-1.5">
          <Link href="/" className={`${NAV_ITEM_BASE} ${NAV_ITEM_IDLE}`}>
            Trang chủ
          </Link>

          <Link href="/products" className={`${NAV_ITEM_BASE} ${NAV_ITEM_IDLE}`}>
            Sản phẩm
          </Link>

          {megaMenuCategories.slice(0, 4).map((cat, catIdx) => {
            const hasSubmenu = Boolean(cat.children && cat.children.length > 0);
            const isOpen = hasSubmenu && activeMegaMenu === cat.label;
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
                  onPointerDown={hasSubmenu ? (event) => handleTriggerPointerDown(event, cat.label) : undefined}
                  onClick={hasSubmenu ? (event) => handleTriggerClick(event, cat.label) : undefined}
                  className={`${NAV_ITEM_BASE} group ${isOpen ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE}`}
                >
                  <span>{cat.label}</span>
                  {hasSubmenu && (
                    <ChevronDown
                      aria-hidden
                      className={`size-3.5 text-slate-400 transition-transform duration-200 group-hover:text-brand-600 xl:size-4 ${
                        isOpen ? 'rotate-180 text-brand-600' : ''
                      }`}
                    />
                  )}
                </Link>

                {/* Mega Dropdown */}
                {isOpen && hasSubmenu && (
                  <MegaMenuPanel
                    category={cat}
                    onMouseEnter={() => handleMegaMenuEnter(cat.label)}
                    onMouseLeave={handleMegaMenuLeave}
                  />
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
          />
        </div>

        {/* Quick Features & Highlights */}
        <HeaderQuickLinks
          hasFlashSaleCampaign={hasFlashSaleCampaign}
          flashSaleMaxDiscountPercent={flashSaleMaxDiscountPercent}
        />
      </div>
    </nav>
  );
}
