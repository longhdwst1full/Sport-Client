'use client';

import Link from 'next/link';
import { useMegaMenuCategories, type MegaMenuEntry } from '@/features/catalog';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useCartItems } from '@/features/cart';
import { STORE_CONTACT } from '@/shared/constants';
import { AutocompleteSearch } from './autocomplete-search';
import { AnnouncementTicker } from './announcement-ticker';
import { HeaderActions } from './header-actions';
import { DesktopMegaMenu } from './desktop-mega-menu';
import { useCustomerAuth } from '@/features/auth';
import { useFlashSaleAvailability } from '@/features/promotions';
import { preloadOnIdle } from '@/shared/hooks';

// Drawer chỉ hiện sau khi bấm nút menu nên không cần trong bundle đầu trang; chunk được tải sẵn
// lúc trình duyệt rảnh nên lần bấm đầu vẫn mở ngay như trước.
const loadMobileMenuDrawer = () => import('./mobile-menu-drawer');
const MobileMenuDrawer = dynamic(() => import('./mobile-menu-drawer').then((mod) => mod.MobileMenuDrawer), {
  ssr: false,
});

export type { MegaMenuEntry };

export interface SiteHeaderProps {
  /** Danh mục dựng ở layout server (ISR) để link mega-menu có trong HTML đầu; `undefined` → tải ở client. */
  initialCategories?: MegaMenuEntry[];
}

export function SiteHeader({ initialCategories }: SiteHeaderProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { categories: megaMenuCategories } = useMegaMenuCategories(initialCategories);
  const flashSale = useFlashSaleAvailability();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return preloadOnIdle(loadMobileMenuDrawer);
  }, []);

  const cartItems = useCartItems();
  const rawCartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  // Avoid hydration mismatch by waiting until mounted to show client-persisted cart quantity and auth
  const cartQuantity = isMounted ? rawCartQuantity : 0;
  const { isAuthenticated, customer } = useCustomerAuth();
  const isLoggedIn = isMounted && isAuthenticated;
  const customerName = customer?.name || (customer?.email ? customer.email.split('@')[0] : '');

  return (
    <header className="sticky top-0 z-50">
      {/* Top Utility Announcement Bar */}
      <AnnouncementTicker />

      {/* Main Header Row */}
      <div
        style={{ zIndex: 60 }}
        className="relative border-b border-slate-200 bg-white"
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex min-w-0 shrink-0 items-center rounded-lg"
            aria-label="Bảo An Sport - Trang chủ"
          >
            <span className="sr-only">Bảo An Sport</span>
            <div className="relative h-10 w-36 xs:h-11 xs:w-44 sm:h-12 sm:w-56">
              <Image
                src="/images/logo.png"
                alt="Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng"
                fill
                priority
                sizes="(max-width: 374px) 144px, (max-width: 640px) 176px, 224px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Search Bar — Desktop Live Autocomplete */}
          <div className="mx-auto hidden max-w-2xl flex-1 lg:block">
            <AutocompleteSearch />
          </div>

          {/* Hotline — Desktop */}
          <a
            href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
            className="group hidden items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition hover:bg-slate-50 lg:flex"
            aria-label={`Gọi hotline tư vấn ${STORE_CONTACT.primaryHotline}`}
          >
            <span className="grid size-10 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition-all duration-200 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white shadow-2xs">
              <Phone aria-hidden className="size-4" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Hotline tư vấn</span>
              <strong className="text-sm font-black text-brand-600 transition-colors group-hover:text-brand-700">{STORE_CONTACT.primaryHotline}</strong>
            </span>
          </a>

          {/* Action Icons */}
          <HeaderActions
            searchOpen={searchOpen}
            onToggleSearch={() => setSearchOpen((v) => !v)}
            isLoggedIn={isLoggedIn}
            customerName={customerName}
            cartQuantity={cartQuantity}
            mobileMenuOpen={mobileMenuOpen}
            onToggleMobileMenu={() => setMobileMenuOpen((open) => !open)}
          />
        </div>

        {/* Mobile Search Overlay */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 lg:hidden">
            <AutocompleteSearch isMobile onCloseMobile={() => setSearchOpen(false)} />
          </div>
        )}
      </div>

      {/* Streamlined Desktop Navigation Bar with Integrated Mega Menus */}
      <DesktopMegaMenu
        megaMenuCategories={megaMenuCategories}
        hasFlashSaleCampaign={flashSale.hasCampaign}
        flashSaleMaxDiscountPercent={flashSale.maxDiscountPercent}
      />

      {/* Mobile Menu Drawer & Overlay */}
      {mobileMenuOpen && (
        <MobileMenuDrawer
          megaMenuCategories={megaMenuCategories}
          hasFlashSaleCampaign={flashSale.hasCampaign}
          flashSaleMaxDiscountPercent={flashSale.maxDiscountPercent}
          isLoggedIn={isLoggedIn}
          customerName={customerName}
          cartQuantity={cartQuantity}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}
