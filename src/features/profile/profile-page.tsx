'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Trash2,
  Plus,
  Truck,
  Check,
  Search,
  Wrench,
  AlertCircle,
  X,
  RefreshCw,
} from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { clearCustomerAuthTokens } from '@/features/auth/auth-token.store';
import { vndMoney } from '@/shared/format/money';
import { STORE_CONFIG, STORE_CONTACT } from '@/constants';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import {
  VietnamAddressSelector,
  type SelectedAddressData,
} from '@/components/address/vietnam-address-selector';
import { useToast } from '@/shared/components/global-toast';

type ProfileTab = 'orders' | 'warranty' | 'address' | 'settings';
type OrderFilter = 'all' | 'pending' | 'shipping' | 'completed' | 'cancelled';

import {
  type OrderItem,
  type UserOrder,
  type AddressItem,
  type WarrantyItem,
  MOCK_INITIAL_ORDERS as INITIAL_MOCK_ORDERS,
  MOCK_INITIAL_ADDRESSES as INITIAL_ADDRESSES,
  MOCK_WARRANTIES,
} from '@/shared/data/mocks';

export function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('all');

  // Orders state (merged from localStorage + initial)
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<UserOrder | null>(null);

  // Address state
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressFormName, setAddressFormName] = useState('');
  const [addressFormPhone, setAddressFormPhone] = useState('');
  const [addressFormLabel, setAddressFormLabel] = useState<'home' | 'office' | 'other'>('home');
  const [addressFormIsDefault, setAddressFormIsDefault] = useState(false);
  const [modalAddressData, setModalAddressData] = useState<SelectedAddressData>({
    provinceCode: null,
    provinceName: '',
    districtCode: null,
    districtName: '',
    wardCode: null,
    wardName: '',
    streetAddress: '',
    fullAddress: '',
  });

  // Warranty search
  const [warrantySearchQuery, setWarrantySearchQuery] = useState('');
  const [filteredWarranties, setFilteredWarranties] = useState(MOCK_WARRANTIES);

  // Profile Settings Form
  const [profileName, setProfileName] = useState('Nguyễn Văn An');
  const [profileEmail, setProfileEmail] = useState('an.nguyen@example.com');
  const [profilePhone, setProfilePhone] = useState('0912 345 678');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const { success } = useToast();
  const showToast = (msg: string) => {
    success('Thông báo', msg);
  };

  // Load orders & addresses from localStorage
  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem('baoan_user_orders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
          // Merge unique by ID
          const existingIds = new Set(parsedOrders.map((o: any) => o.id));
          const unmergedMock = INITIAL_MOCK_ORDERS.filter((o) => !existingIds.has(o.id));
          setOrders([...parsedOrders, ...unmergedMock]);
        } else {
          setOrders(INITIAL_MOCK_ORDERS);
        }
      } else {
        setOrders(INITIAL_MOCK_ORDERS);
      }

      const storedAddresses = localStorage.getItem('baoan_saved_addresses');
      if (storedAddresses) {
        const parsedAddrs = JSON.parse(storedAddresses);
        if (Array.isArray(parsedAddrs) && parsedAddrs.length > 0) {
          setAddresses(parsedAddrs);
        } else {
          setAddresses(INITIAL_ADDRESSES);
        }
      } else {
        setAddresses(INITIAL_ADDRESSES);
      }
    } catch {
      setOrders(INITIAL_MOCK_ORDERS);
      setAddresses(INITIAL_ADDRESSES);
    }
  }, []);

  // Save addresses to localStorage when updated
  const updateAddresses = (newAddresses: AddressItem[]) => {
    setAddresses(newAddresses);
    try {
      localStorage.setItem('baoan_saved_addresses', JSON.stringify(newAddresses));
    } catch {
      // ignore
    }
  };

  // Filter orders by tab
  const displayedOrders = orders.filter((order) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'pending') {
      return (
        order.statusCode === 'pending' ||
        order.status.toLowerCase().includes('chờ') ||
        order.status.toLowerCase().includes('tiếp nhận')
      );
    }
    if (orderFilter === 'shipping') {
      return (
        order.statusCode === 'shipping' ||
        order.status.toLowerCase().includes('đang giao') ||
        order.status.toLowerCase().includes('vận chuyển')
      );
    }
    if (orderFilter === 'completed') {
      return (
        order.statusCode === 'completed' ||
        order.status.toLowerCase().includes('hoàn thành') ||
        order.status.toLowerCase().includes('đã giao')
      );
    }
    if (orderFilter === 'cancelled') {
      return (
        order.statusCode === 'cancelled' ||
        order.status.toLowerCase().includes('hủy')
      );
    }
    return true;
  });

  // Re-order items
  const handleReorder = (order: UserOrder) => {
    order.items.forEach((item) => {
      dispatch(
        addCartItem({
          productId: item.id,
          variantId: `${item.id}-default`,
          sku: item.sku || 'BA-REORDER',
          productType: 'STANDARD',
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=600&q=80',
          quantity: item.qty,
        }),
      );
    });
    showToast(`Đã thêm ${order.items.length} sản phẩm vào giỏ hàng!`);
    router.push('/cart');
  };

  // Address Modal Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressFormName(profileName);
    setAddressFormPhone(profilePhone);
    setAddressFormLabel('home');
    setAddressFormIsDefault(addresses.length === 0);
    setModalAddressData({
      provinceCode: null,
      provinceName: '',
      districtCode: null,
      districtName: '',
      wardCode: null,
      wardName: '',
      streetAddress: '',
      fullAddress: '',
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: AddressItem) => {
    setEditingAddressId(addr.id);
    setAddressFormName(addr.name);
    setAddressFormPhone(addr.phone);
    setAddressFormLabel(addr.label);
    setAddressFormIsDefault(addr.isDefault);
    setModalAddressData({
      provinceCode: addr.provinceCode ?? null,
      provinceName: '',
      districtCode: addr.districtCode ?? null,
      districtName: '',
      wardCode: addr.wardCode ?? null,
      wardName: '',
      streetAddress: addr.streetAddress || '',
      fullAddress: addr.fullAddress,
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAddressData.fullAddress && !modalAddressData.streetAddress) {
      alert('Vui lòng chọn Tỉnh/Thành, Quận/Huyện và nhập số nhà tên đường.');
      return;
    }

    if (editingAddressId) {
      // Edit existing
      const updated = addresses.map((a) => {
        if (a.id === editingAddressId) {
          return {
            ...a,
            name: addressFormName,
            phone: addressFormPhone,
            label: addressFormLabel,
            isDefault: addressFormIsDefault ? true : a.isDefault,
            fullAddress: modalAddressData.fullAddress || a.fullAddress,
            provinceCode: modalAddressData.provinceCode ?? a.provinceCode,
            districtCode: modalAddressData.districtCode ?? a.districtCode,
            wardCode: modalAddressData.wardCode ?? a.wardCode,
            streetAddress: modalAddressData.streetAddress ?? a.streetAddress,
          };
        }
        return addressFormIsDefault ? { ...a, isDefault: false } : a;
      });
      updateAddresses(updated);
      showToast('Đã cập nhật địa chỉ thành công!');
    } else {
      // Add new
      const newAddr: AddressItem = {
        id: `addr-${Date.now()}`,
        name: addressFormName,
        phone: addressFormPhone,
        label: addressFormLabel,
        isDefault: addressFormIsDefault || addresses.length === 0,
        fullAddress: modalAddressData.fullAddress,
        provinceCode: modalAddressData.provinceCode ?? undefined,
        districtCode: modalAddressData.districtCode ?? undefined,
        wardCode: modalAddressData.wardCode ?? undefined,
        streetAddress: modalAddressData.streetAddress,
      };

      const next = addressFormIsDefault
        ? [newAddr, ...addresses.map((a) => ({ ...a, isDefault: false }))]
        : [...addresses, newAddr];

      updateAddresses(next);
      showToast('Đã thêm địa chỉ mới vào sổ địa chỉ!');
    }

    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      const next = addresses.filter((a) => a.id !== id);
      if (next.length > 0 && !next.some((a) => a.isDefault)) {
        next[0].isDefault = true;
      }
      updateAddresses(next);
      showToast('Đã xóa địa chỉ thành công.');
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    const next = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    updateAddresses(next);
    showToast('Đã đổi địa chỉ mặc định!');
  };

  // Warranty search
  const handleSearchWarranty = (query: string) => {
    setWarrantySearchQuery(query);
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredWarranties(MOCK_WARRANTIES);
      return;
    }
    const res = MOCK_WARRANTIES.filter(
      (w) =>
        w.serial.toLowerCase().includes(q) ||
        w.productName.toLowerCase().includes(q),
    );
    setFilteredWarranties(res);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg('Thông tin cá nhân đã được lưu thành công!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleLogout = () => {
    clearCustomerAuthTokens();
    router.push('/login');
  };

  return (
    <StorefrontLayout>
      <div className="bg-slate-50/60 pb-20 pt-6">

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-emerald-700">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="font-bold text-slate-900">Tài khoản thành viên</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            {/* ======================================================== */}
            {/* SIDEBAR USER CARD                                        */}
            {/* ======================================================== */}
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
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">
                        <Award className="size-3" /> Thành viên Gold
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-400">{profileEmail}</p>
                  </div>
                </div>

                {/* Reward points box */}
                <div className="mt-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-white">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Điểm tích lũy {STORE_CONFIG.shortName}</span>
                    <Sparkles className="size-4 text-emerald-400" />
                  </div>
                  <strong className="mt-1 block text-2xl font-black text-emerald-400">
                    1,450 <span className="text-xs font-medium text-white/60">điểm</span>
                  </strong>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Tương đương giảm 145.000đ khi đặt mua đơn hàng tiếp theo.
                  </p>
                </div>

                {/* Navigation tabs */}
                <nav className="mt-6 space-y-1">
                  {[
                    { id: 'orders' as const, label: 'Lịch sử đơn hàng', icon: Package },
                    { id: 'address' as const, label: 'Sổ địa chỉ nhận hàng', icon: MapPin },
                    { id: 'warranty' as const, label: 'Tra cứu bảo hành', icon: ShieldCheck },
                    { id: 'settings' as const, label: 'Cài đặt tài khoản', icon: User },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveTab(id)}
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
                    onClick={handleLogout}
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

            {/* ======================================================== */}
            {/* MAIN CONTENT PANE                                        */}
            {/* ======================================================== */}
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              {/* TAB 1: ORDERS (LỊCH SỬ ĐƠN HÀNG) */}
              {activeTab === 'orders' && (
                <div>
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Lịch sử đơn hàng</h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Theo dõi tiến độ giao hàng và xem chi tiết các đơn đã đặt
                      </p>
                    </div>

                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      <span>Mua sắm thêm sản phẩm</span>
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>

                  {/* Status filter tabs */}
                  <div className="mt-6 flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1.5 scrollbar-none">
                    {[
                      { id: 'all' as const, label: 'Tất cả' },
                      { id: 'pending' as const, label: 'Chờ xác nhận' },
                      { id: 'shipping' as const, label: 'Đang vận chuyển' },
                      { id: 'completed' as const, label: 'Hoàn thành' },
                      { id: 'cancelled' as const, label: 'Đã hủy' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setOrderFilter(f.id)}
                        className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                          orderFilter === f.id
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Orders List */}
                  {displayedOrders.length === 0 ? (
                    <div className="py-16 text-center">
                      <Package className="mx-auto size-12 text-slate-300" />
                      <p className="mt-3 text-sm font-bold text-slate-600">
                        Chưa có đơn hàng nào trong mục này.
                      </p>
                      <Link
                        href="/products"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600"
                      >
                        Khám phá thiết bị ngay
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-5">
                      {displayedOrders.map((order) => (
                        <div
                          key={order.id}
                          className="group rounded-2xl border border-slate-200/80 p-5 transition duration-200 hover:border-emerald-300 hover:shadow-md"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <strong className="font-mono text-sm font-black text-slate-900">
                                #{order.id}
                              </strong>
                              <span className="text-xs text-slate-400">· {order.date}</span>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${order.statusColor}`}
                            >
                              {order.status}
                            </span>
                          </div>

                          {/* Items in order */}
                          <div className="mt-4 divide-y divide-slate-100">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between py-2 text-xs sm:text-sm"
                              >
                                <div className="flex items-center gap-3">
                                  {item.imageUrl && (
                                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                      <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        sizes="40px"
                                        className="object-contain p-0.5"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-bold text-slate-900">{item.name}</span>
                                    <p className="text-[11px] text-slate-400">Số lượng: ×{item.qty}</p>
                                  </div>
                                </div>
                                <strong className="font-black text-slate-900">
                                  {vndMoney.format(item.price * item.qty)}
                                </strong>
                              </div>
                            ))}
                          </div>

                          {/* Order Footer Actions */}
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                            <div>
                              <span className="text-xs text-slate-500">Tổng thanh toán: </span>
                              <strong className="text-sm font-black text-emerald-700 sm:text-base">
                                {vndMoney.format(order.total)}
                              </strong>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedOrderForDetail(order)}
                                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                              >
                                Xem chi tiết
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReorder(order)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600"
                              >
                                <RefreshCw className="size-3" />
                                <span>Mua lại</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ADDRESS MANAGEMENT (SỔ ĐỊA CHỈ & VIETNAMESE DIVISION API) */}
              {activeTab === 'address' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Sổ địa chỉ nhận hàng</h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Quản lý các địa chỉ giao hàng và lắp đặt thiết bị tận nơi
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddAddress}
                      className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500"
                    >
                      <Plus className="size-4" />
                      <span>Thêm địa chỉ mới</span>
                    </button>
                  </div>

                  {/* Address List */}
                  <div className="mt-6 space-y-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`relative rounded-2xl border p-5 transition ${
                          addr.isDefault
                            ? 'border-2 border-emerald-500/60 bg-emerald-50/20 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-bold text-slate-900">{addr.name}</strong>
                            <span className="text-xs text-slate-400">· {addr.phone}</span>
                            {addr.isDefault && (
                              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase text-white">
                                Mặc định
                              </span>
                            )}
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                              {addr.label === 'home'
                                ? 'Nhà riêng'
                                : addr.label === 'office'
                                ? 'Văn phòng'
                                : 'Khác'}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3 text-xs">
                            {!addr.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="font-bold text-emerald-700 hover:underline"
                              >
                                Đặt làm mặc định
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenEditAddress(addr)}
                              className="font-bold text-slate-600 hover:text-slate-900"
                            >
                              Sửa
                            </button>
                            {addresses.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="font-bold text-rose-600 hover:underline"
                              >
                                Xóa
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                          {addr.fullAddress}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: WARRANTY LOOKUP (TRA CỨU BẢO HÀNH CHÍNH HÃNG) */}
              {activeTab === 'warranty' && (
                <div>
                  <div className="border-b border-slate-100 pb-5">
                    <h2 className="text-xl font-black text-slate-900">
                      Tra cứu bảo hành điện tử chính hãng
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Thiết bị tại {STORE_CONFIG.name} được kích hoạt bảo hành điện tử tự động từ ngày bàn giao
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="mt-6 flex gap-2">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={warrantySearchQuery}
                        onChange={(e) => handleSearchWarranty(e.target.value)}
                        placeholder="Nhập số Serial (ví dụ: BA-SPIN-2026-0912) hoặc tên máy..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Warranty Cards */}
                  <div className="mt-6 space-y-4">
                    {filteredWarranties.map((w) => (
                      <div
                        key={w.serial}
                        className="rounded-2xl border border-slate-200/80 p-5 transition hover:border-emerald-300"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <strong className="text-sm font-bold text-slate-900 sm:text-base">
                            {w.productName}
                          </strong>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                            {w.status}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600 sm:grid-cols-3">
                          <div>
                            <span className="text-slate-400">Số serial điện tử:</span>
                            <p className="font-mono font-bold text-slate-900">{w.serial}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Ngày kích hoạt:</span>
                            <p className="font-semibold text-slate-800">{w.activationDate}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Thời hạn kết thúc:</span>
                            <p className="font-semibold text-slate-800">{w.expiryDate}</p>
                          </div>
                        </div>

                        <p className="mt-3 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600">
                          <strong>Chính sách:</strong> {w.policy}
                        </p>

                        <div className="mt-4 flex items-center justify-end">
                          <a
                            href={`tel:${STORE_CONTACT.primaryHotlineRaw}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                          >
                            <Wrench className="size-3.5" />
                            <span>Yêu cầu kỹ thuật viên bảo dưỡng tận nhà</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SETTINGS (CÀI ĐẶT TÀI KHOẢN) */}
              {activeTab === 'settings' && (
                <div>
                  <div className="border-b border-slate-100 pb-5">
                    <h2 className="text-xl font-black text-slate-900">Cài đặt tài khoản cá nhân</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Cập nhật họ tên, mật khẩu và tùy chọn nhận thông báo đơn hàng
                    </p>
                  </div>

                  {saveSuccessMsg && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="mt-6 max-w-lg space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Email đăng nhập
                      </label>
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        required
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:text-sm"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500 sm:text-sm"
                      >
                        Lưu thông tin thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ======================================================== */}
        {/* MODAL: ADD / EDIT ADDRESS WITH VIETNAM CASCADING SELECTOR */}
        {/* ======================================================== */}
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900">
                  {editingAddressId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ nhận hàng mới'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="mt-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Tên người nhận *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressFormName}
                      onChange={(e) => setAddressFormName(e.target.value)}
                      placeholder="Nguyễn Văn An"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      value={addressFormPhone}
                      onChange={(e) => setAddressFormPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Vietnam Cascading Address Selector Component */}
                <div className="border-y border-slate-100 py-4">
                  <VietnamAddressSelector
                    initialData={modalAddressData}
                    onChange={(data) => setModalAddressData(data)}
                    required
                  />
                </div>

                {/* Address Label & Default toggle */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Loại địa chỉ:</span>
                    {(['home', 'office', 'other'] as const).map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setAddressFormLabel(lbl)}
                        className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                          addressFormLabel === lbl
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {lbl === 'home' ? 'Nhà riêng' : lbl === 'office' ? 'Văn phòng' : 'Khác'}
                      </button>
                    ))}
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={addressFormIsDefault}
                      onChange={(e) => setAddressFormIsDefault(e.target.checked)}
                      className="size-4 rounded text-emerald-600"
                    />
                    <span>Đặt làm địa chỉ mặc định</span>
                  </label>
                </div>

                {/* Modal Footer Buttons */}
                <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500"
                  >
                    Lưu địa chỉ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: ORDER TRACKING & DETAIL POPUP                     */}
        {/* ======================================================== */}
        {selectedOrderForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Chi tiết đơn hàng
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Mã đơn #{selectedOrderForDetail.id}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDetail(null)}
                  className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Delivery Progress Timeline */}
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <span className="text-xs font-bold text-slate-700">Trạng thái vận chuyển:</span>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-500">
                  <div className="space-y-1">
                    <div className="mx-auto flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                      ✓
                    </div>
                    <span className="text-slate-900">Đã đặt</span>
                  </div>
                  <div className="space-y-1">
                    <div className="mx-auto flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                      ✓
                    </div>
                    <span className="text-slate-900">Đã xác nhận</span>
                  </div>
                  <div className="space-y-1">
                    <div className="mx-auto flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white animate-pulse">
                      🚚
                    </div>
                    <span className="text-emerald-700">Đang giao</span>
                  </div>
                  <div className="space-y-1">
                    <div className="mx-auto flex size-6 items-center justify-center rounded-full bg-slate-200 text-slate-400">
                      4
                    </div>
                    <span>Đã nhận</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="mt-6 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Danh sách sản phẩm
                </h4>
                <div className="mt-3 divide-y divide-slate-100">
                  {selectedOrderForDetail.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-xs">
                      <div>
                        <strong className="text-slate-900">{item.name}</strong>
                        <p className="text-slate-400">Số lượng: ×{item.qty}</p>
                      </div>
                      <strong className="font-black text-slate-900">
                        {vndMoney.format(item.price * item.qty)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-slate-400">Người nhận:</span>{' '}
                    <strong className="text-slate-800">{selectedOrderForDetail.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Số điện thoại:</span>{' '}
                    <strong className="font-mono text-slate-800">{selectedOrderForDetail.customerPhone}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400">Địa chỉ:</span>{' '}
                    <strong className="text-slate-800">{selectedOrderForDetail.deliveryAddress}</strong>
                  </div>
                </div>
              </div>

              {/* Cost summary */}
              <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tổng tiền hàng:</span>
                  <span>{vndMoney.format(selectedOrderForDetail.total)}</span>
                </div>
                <div className="flex items-baseline justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Tổng thanh toán:</span>
                  <strong className="text-base text-emerald-700">
                    {vndMoney.format(selectedOrderForDetail.total)}
                  </strong>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDetail(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleReorder(selectedOrderForDetail);
                    setSelectedOrderForDetail(null);
                  }}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  Đặt lại đơn này
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
