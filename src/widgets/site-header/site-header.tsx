'use client';

import Link from 'next/link';
import { Dumbbell, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector } from '@/app/store/hooks';

const QUICK_LINKS = [
  'Máy chạy bộ',
  'Xe đạp tập',
  'Gym & sức mạnh',
  'Yoga & phục hồi',
  'Đồ thể thao',
  'Combo home gym',
] as const;

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartQuantity = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/95 backdrop-blur-xl">
      <div className="overflow-hidden bg-ink px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[.12em] text-white/85 sm:px-4 sm:text-xs sm:tracking-[.16em]">
        <span className="sm:hidden">Giao gần nhất · Giá gồm VAT</span>
        <span className="hidden sm:inline">Giao từ kho gần nhất · Giá hiển thị đã gồm VAT</span>
      </div>
      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:h-[74px] sm:px-5 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 text-base font-black tracking-tight sm:gap-3 sm:text-xl">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-sm sm:size-10">
            <Dumbbell className="size-5" />
          </span>
          <span className="whitespace-nowrap">DCTD SPORT</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-bold lg:flex" aria-label="Điều hướng chính">
          <Link className="transition hover:text-brand-600" href="/#shop-by-sport">Môn thể thao</Link>
          <Link className="transition hover:text-brand-600" href="/#products">Sản phẩm</Link>
          <Link className="transition hover:text-brand-600" href="/#benefits">Dịch vụ</Link>
          <Link className="transition hover:text-brand-600" href="/#stories">Kiến thức</Link>
          <Link className="transition hover:text-brand-600" href="/#about">Về DCTD</Link>
        </nav>
        <div className="flex shrink-0 items-center gap-0 sm:gap-1.5">
          <Link href="/#products" className="hidden size-10 place-items-center rounded-full transition hover:bg-white min-[360px]:grid sm:size-11" aria-label="Tìm sản phẩm">
            <Search className="size-5" />
          </Link>
          <Link href="/login" className="hidden size-11 place-items-center rounded-full transition hover:bg-white sm:grid" aria-label="Đăng nhập tài khoản">
            <UserRound className="size-5" />
          </Link>
          <button className="relative grid size-10 place-items-center rounded-full transition hover:bg-white sm:size-11" aria-label={`Giỏ hàng, ${cartQuantity} sản phẩm`}>
            <ShoppingBag className="size-5" />
            {cartQuantity > 0 && (
              <span className="absolute right-0 top-0 grid min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {cartQuantity > 99 ? '99+' : cartQuantity}
              </span>
            )}
          </button>
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
      <nav
        className="hidden border-t border-ink/5 bg-white/70 lg:block"
        aria-label="Danh mục mua sắm nhanh"
      >
        <div className="mx-auto flex h-11 max-w-7xl items-center justify-center gap-8 px-10 text-xs font-bold text-stone-600">
          {QUICK_LINKS.map((label) => (
            <Link key={label} href="/#products" className="transition hover:text-brand-600">
              {label}
            </Link>
          ))}
        </div>
      </nav>
      {mobileMenuOpen && (
        <nav className="border-t border-ink/10 bg-cream px-5 py-5 lg:hidden" aria-label="Điều hướng di động">
          <div className="mx-auto grid max-w-7xl gap-1 text-base font-bold">
            {[
              ['Môn thể thao', '/#shop-by-sport'],
              ['Sản phẩm', '/#products'],
              ['Dịch vụ', '/#benefits'],
              ['Kiến thức', '/#stories'],
              ['Về DCTD', '/#about'],
              ['Đăng nhập', '/login'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-xl px-3 py-3 hover:bg-white" onClick={() => setMobileMenuOpen(false)}>{label}</Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
