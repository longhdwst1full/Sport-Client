import Link from 'next/link';
import {
  ChevronRight,
  LifeBuoy,
  LogOut,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { STORE_CONTACT } from '@/shared/constants';

export type ProfileTab = 'info' | 'security' | 'address';

export const PROFILE_TABS: ReadonlyArray<{ id: ProfileTab; label: string; icon: LucideIcon }> = [
  { id: 'info', label: 'Thông tin cá nhân', icon: UserRound },
  { id: 'security', label: 'Mật khẩu & bảo mật', icon: ShieldCheck },
  { id: 'address', label: 'Sổ địa chỉ', icon: MapPin },
];

/** Trang mua sắm có route riêng — điều hướng bằng link thật để mở tab mới/quay lại đúng. */
const SHOPPING_LINKS: ReadonlyArray<{ href: string; label: string; icon: LucideIcon }> = [
  { href: '/orders', label: 'Đơn hàng của tôi', icon: Package },
  { href: '/returns', label: 'Đổi trả & hoàn tiền', icon: RotateCcw },
  { href: '/account/support', label: 'Yêu cầu hỗ trợ', icon: LifeBuoy },
];

const navItemClass = (active: boolean) =>
  `flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dc-primary-600)] ${
    active
      ? 'bg-[var(--dc-primary-50)] text-[var(--dc-primary-700)]'
      : 'text-[var(--dc-text-secondary)] hover:bg-[var(--dc-canvas)] hover:text-[var(--dc-text-primary)]'
  }`;

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onSelectTab: (tab: ProfileTab) => void;
  onLogout: () => void;
}

/** Điều hướng tài khoản cho màn hình lớn; màn hình nhỏ dùng thanh tab ngang ở `ProfilePage`. */
export function ProfileSidebar({ activeTab, onSelectTab, onLogout }: ProfileSidebarProps) {
  return (
    <aside className="hidden space-y-4 lg:block">
      <nav
        aria-label="Tài khoản"
        className="rounded-[24px] border border-[var(--dc-border)] bg-white p-3 shadow-sm"
      >
        <p className="px-3.5 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-[var(--dc-text-secondary)]">
          Tài khoản
        </p>
        {PROFILE_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-current={activeTab === id ? 'page' : undefined}
            onClick={() => onSelectTab(id)}
            className={navItemClass(activeTab === id)}
          >
            <span className="flex items-center gap-3">
              <Icon className="size-4.5" aria-hidden />
              {label}
            </span>
          </button>
        ))}

        <p className="mt-2 border-t border-[var(--dc-border)] px-3.5 pb-1 pt-4 text-[11px] font-bold uppercase tracking-wider text-[var(--dc-text-secondary)]">
          Mua sắm
        </p>
        {SHOPPING_LINKS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={navItemClass(false)}>
            <span className="flex items-center gap-3">
              <Icon className="size-4.5" aria-hidden />
              {label}
            </span>
            <ChevronRight className="size-4 opacity-40" aria-hidden />
          </Link>
        ))}

        <button
          type="button"
          onClick={onLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl border-t border-[var(--dc-border)] px-3.5 pb-2.5 pt-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <LogOut className="size-4.5" aria-hidden />
          Đăng xuất
        </button>
      </nav>

      <div className="rounded-[24px] border border-[var(--dc-border)] bg-white p-5 text-sm">
        <p className="font-bold text-[var(--dc-text-primary)]">Cần hỗ trợ đơn hàng?</p>
        <p className="mt-1 text-xs text-[var(--dc-text-secondary)]">Gọi hotline, nhân viên hỗ trợ ngay.</p>
        <a
          href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
          className="mt-3 inline-flex items-center gap-2 font-bold rounded text-[var(--dc-primary-700)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dc-primary-600)]"
        >
          <Phone className="size-4" aria-hidden />
          {STORE_CONTACT.primaryHotline}
        </a>
      </div>
    </aside>
  );
}

/** Liên kết mua sắm cho màn hình nhỏ (sidebar ẩn dưới `lg`). */
export function ProfileShoppingLinks() {
  return (
    <div className="grid grid-cols-3 gap-2 lg:hidden">
      {SHOPPING_LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--dc-border)] bg-white px-2 py-3 text-center text-[11px] font-semibold text-[var(--dc-text-secondary)] transition hover:border-[var(--dc-primary-500)] hover:text-[var(--dc-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dc-primary-600)]"
        >
          <Icon className="size-5" aria-hidden />
          {label}
        </Link>
      ))}
    </div>
  );
}
