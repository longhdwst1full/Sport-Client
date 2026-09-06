'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Dumbbell,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import {
  STORE_CONFIG,
  STORE_CONTACT,
  STORE_ANNOUNCEMENTS,
  QUICK_LINKS,
  MEGA_MENU_CATEGORIES,
} from '@/constants';
import { AutocompleteSearch } from './autocomplete-search';
import { HeaderNotifications } from './header-notifications';

export function SiteHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCat, setExpandedMobileCat] = useState<string | null>(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const cartQuantity = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );

  // Rotate announcements
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % STORE_ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleMegaMenuEnter = useCallback((label: string) => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setActiveMegaMenu(label);
  }, []);

  const handleMegaMenuLeave = useCallback(() => {
    megaMenuTimeout.current = setTimeout(() => setActiveMegaMenu(null), 200);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Utility Announcement Bar */}
      <div className="relative overflow-hidden bg-slate-950 px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[.14em] text-slate-300 sm:px-4 sm:tracking-[.16em]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="hidden items-center gap-2 text-xs font-semibold text-emerald-400 xl:flex">
            <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Showroom mở cửa 8:30 - 21:30 cả Chủ nhật</span>
          </div>

          <div className="relative flex flex-1 items-center justify-center h-5 overflow-hidden px-4 min-w-0">
            {STORE_ANNOUNCEMENTS.map((text, i) => (
              <span
                key={text}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 truncate ${
                  i === announcementIndex
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0 pointer-events-none'
                }`}
              >
                {text}
              </span>
            ))}
          </div>

          <div className="hidden items-center gap-4 text-xs font-semibold text-slate-400 xl:flex">
            <Link href="/contact" className="hover:text-white transition">Hệ thống Showroom</Link>
            <span className="text-slate-700">|</span>
            <Link href="/profile" className="hover:text-white transition">Tra cứu bảo hành</Link>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div
        style={{ zIndex: 60 }}
        className="relative border-b border-slate-200/80 bg-white shadow-sm"
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex min-w-0 shrink-0 items-center transition-transform hover:scale-[1.02]"
            aria-label="Bảo An Sport - Trang chủ"
          >
            <div className="relative h-11 w-44 sm:h-12 sm:w-56">
              <Image
                src="/images/logo.png"
                alt="Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng"
                fill
                priority
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
            className="group hidden items-center gap-2.5 rounded-full border border-slate-200/80 bg-slate-50/80 px-4 py-2 transition hover:border-emerald-400/40 hover:bg-emerald-50 lg:flex"
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
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label="Tìm sản phẩm"
            >
              <Search className="size-4" />
            </button>

            {/* Notifications Popover */}
            <HeaderNotifications />

            {/* User Account */}
            <Link
              href="/login"
              className="hidden size-10 place-items-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 sm:grid"
              aria-label="Đăng nhập tài khoản"
            >
              <UserRound className="size-4" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative grid size-10 place-items-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              aria-label={`Giỏ hàng, ${cartQuantity} sản phẩm`}
            >
              <ShoppingBag className="size-4" />
              {cartQuantity > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-emerald-500 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
                  {cartQuantity > 99 ? '99+' : cartQuantity}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="grid size-10 place-items-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-700 sm:size-10 lg:hidden"
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-slate-50/90 px-4 py-3 lg:hidden">
            <AutocompleteSearch isMobile onCloseMobile={() => setSearchOpen(false)} />
          </div>
        )}
      </div>

      {/* Streamlined Desktop Navigation Bar with Integrated Mega Menus */}
      <nav
        style={{ zIndex: 10 }}
        className="relative hidden border-b border-slate-200/80 bg-white lg:block"
        aria-label="Điều hướng chính"
      >
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Main Category Dropdowns */}
          <div className="flex items-center gap-1">
            {MEGA_MENU_CATEGORIES.map((cat) => {
              const isOpen = activeMegaMenu === cat.label;
              return (
                <div
                  key={cat.label}
                  className="relative"
                  onMouseEnter={() => handleMegaMenuEnter(cat.label)}
                  onMouseLeave={handleMegaMenuLeave}
                >
                  <Link
                    href={cat.href}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-[13px] font-bold transition-all ${
                      isOpen
                        ? 'bg-slate-100 text-emerald-700'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <ChevronDown
                      className={`size-3.5 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </Link>

                  {/* Mega Dropdown */}
                  {isOpen && (
                    <div
                      className="absolute left-0 top-full z-50 w-[540px] pt-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
                      onMouseEnter={() => handleMegaMenuEnter(cat.label)}
                      onMouseLeave={handleMegaMenuLeave}
                    >
                      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl ring-1 ring-black/5">
                        <div className="grid grid-cols-[1.2fr_0.8fr] gap-6">
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                              {cat.label}
                            </span>
                            <div className="mt-3 divide-y divide-slate-100">
                              {cat.children.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  className="group flex items-center justify-between py-2.5 text-xs font-bold text-slate-700 transition hover:text-emerald-700"
                                >
                                  <span>{child.label}</span>
                                  <ChevronRight className="size-3 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
                                </Link>
                              ))}
                            </div>
                            <Link
                              href={cat.href}
                              className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 hover:underline"
                            >
                              Xem tất cả {cat.label} →
                            </Link>
                          </div>

                          {/* Image preview banner */}
                          <div className="relative min-h-[190px] overflow-hidden rounded-xl bg-slate-100">
                            <Image
                              src={cat.image}
                              alt={cat.label}
                              fill
                              sizes="240px"
                              className="object-cover transition duration-500 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3.5">
                              <span className="text-xs font-bold text-white leading-snug">
                                Cam kết 100% chính hãng · Bảo hành 2 - 5 năm
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Features & Highlights */}
          <div className="flex items-center gap-1 text-[13px] font-bold">
            <Link
              href="/flash-sale"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-rose-600 transition hover:bg-rose-50 font-black"
            >
              <span>⚡ Flash Sale</span>
              <span className="rounded-full bg-rose-600 px-1.5 py-0.5 text-[9px] font-black uppercase text-white animate-pulse">
                -45%
              </span>
            </Link>

            <Link
              href="/#products"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
            >
              <span>Combo Home Gym</span>
              <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-white shadow-sm">
                Hot
              </span>
            </Link>

            <Link
              href="/news"
              className="inline-flex items-center whitespace-nowrap rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
            >
              Cẩm nang tập luyện
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
            >
              <MapPin className="size-3.5 text-emerald-600" />
              <span>Hệ thống Showroom</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer & Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[110px] z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <nav
            className="relative z-50 border-t border-slate-200 bg-white shadow-2xl lg:hidden max-h-[calc(100vh-120px)] overflow-y-auto animate-in slide-in-from-top duration-200"
            aria-label="Điều hướng di động"
          >
            <div className="mx-auto max-w-7xl divide-y divide-slate-100">
              {/* Mobile In-Drawer Search */}
              <div className="p-4 bg-slate-50">
                <AutocompleteSearch isMobile onCloseMobile={() => setMobileMenuOpen(false)} />
              </div>

              {/* Main Categories Accordion */}
              <div className="px-4 py-3 space-y-1">
                <div className="px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Danh mục thiết bị chính hãng
                </div>
                {MEGA_MENU_CATEGORIES.map((cat) => {
                  const isExpanded = expandedMobileCat === cat.label;
                  return (
                    <div key={cat.label} className="rounded-xl border border-transparent overflow-hidden">
                      <div className="flex items-center justify-between rounded-xl hover:bg-slate-50 transition">
                        <Link
                          href={cat.href}
                          className="flex flex-1 items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-800 hover:text-emerald-700"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <cat.icon className="size-4.5 text-emerald-600 shrink-0" />
                          <span>{cat.label}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedMobileCat(isExpanded ? null : cat.label)
                          }
                          className="p-2.5 text-slate-400 hover:text-slate-700"
                          aria-label={`Mở rộng ${cat.label}`}
                        >
                          <ChevronDown
                            className={`size-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-emerald-600' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Subcategories dropdown in drawer */}
                      {isExpanded && (
                        <div className="ml-8 mr-2 my-1 space-y-1 border-l-2 border-emerald-500/40 pl-3 py-1 animate-in fade-in duration-150">
                          {cat.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="flex items-center justify-between py-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span>{child.label}</span>
                              <ChevronRight className="size-3 text-slate-300" />
                            </Link>
                          ))}
                          <Link
                            href={cat.href}
                            className="inline-block pt-1 text-xs font-extrabold text-emerald-700 hover:underline"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Xem tất cả {cat.label} →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Special Features Links */}
              <div className="px-4 py-3 space-y-1">
                <Link
                  href="/flash-sale"
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-black text-rose-600 hover:bg-rose-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-rose-600 animate-ping" />
                    ⚡ Giờ Vàng Flash Sale Giảm 45%
                  </span>
                  <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                    SỐC
                  </span>
                </Link>

                <Link
                  href="/#products"
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                    Combo Home Gym Trọn Gói
                  </span>
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-sm">
                    Hot
                  </span>
                </Link>

                <Link
                  href="/news"
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Cẩm nang & Kinh nghiệm tập luyện</span>
                  <ChevronRight className="size-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-emerald-600" />
                    Hệ thống Showroom Bảo An Sport
                  </span>
                  <ChevronRight className="size-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Tra cứu kích hoạt bảo hành</span>
                  <ChevronRight className="size-3.5 text-slate-400" />
                </Link>
              </div>

              {/* Showrooms & Hotlines info */}
              <div className="px-5 py-3 text-xs text-slate-500 space-y-1.5 bg-slate-50/50">
                <div className="font-bold text-slate-700">Showroom mở cửa 08:30 - 21:30 cả CN:</div>
                <div>📍 <strong className="text-slate-800">Hà Nội:</strong> 234 Định Công, P. Định Công, Hoàng Mai</div>
                <div>📍 <strong className="text-slate-800">TP.HCM:</strong> 34 Đường số 2, Cư xá Đài Ra Đa, Q.6</div>
              </div>

              {/* Mobile Contact & Action Buttons */}
              <div className="flex flex-wrap gap-2.5 px-4 py-4 bg-slate-50">
                <a
                  href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white shadow-sm"
                >
                  <Phone className="size-3.5 text-emerald-400" />
                  <span>{STORE_CONTACT.primaryHotline}</span>
                </a>
                <Link
                  href="/cart"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBag className="size-3.5" />
                  <span>Giỏ hàng ({cartQuantity})</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserRound className="size-3.5 text-emerald-600" />
                  <span>Đăng nhập</span>
                </Link>
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
