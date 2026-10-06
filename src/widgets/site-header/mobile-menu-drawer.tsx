import Link from 'next/link';
import { ChevronDown, ChevronRight, Dumbbell, MapPin, Phone, ShoppingBag, UserRound } from 'lucide-react';
import { useRef, useState } from 'react';
import { useDialogA11y } from '@/foundation/components/overlay/use-dialog-a11y';
import { STORE_CONTACT, STORE_SHOWROOMS } from '@/shared/constants';
import { AutocompleteSearch } from './autocomplete-search';
import type { MegaMenuEntry } from '@/features/catalog';

interface MobileMenuDrawerProps {
  megaMenuCategories: MegaMenuEntry[];
  hasFlashSaleCampaign: boolean;
  flashSaleMaxDiscountPercent: number | null | undefined;
  isLoggedIn: boolean;
  customerName: string;
  cartQuantity: number;
  onClose: () => void;
}

export function MobileMenuDrawer({
  megaMenuCategories,
  hasFlashSaleCampaign,
  flashSaleMaxDiscountPercent,
  isLoggedIn,
  customerName,
  cartQuantity,
  onClose,
}: MobileMenuDrawerProps) {
  const [expandedMobileCat, setExpandedMobileCat] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Non-modal: the header toggle stays reachable, so no focus trap; focus the container (not the
  // search input) to avoid popping the mobile keyboard.
  useDialogA11y(containerRef, { onClose, initialFocus: 'container' });

  return (
    <div ref={containerRef} role="dialog" aria-label="Menu di động" tabIndex={-1} className="outline-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <nav
        className="relative z-50 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain border-t border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-1 lg:hidden"
        aria-label="Điều hướng di động"
      >
        <div className="mx-auto max-w-7xl divide-y divide-slate-100">
          {/* Mobile In-Drawer Search */}
          <div className="p-4 bg-slate-50">
            <AutocompleteSearch isMobile onCloseMobile={onClose} />
          </div>

          {/* Main Categories Accordion */}
          <div className="px-4 py-3 space-y-1">
            <div className="px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-500">
              Điều hướng
            </div>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition"
              onClick={onClose}
            >
              Trang chủ
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-3 px-3 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition"
              onClick={onClose}
            >
              Tất cả sản phẩm
            </Link>

            <div className="pt-2 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-500">
              Danh mục thiết bị chính hãng
            </div>
            {megaMenuCategories.map((cat, catIdx) => {
              const isExpanded = expandedMobileCat === cat.label;
              return (
                <div key={cat.label} className="rounded-xl border border-transparent overflow-hidden">
                  <div className="flex items-center justify-between rounded-xl hover:bg-slate-50 transition">
                    <Link
                      href={cat.href}
                      className="flex flex-1 items-center gap-3 px-3 py-3 text-sm font-bold text-slate-800 hover:text-brand-700"
                      onClick={onClose}
                    >
                      <Dumbbell className="size-4.5 text-brand-600 shrink-0" />
                      <span>{cat.label}</span>
                    </Link>
                    {cat.children && cat.children.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedMobileCat(isExpanded ? null : cat.label)
                        }
                        className="grid size-11 place-items-center rounded-lg text-slate-500 hover:text-slate-800"
                        aria-label={`${isExpanded ? 'Thu gọn' : 'Mở rộng'} ${cat.label}`}
                        aria-expanded={isExpanded}
                        aria-controls={`mobile-subcat-${catIdx}`}
                      >
                        <ChevronDown
                          className={`size-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-brand-600' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Subcategories dropdown in drawer */}
                  {isExpanded && (
                    <div
                      id={`mobile-subcat-${catIdx}`}
                      className="ml-8 mr-2 my-1 space-y-1 border-l-2 border-brand-200 pl-3 py-1 animate-in fade-in"
                    >
                      {cat.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center justify-between py-2.5 text-sm font-medium text-slate-600 hover:text-brand-700"
                          onClick={onClose}
                        >
                          <span>{child.label}</span>
                          <ChevronRight className="size-3 text-slate-300" />
                        </Link>
                      ))}
                      <Link
                        href={cat.href}
                        className="inline-block py-2 text-sm font-extrabold text-brand-700 hover:underline"
                        onClick={onClose}
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
            {hasFlashSaleCampaign && (
              <Link
                href="/flash-sale"
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-black text-brand-700 hover:bg-brand-50 transition"
                onClick={onClose}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden className="size-2 rounded-full bg-brand-600" />
                  ⚡ Giờ Vàng Flash Sale
                  {flashSaleMaxDiscountPercent ? ` Giảm ${flashSaleMaxDiscountPercent}%` : ''}
                </span>
                <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                  SỐC
                </span>
              </Link>
            )}

            <Link
              href="/products"
              className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold text-slate-800 hover:bg-brand-50 hover:text-brand-700 transition"
              onClick={onClose}
            >
              <span className="flex items-center gap-2.5">
                Combo Home Gym Trọn Gói
              </span>
              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase text-slate-950">
                Hot
              </span>
            </Link>

            <Link
              href="/news"
              className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold text-slate-800 hover:bg-brand-50 hover:text-brand-700 transition"
              onClick={onClose}
            >
              <span>Cẩm nang & Kinh nghiệm tập luyện</span>
              <ChevronRight className="size-3.5 text-slate-400" />
            </Link>

            <Link
              href="/contact"
              className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold text-slate-800 hover:bg-brand-50 hover:text-brand-700 transition"
              onClick={onClose}
            >
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-brand-600" />
                Hệ thống Showroom Bảo An Sport
              </span>
              <ChevronRight className="size-3.5 text-slate-400" />
            </Link>

          </div>

          {/* Showrooms & Hotlines info */}
          <div className="space-y-1.5 bg-slate-50/50 px-5 py-3 text-xs text-slate-600">
            <div className="font-bold text-slate-700">Showroom mở cửa {STORE_CONTACT.openingHours}</div>
            {STORE_SHOWROOMS.map((showroom) => (
              <div key={showroom.id} className="flex gap-1.5">
                <MapPin aria-hidden className="mt-0.5 size-3.5 shrink-0 text-brand-600" />
                <span>
                  <strong className="text-slate-800">{showroom.city}:</strong> {showroom.address}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile Contact & Action Buttons */}
          <div className="flex flex-wrap gap-2.5 px-4 py-4 bg-slate-50">
            <a
              href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white"
            >
              <Phone aria-hidden className="size-3.5 text-brand-400" />
              <span>{STORE_CONTACT.primaryHotline}</span>
            </a>
            <Link
              href="/cart"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-black text-white hover:bg-brand-700"
              onClick={onClose}
            >
              <ShoppingBag className="size-3.5" />
              <span>Giỏ hàng ({cartQuantity})</span>
            </Link>
            <Link
              href={isLoggedIn ? '/profile' : '/login'}
              className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold transition ${
                isLoggedIn
                  ? 'border border-slate-200 bg-white text-slate-800 font-extrabold'
                  : 'border border-slate-200 bg-white text-slate-700'
              }`}
              onClick={onClose}
            >
              <UserRound className="size-3.5 text-brand-600" />
              <span className="truncate">{isLoggedIn ? (customerName ? `Chào, ${customerName}` : 'Tài khoản') : 'Đăng nhập'}</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
