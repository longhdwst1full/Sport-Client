'use client';

import Link from 'next/link';
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';

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
      <button
        type="button"
        onClick={onToggleSearch}
        className="grid size-10.5 place-items-center rounded-2xl border border-slate-200/80 bg-slate-50 text-slate-700 transition hover:bg-slate-100 shadow-xs lg:hidden"
        aria-label="Tìm sản phẩm"
      >
        <Search className="size-4.5" />
      </button>

      {/* Chuông thông báo đã gỡ: chưa có API thông báo khách hàng, bản trước hiển thị
          danh sách thông báo mẫu viết cứng như thể là thông báo thật của khách. */}

      {/* User Account */}
      {isLoggedIn ? (
        <Link
          href="/profile"
          className="hidden items-center gap-2 rounded-2xl border border-emerald-300/90 bg-emerald-50/80 px-2.5 py-1.5 text-xs font-bold text-emerald-950 transition hover:bg-emerald-100 hover:border-emerald-400 shadow-2xs sm:flex"
          aria-label="Tài khoản cá nhân"
          title="Tài khoản cá nhân"
        >
          <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-emerald-600 font-black text-white text-[11px] shadow-xs">
            {customerName ? customerName.slice(0, 1).toUpperCase() : <UserRound className="size-4" />}
          </div>
          <div className="text-left leading-tight pr-1 max-w-[120px]">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-700">Tài khoản</span>
            <span className="block truncate text-xs font-extrabold text-slate-800">
              {customerName || 'Hội viên'}
            </span>
          </div>
        </Link>
      ) : (
        <Link
          href="/login"
          className="hidden items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-emerald-700 shadow-2xs sm:flex"
          aria-label="Đăng nhập tài khoản"
          title="Đăng nhập"
        >
          <UserRound className="size-4 text-emerald-600" />
          <span>Đăng nhập</span>
        </Link>
      )}

      {/* Cart */}
      <Link
        href="/cart"
        className="relative grid size-10.5 place-items-center rounded-2xl border border-slate-200/80 bg-slate-50 text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-emerald-700 shadow-xs"
        aria-label={cartQuantity > 0 ? `Giỏ hàng, ${cartQuantity} sản phẩm` : 'Giỏ hàng, 0 sản phẩm'}
      >
        <ShoppingBag className="size-4.5" />
        {cartQuantity > 0 && (
          <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
            {cartQuantity > 99 ? '99+' : cartQuantity}
          </span>
        )}
      </Link>

      {/* Mobile Menu Toggle */}
      <button
        className="grid size-10.5 place-items-center rounded-2xl border border-slate-200/80 bg-slate-50 text-slate-700 sm:size-10.5 shadow-xs lg:hidden"
        aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
        aria-expanded={mobileMenuOpen}
        onClick={onToggleMobileMenu}
      >
        {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
    </div>
  );
}
