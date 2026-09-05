'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  Dumbbell,
  Footprints,
  Goal,
  HeartPulse,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/app/store/hooks';

const QUICK_LINKS = [
  'Máy chạy bộ',
  'Xe đạp tập',
  'Gym & sức mạnh',
  'Yoga & phục hồi',
  'Đồ thể thao',
  'Combo home gym',
] as const;

const ANNOUNCEMENTS = [
  'Giao từ kho gần nhất · Giá hiển thị đã gồm VAT',
  'Miễn phí tư vấn không gian tập · Hotline: 1800 0000',
  'Đổi trả trong 7 ngày · Bảo hành chính hãng',
] as const;

const MEGA_MENU_CATEGORIES = [
  {
    label: 'Gym & Fitness',
    href: '/#products',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80',
    children: [
      { label: 'Máy chạy bộ', href: '/#products' },
      { label: 'Xe đạp tập', href: '/#products' },
      { label: 'Giàn tạ đa năng', href: '/#products' },
      { label: 'Tạ điều chỉnh', href: '/#products' },
      { label: 'Ghế tập tạ', href: '/#products' },
    ],
  },
  {
    label: 'Chạy bộ',
    href: '/#products',
    icon: Footprints,
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=400&q=80',
    children: [
      { label: 'Giày chạy bộ', href: '/#products' },
      { label: 'Máy chạy bộ gia đình', href: '/#products' },
      { label: 'Phụ kiện chạy bộ', href: '/#products' },
    ],
  },
  {
    label: 'Bóng đá',
    href: '/#products',
    icon: Goal,
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80',
    children: [
      { label: 'Bóng đá các loại', href: '/#products' },
      { label: 'Giày bóng đá', href: '/#products' },
      { label: 'Đồ tập bóng đá', href: '/#products' },
    ],
  },
  {
    label: 'Yoga & Phục hồi',
    href: '/#products',
    icon: HeartPulse,
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=400&q=80',
    children: [
      { label: 'Thảm yoga', href: '/#products' },
      { label: 'Dụng cụ yoga', href: '/#products' },
      { label: 'Foam roller', href: '/#products' },
      { label: 'Dây kháng lực', href: '/#products' },
    ],
  },
] as const;

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
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
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
      {/* Announcement Bar — rotating */}
      <div className="relative overflow-hidden bg-ink px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[.12em] text-white/85 sm:px-4 sm:text-xs sm:tracking-[.16em]">
        {ANNOUNCEMENTS.map((text, i) => (
          <span
            key={text}
            className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-500 ${
              i === announcementIndex
                ? 'translate-y-0 opacity-100'
                : 'translate-y-full opacity-0'
            }`}
          >
            {text}
          </span>
        ))}
        {/* Invisible spacer to maintain height */}
        <span className="invisible">{ANNOUNCEMENTS[0]}</span>
      </div>

      {/* Main Header Row */}
      <div className="border-b border-ink/10 bg-cream/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center gap-3 px-4 sm:h-[74px] sm:gap-4 sm:px-5 lg:gap-6 lg:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2.5 text-base font-black tracking-tight sm:gap-3 sm:text-xl"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-sm sm:size-10">
              <Dumbbell className="size-5" />
            </span>
            <span className="hidden whitespace-nowrap min-[420px]:inline">DCTD SPORT</span>
          </Link>

          {/* Search Bar — Desktop */}
          <div className="hidden flex-1 lg:block">
            <form onSubmit={handleSearchSubmit} className="relative mx-auto max-w-xl">
              <input
                type="text"
                placeholder="Tìm sản phẩm, thương hiệu, môn tập..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 pr-11 text-sm shadow-sm transition-all placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg bg-brand-600 text-white transition hover:bg-brand-500"
                aria-label="Tìm kiếm"
              >
                <Search className="size-4" />
              </button>
            </form>
          </div>

          {/* Hotline — Desktop */}
          <a
            href="tel:18000000"
            className="hidden shrink-0 items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-white xl:flex"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
              <Phone className="size-4" />
            </span>
            <span className="text-left">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                Hotline
              </span>
              <strong className="text-sm">1800 0000</strong>
            </span>
          </a>

          {/* Action Icons */}
          <div className="flex shrink-0 items-center gap-0 sm:gap-1">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full transition hover:bg-white sm:size-11 lg:hidden"
              aria-label="Tìm sản phẩm"
            >
              <Search className="size-5" />
            </button>

            {/* User Account */}
            <Link
              href="/login"
              className="hidden size-11 place-items-center rounded-full transition hover:bg-white sm:grid"
              aria-label="Đăng nhập tài khoản"
            >
              <UserRound className="size-5" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative grid size-10 place-items-center rounded-full transition hover:bg-white sm:size-11"
              aria-label={`Giỏ hàng, ${cartQuantity} sản phẩm`}
            >
              <ShoppingBag className="size-5 text-ink" />
              {cartQuantity > 0 && (
                <span className="absolute right-0 top-0 grid min-w-5 place-items-center rounded-full bg-emerald-500 px-1 text-[10px] font-extrabold text-ink shadow-sm">
                  {cartQuantity > 99 ? '99+' : cartQuantity}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="grid size-10 place-items-center rounded-full sm:size-11 lg:hidden"
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
          <div className="border-t border-ink/5 bg-cream px-4 py-3 lg:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm sản phẩm, thương hiệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 pr-11 text-sm shadow-sm placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg bg-brand-600 text-white"
                aria-label="Tìm kiếm"
              >
                <Search className="size-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Desktop Navigation with Mega Menu */}
      <nav
        className="hidden border-b border-ink/5 bg-white/80 backdrop-blur lg:block"
        aria-label="Điều hướng chính"
      >
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-center gap-1 px-10 text-sm font-bold">
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
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition ${
                    activeMegaMenu === cat.label
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-brand-600'
                  }`}
                >
                  <Icon className="size-4" />
                  {cat.label}
                  <ChevronDown
                    className={`size-3.5 transition-transform ${activeMegaMenu === cat.label ? 'rotate-180' : ''}`}
                  />
                </Link>

                {/* Mega Dropdown */}
                {activeMegaMenu === cat.label && (
                  <div
                    className="absolute left-1/2 top-full z-50 w-[520px] -translate-x-1/2 pt-2"
                    onMouseEnter={() => handleMegaMenuEnter(cat.label)}
                    onMouseLeave={handleMegaMenuLeave}
                  >
                    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-xl">
                      <div className="grid grid-cols-[1fr_.8fr]">
                        <div className="p-5">
                          <p className="mb-3 text-xs font-bold uppercase tracking-[.15em] text-stone-400">
                            {cat.label}
                          </p>
                          <div className="grid gap-1">
                            {cat.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-brand-50 hover:text-brand-600"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                          <Link
                            href={cat.href}
                            className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                          >
                            Xem tất cả →
                          </Link>
                        </div>
                        <div className="relative min-h-[200px] overflow-hidden">
                          <Image
                            src={cat.image}
                            alt={cat.label}
                            fill
                            sizes="250px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <span className="mx-2 h-5 border-l border-ink/10" />

          {[
            { label: 'Danh mục', href: '/category' },
            { label: 'Kiến thức', href: '/news' },
            { label: 'Showroom', href: '/contact' },
            { label: 'Về DCTD', href: '/#about' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-lg px-3 py-2 text-stone-600 transition hover:bg-stone-50 hover:text-brand-600"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Quick Links — Desktop Sub-nav */}
      <nav
        className="hidden border-b border-ink/5 bg-stone-50/80 backdrop-blur lg:block"
        aria-label="Danh mục mua sắm nhanh"
      >
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-center gap-6 px-10 text-xs font-semibold text-stone-500">
          {QUICK_LINKS.map((label) => (
            <Link
              key={label}
              href="/#products"
              className="transition hover:text-brand-600"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <nav
          className="border-t border-ink/10 bg-cream lg:hidden"
          aria-label="Điều hướng di động"
        >
          <div className="mx-auto max-w-7xl divide-y divide-ink/5">
            {/* Mobile Nav Links */}
            <div className="grid gap-1 px-5 py-4 text-base font-bold">
              {MEGA_MENU_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <cat.icon className="size-5 text-brand-600" />
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Mobile Secondary Links */}
            <div className="grid gap-1 px-5 py-4 text-sm font-semibold text-stone-600">
              {[
                ['Tất cả danh mục', '/category'],
                ['Kiến thức luyện tập', '/news'],
                ['Hệ thống Showroom', '/contact'],
                ['Về DCTD Sport', '/#about'],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-xl px-3 py-2.5 hover:bg-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile Contact & Account */}
            <div className="flex flex-wrap gap-3 px-5 py-4">
              <a
                href="tel:18000000"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm"
              >
                <Phone className="size-4 text-brand-600" />
                1800 0000
              </a>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-black text-ink shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag className="size-4" />
                Giỏ hàng ({cartQuantity})
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserRound className="size-4 text-brand-600" />
                Đăng nhập
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
