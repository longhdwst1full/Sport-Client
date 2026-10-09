'use client';

import Link from 'next/link';
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';

interface HeaderActionsProps {
  searchOpen: boolean;
  onToggleSearch: () => void;
  isLoggedIn: boolean;
  customerName: string;
  cartQuantity: number;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export function HeaderActions({
  searchOpen,
  onToggleSearch,
  isLoggedIn,
  customerName,
  cartQuantity,
  mobileMenuOpen,
  onToggleMobileMenu,
}: HeaderActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
      {/* Mobile Search Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSearch}
        className="border-neutral-200 text-neutral-700 transition hover:border-neutral-200 hover:bg-neutral-100 hover:text-neutral-700 lg:hidden"
        aria-label="Tìm sản phẩm"
      >
        <Search aria-hidden className="size-4.5" />
      </Button>

      {/* Chuông thông báo đã gỡ: chưa có API thông báo khách hàng, bản trước hiển thị
          danh sách thông báo mẫu viết cứng như thể là thông báo thật của khách. */}

      {/* User Account */}
      {isLoggedIn ? (
        <Link
          href="/profile"
          className="hidden items-center gap-2 rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-bold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50/60 sm:flex"
          aria-label="Tài khoản cá nhân"
          title="Tài khoản cá nhân"
        >
          <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-neutral-900 text-2xs font-black text-white">
            {customerName ? customerName.slice(0, 1).toUpperCase() : <UserRound className="size-4" />}
          </div>
          <div className="text-left leading-tight pr-1 max-w-[120px]">
            <span className="block text-2xs font-semibold text-neutral-500">Tài khoản</span>
            <span className="block truncate text-xs font-extrabold text-neutral-800">
              {customerName || 'Hội viên'}
            </span>
          </div>
        </Link>
      ) : (
        <Link
          href="/login"
          className="hidden items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50/60 hover:text-neutral-900 sm:flex"
          aria-label="Đăng nhập tài khoản"
          title="Đăng nhập"
        >
          <UserRound className="size-4 text-neutral-900" />
          <span>Đăng nhập</span>
        </Link>
      )}

      {/* Cart */}
      <Link
        href="/cart"
        className="relative grid size-11 place-items-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50/70 hover:text-neutral-900"
        aria-label={cartQuantity > 0 ? `Giỏ hàng, ${cartQuantity} sản phẩm` : 'Giỏ hàng, 0 sản phẩm'}
      >
        <ShoppingBag aria-hidden className="size-4.5" />
        {cartQuantity > 0 && (
          <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-neutral-900 px-1 text-3xs font-black text-white shadow-sm ring-2 ring-white">
            {cartQuantity > 99 ? '99+' : cartQuantity}
          </span>
        )}
      </Link>

      {/* Mobile Menu Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="border-neutral-200 text-neutral-700 transition hover:border-neutral-200 hover:bg-neutral-100 hover:text-neutral-700 lg:hidden"
        aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
        aria-expanded={mobileMenuOpen}
        onClick={onToggleMobileMenu}
      >
        {mobileMenuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
      </Button>
    </div>
  );
}
