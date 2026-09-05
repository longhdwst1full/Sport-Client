'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  Dumbbell,
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

export function SiteHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartQuantity = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  // Rotate announcements
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % STORE_ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

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
          <div className="hidden items-center gap-2 text-xs font-semibold text-emerald-400 md:flex">
            <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Showroom mở cửa 8:30 - 21:30 cả Chủ nhật</span>
          </div>

          <div className="relative flex flex-1 items-center justify-center h-5 overflow-hidden">
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

          <div className="hidden items-center gap-4 text-xs font-semibold text-slate-400 md:flex">
            <Link href="/contact" className="hover:text-white transition">Hệ thống Showroom</Link>
            <span className="text-slate-700">|</span>
            <Link href="/profile" className="hover:text-white transition">Tra cứu bảo hành</Link>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
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

          {/* Search Bar — Desktop */}
          <div className="hidden flex-1 lg:block">
            <form onSubmit={handleSearchSubmit} className="relative mx-auto max-w-xl">
              <input
                type="text"
                placeholder="Tìm sản phẩm, thương hiệu, môn tập..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50/80 px-5 py-2.5 pr-12 text-sm text-slate-800 transition placeholder:text-slate-400 hover:bg-slate-100/70 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-500"
                aria-label="Tìm kiếm"
              >
                <Search className="size-4" />
              </button>
            </form>
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
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm sản phẩm, thương hiệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 pr-11 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-emerald-600 text-white"
                aria-label="Tìm kiếm"
              >
                <Search className="size-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Streamlined Desktop Navigation Bar with Integrated Mega Menus & Hot Links */}
      <nav
        className="hidden border-b border-slate-200/70 bg-white/95 backdrop-blur-md lg:block"
        aria-label="Điều hướng chính"
      >
        <div className="mx-auto flex h-11 max-w-7xl items-center justify-between px-6 lg:px-8 text-sm font-semibold">
          {/* Sports Categories with Dropdowns */}
          <div className="flex items-center gap-1">
            {MEGA_MENU_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.label}
                  className="relative"
                  onMouseEnter={() => handleMegaMenuEnter(cat.label)}
                  onMouseLeave={handleMegaMenuLeave}
                >
                  <Link
                    href={cat.href}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                      activeMegaMenu === cat.label
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {cat.label}
                    <ChevronDown
                      className={`size-3 text-slate-400 transition-transform ${activeMegaMenu === cat.label ? 'rotate-180' : ''}`}
                    />
                  </Link>

                  {/* Mega Dropdown */}
                  {activeMegaMenu === cat.label && (
                    <div
                      className="absolute left-0 top-full z-50 w-[520px] pt-1.5 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseEnter={() => handleMegaMenuEnter(cat.label)}
                      onMouseLeave={handleMegaMenuLeave}
                    >
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5">
                        <div className="grid grid-cols-[1.1fr_.9fr]">
                          <div className="p-5">
                            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[.15em] text-emerald-700">
                              {cat.label} chuyên nghiệp
                            </p>
                            <div className="grid gap-1">
                              {cat.children.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  className="rounded-lg px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                            <Link
                              href={cat.href}
                              className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 hover:underline"
                            >
                              Xem tất cả thiết bị →
                            </Link>
                          </div>
                          <div className="relative min-h-[200px] overflow-hidden bg-slate-900">
                            <Image
                              src={cat.image}
                              alt={cat.label}
                              fill
                              sizes="250px"
                              className="object-cover opacity-90 transition duration-500 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                              <span className="text-xs font-bold text-white">Chính hãng 100% · Lắp ráp tận nhà</span>
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

          {/* Quick Hub Links & Hot Tag */}
          <div className="flex items-center gap-2">
            <Link
              href="/#products"
              className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
              Combo Home Gym
            </Link>

            {[
              { label: 'Tất cả thiết bị', href: '/products' },
              { label: 'Danh mục', href: '/category' },
              { label: 'Kiến thức tập', href: '/news' },
              { label: 'Showroom', href: '/contact' },
              { label: 'Về Bảo An', href: '/#about' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <nav
          className="border-t border-slate-200 bg-white shadow-xl lg:hidden"
          aria-label="Điều hướng di động"
        >
          <div className="mx-auto max-w-7xl divide-y divide-slate-100">
            {/* Mobile Nav Links */}
            <div className="grid gap-1 px-5 py-4 text-base font-bold">
              {MEGA_MENU_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <cat.icon className="size-5 text-emerald-600" />
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Mobile Secondary Links */}
            <div className="grid gap-1 px-5 py-3 text-sm font-semibold text-slate-600">
              {[
                ['Tất cả thiết bị thể thao', '/products'],
                ['Tất cả danh mục sản phẩm', '/category'],
                ['Kiến thức luyện tập chuyên sâu', '/news'],
                ['Hệ thống Showroom toàn quốc', '/contact'],
                ['Về thương hiệu Bảo An Sport', '/#about'],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-xl px-3 py-2 hover:bg-slate-50 hover:text-slate-900 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile Contact & Account */}
            <div className="flex flex-wrap gap-2.5 px-5 py-4 bg-slate-50">
              <a
                href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black shadow-sm"
              >
                <Phone className="size-3.5 text-emerald-600" />
                {STORE_CONTACT.primaryHotline}
              </a>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag className="size-3.5" />
                Giỏ hàng ({cartQuantity})
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserRound className="size-3.5 text-emerald-600" />
                Đăng nhập
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
