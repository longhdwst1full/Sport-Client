'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import type { MegaMenuEntry } from '@/features/catalog';
import { MegaMenuPanel } from './mega-menu-panel';
import { OverflowCategoryMenu } from './overflow-category-menu';
import { HeaderQuickLinks } from './header-quick-links';

interface DesktopMegaMenuProps {
  megaMenuCategories: MegaMenuEntry[];
  hasFlashSaleCampaign: boolean;
  flashSaleMaxDiscountPercent: number | null | undefined;
}

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

  return (
    <nav
      style={{ zIndex: 10 }}
      className="relative hidden border-b border-slate-200/80 bg-white/95 backdrop-blur-md lg:block shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]"
      aria-label="Điều hướng chính"
    >
      <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        {/* Main Category Dropdowns */}
        <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
          <Link
            href="/"
            className="inline-flex items-center whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700 transition-all duration-150 xl:px-3.5 xl:py-2 xl:text-sm"
          >
            Trang chủ
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700 transition-all duration-150 xl:px-3.5 xl:py-2 xl:text-sm"
          >
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
              >
                <Link
                  href={cat.href}
                  className={`inline-flex items-center gap-1 xl:gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 xl:px-3 xl:py-2 xl:text-sm ${
                    isOpen
                      ? 'bg-emerald-50 text-emerald-700 font-bold ring-1 ring-emerald-600/15'
                      : 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  {hasSubmenu && (
                    <ChevronDown
                      className={`size-3.5 xl:size-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-600' : 'group-hover:text-emerald-600'
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
            onMouseEnter={() => handleMegaMenuEnter('__extra_categories')}
            onMouseLeave={handleMegaMenuLeave}
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
