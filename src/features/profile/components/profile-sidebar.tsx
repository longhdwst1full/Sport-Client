import { ChevronRight, LogOut, MapPin, Package, Phone, RotateCcw, User } from 'lucide-react';
import { STORE_CONTACT } from '@/shared/constants';

export type ProfileTab = 'address' | 'settings';

interface ProfileSidebarProps {
  profileName: string;
  profileEmail: string;
  activeTab: ProfileTab;
  onSelectTab: (tab: ProfileTab) => void;
  onNavigateOrders: () => void;
  onNavigateReturns: () => void;
  onLogout: () => void;
}

export function ProfileSidebar({
  profileName,
  profileEmail,
  activeTab,
  onSelectTab,
  onNavigateOrders,
  onNavigateReturns,
  onLogout,
}: ProfileSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-2xl font-black text-white shadow-md shadow-emerald-600/20">
            A
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-black text-slate-900">
              {profileName}
            </h1>
            <p className="mt-1 truncate text-xs text-slate-400">{profileEmail}</p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="mt-6 space-y-1">
          {[
            { id: 'orders' as const, label: 'Lịch sử đơn hàng', icon: Package },
            { id: 'returns' as const, label: 'Yêu cầu đổi trả', icon: RotateCcw },
            { id: 'address' as const, label: 'Sổ địa chỉ nhận hàng', icon: MapPin },
            { id: 'settings' as const, label: 'Cài đặt tài khoản', icon: User },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                if (id === 'orders') {
                  onNavigateOrders();
                  return;
                }
                if (id === 'returns') {
                  onNavigateReturns();
                  return;
                }
                onSelectTab(id);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition sm:text-sm ${
                activeTab === id
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4.5" />
                {label}
              </span>
              <ChevronRight className="size-4 opacity-40" />
            </button>
          ))}

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-rose-600 transition hover:bg-rose-50 sm:text-sm"
          >
            <LogOut className="size-4.5" />
            Đăng xuất
          </button>
        </nav>
      </div>

      {/* Quick hotline widget */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-xs text-slate-600">
        <span className="font-bold text-slate-800">Cần hỗ trợ đơn hàng gấp?</span>
        <p className="mt-1 text-slate-500">Hotline 24/7 từ showroom gần bạn nhất:</p>
        <a
          href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
          className="mt-2 flex items-center gap-2 font-mono font-bold text-emerald-700 hover:underline"
        >
          <Phone className="size-3.5" />
          {STORE_CONTACT.primaryHotline} (Toàn quốc)
        </a>
      </div>
    </aside>
  );
}
