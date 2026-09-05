'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  ShieldCheck,
  Award,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { clearCustomerAuthTokens } from '@/features/auth/auth-token.store';
import { vndMoney } from '@/shared/format/money';

type ProfileTab = 'orders' | 'warranty' | 'address' | 'settings';

const MOCK_ORDERS = [
  {
    id: 'DCTD-88291',
    date: '02/09/2026',
    status: 'Đang giao hàng',
    statusColor: 'text-emerald-700 bg-emerald-100',
    total: 3590000,
    items: [
      { name: 'Bộ tạ tay tháo lắp cao cấp 20kg (2x10kg)', qty: 1, price: 1890000 },
      { name: 'Đệm lót gánh tạ Barbell Pad DCTD', qty: 2, price: 850000 },
    ],
  },
  {
    id: 'DCTD-76120',
    date: '18/08/2026',
    status: 'Đã hoàn thành',
    statusColor: 'text-stone-700 bg-stone-100',
    total: 12500000,
    items: [
      { name: 'Ghế tập tạ đa năng điều chỉnh 7 góc độ', qty: 1, price: 12500000 },
    ],
  },
];

const MOCK_WARRANTIES = [
  {
    serial: 'SN-DCTD-2026-0912',
    productName: 'Ghế tập tạ đa năng điều chỉnh 7 góc độ Pro',
    activationDate: '18/08/2026',
    expiryDate: '18/08/2028',
    status: 'Còn hiệu lực 23 tháng',
  },
  {
    serial: 'SN-DCTD-2026-4481',
    productName: 'Bộ tạ tay tháo lắp cao cấp 20kg',
    activationDate: '02/09/2026',
    expiryDate: '02/09/2028',
    status: 'Còn hiệu lực 24 tháng',
  },
];

export function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');

  const handleLogout = () => {
    clearCustomerAuthTokens();
    router.push('/login');
  };

  return (
    <StorefrontLayout>
      <div className="bg-stone-50/60 pb-20 pt-8">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-xs font-semibold text-stone-500">
            <Link href="/" className="hover:text-emerald-700">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="font-bold text-ink">Tài khoản cá nhân</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            {/* Sidebar User Card */}
            <aside className="space-y-6">
              <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="grid size-16 place-items-center rounded-2xl bg-emerald-500 text-2xl font-black text-ink shadow-md shadow-emerald-500/20">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="truncate text-lg font-black text-ink">Nguyễn Văn An</h1>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">
                        <Award className="size-3" /> Hạng Vàng
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-stone-400">an.nguyen@example.com</p>
                  </div>
                </div>

                {/* Reward Points Box */}
                <div className="mt-6 rounded-2xl bg-stone-900 p-4 text-white">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Điểm tích lũy DCTD</span>
                    <Sparkles className="size-4 text-emerald-400" />
                  </div>
                  <strong className="mt-1 block text-2xl font-black text-emerald-400">
                    1,450 <span className="text-xs font-medium text-white/60">điểm</span>
                  </strong>
                  <p className="mt-1 text-[11px] text-stone-400">
                    Tương đương giảm 145.000đ cho đơn hàng tiếp theo.
                  </p>
                </div>

                {/* Nav Tabs */}
                <nav className="mt-6 space-y-1">
                  {[
                    { id: 'orders' as const, label: 'Lịch sử đơn hàng', icon: Package },
                    { id: 'warranty' as const, label: 'Tra cứu bảo hành', icon: ShieldCheck },
                    { id: 'address' as const, label: 'Sổ địa chỉ', icon: MapPin },
                    { id: 'settings' as const, label: 'Cài đặt tài khoản', icon: User },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveTab(id)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition ${
                        activeTab === id
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-ink'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="size-4.5" />
                        {label}
                      </span>
                      <ChevronRight className="size-4 opacity-50" />
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="size-4.5" />
                    Đăng xuất
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content Pane */}
            <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8">
              {activeTab === 'orders' && (
                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                    <div>
                      <h2 className="text-xl font-black text-ink">Lịch sử đơn hàng</h2>
                      <p className="mt-1 text-xs text-stone-500">Quản lý và theo dõi các đơn hàng gần đây</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    {MOCK_ORDERS.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-stone-200/70 p-5 transition hover:border-emerald-300"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                          <div className="flex items-center gap-3">
                            <strong className="text-sm font-bold text-ink">{order.id}</strong>
                            <span className="text-xs text-stone-400">· Ngày đặt: {order.date}</span>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="mt-4 divide-y divide-stone-50">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 text-sm">
                              <span className="font-semibold text-stone-800">
                                {item.qty} × {item.name}
                              </span>
                              <strong className="text-xs font-black text-ink">
                                {vndMoney.format(item.price)}
                              </strong>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-sm">
                          <span className="font-bold text-stone-500">Tổng thanh toán:</span>
                          <strong className="text-base font-black text-emerald-700">
                            {vndMoney.format(order.total)}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'warranty' && (
                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                    <div>
                      <h2 className="text-xl font-black text-ink">Tra cứu bảo hành điện tử</h2>
                      <p className="mt-1 text-xs text-stone-500">
                        Thiết bị của bạn được kích hoạt bảo hành chính hãng từ ngày nhận hàng
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {MOCK_WARRANTIES.map((w) => (
                      <div key={w.serial} className="rounded-2xl border border-stone-200/70 p-5">
                        <div className="flex items-center justify-between">
                          <strong className="text-base font-bold text-ink">{w.productName}</strong>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                            {w.status}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-stone-600 sm:grid-cols-3">
                          <div>
                            <span className="text-stone-400">Số serial:</span>
                            <p className="font-mono font-bold text-ink">{w.serial}</p>
                          </div>
                          <div>
                            <span className="text-stone-400">Ngày kích hoạt:</span>
                            <p className="font-semibold">{w.activationDate}</p>
                          </div>
                          <div>
                            <span className="text-stone-400">Hết hạn:</span>
                            <p className="font-semibold">{w.expiryDate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'address' && (
                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                    <div>
                      <h2 className="text-xl font-black text-ink">Sổ địa chỉ nhận hàng</h2>
                      <p className="mt-1 text-xs text-stone-500">Địa chỉ dùng để giao hàng và lắp đặt tận nơi</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-50/20 p-5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          Mặc định
                        </span>
                        <button type="button" className="text-xs font-bold text-emerald-700 hover:underline">
                          Chỉnh sửa
                        </button>
                      </div>
                      <strong className="mt-2 block text-sm font-bold text-ink">Nguyễn Văn An · 0912 345 678</strong>
                      <p className="mt-1 text-xs text-stone-600">
                        Số 123 Đường Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                    <div>
                      <h2 className="text-xl font-black text-ink">Thông tin cá nhân</h2>
                      <p className="mt-1 text-xs text-stone-500">Cập nhật họ tên, mật khẩu và thông tin liên lạc</p>
                    </div>
                  </div>

                  <div className="mt-6 max-w-md space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500">Họ và tên</label>
                      <input
                        defaultValue="Nguyễn Văn An"
                        className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500">Email</label>
                      <input
                        defaultValue="an.nguyen@example.com"
                        className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500">Số điện thoại</label>
                      <input
                        defaultValue="0912 345 678"
                        className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-emerald-500 px-6 py-3 font-bold text-ink transition hover:bg-emerald-400"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </StorefrontLayout>
  );
}
