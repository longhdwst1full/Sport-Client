'use client';

import Link from 'next/link';
import { useMegaMenuCategories } from '@/features/catalog';
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

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { categories: megaMenuCategories } = useMegaMenuCategories();
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
        className="relative border-b border-slate-200/80 bg-white shadow-xs"
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex min-w-0 shrink-0 items-center transition-transform hover:scale-[1.02]"
            aria-label="Bảo An Sport - Trang chủ"
          >
            <span className="sr-only">Bảo An Sport</span>
            <div className="relative h-11 w-44 sm:h-12 sm:w-56">
              <Image
                src="/images/logo.png"
                alt="Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng"
                fill
                priority
                sizes="(max-width: 640px) 176px, 224px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Search Bar — Desktop Live Autocomplete */}
          <div className="hidden flex-1 max-w-xl mx-auto lg:block">
            <AutocompleteSearch />
          </div>

          {/* Hotline — Desktop */}
          <a
            href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
            className="group hidden items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-2 transition hover:border-emerald-400/50 hover:bg-emerald-50/60 shadow-xs lg:flex"
            aria-label="Gọi tư vấn"
          >
            <div className="grid size-7 place-items-center rounded-full bg-emerald-600 text-white">
              <Phone className="size-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">Hotline tư vấn</span>
              <strong className="text-xs font-black text-slate-900">{STORE_CONTACT.primaryHotline}</strong>
            </div>
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
          <div className="border-t border-slate-100 bg-slate-50/90 px-4 py-3 lg:hidden">
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
