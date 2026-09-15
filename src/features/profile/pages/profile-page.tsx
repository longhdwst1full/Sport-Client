'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Clock,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Plus,
  Truck,
  Check,
  Search,
  Wrench,
  AlertCircle,
  X,
} from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { useCustomerAuth } from '@/features/auth';
import { useGetCustomerProfile } from '@/generated/api/customer/customer';
import { STORE_CONFIG, STORE_CONTACT } from '@/shared/constants';
import {
  VietnamAddressSelector,
  type SelectedAddressData,
} from '@/shared/components/address/vietnam-address-selector';
import { useToast } from '@/shared/components/global-toast';

type ProfileTab = 'warranty' | 'address' | 'settings';

import {
  type WarrantyItem,
} from '@/shared/data/mocks';
import { useCustomerAddresses } from '../api/use-customer-addresses';
import {
  EMPTY_LOCATION,
  toCreateAddressPayload,
  toSelectorInitialData,
  toUpdateAddressPayload,
  type AddressView,
} from '../model/address.mapper';

export function ProfilePage() {
  const router = useRouter();
  const { logout, isAuthenticated, isLoaded: authLoaded } = useCustomerAuth();
  // Order history now has a dedicated API-backed feature. Keep Profile focused
  // on account preferences instead of rendering the legacy local fixture first.
  const [activeTab, setActiveTab] = useState<ProfileTab>('settings');

  // Address state — dữ liệu do API tài khoản sở hữu, form chỉ giữ input đang nhập.
  const {
    addresses,
    isLoading: addressesLoading,
    isError: addressesError,
    refetch: refetchAddresses,
    createAddress,
    updateAddress,
    removeAddress,
    isMutating: addressMutating,
  } = useCustomerAddresses(authLoaded && isAuthenticated);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressView | null>(null);
  const [addressFormName, setAddressFormName] = useState('');
  const [addressFormPhone, setAddressFormPhone] = useState('');
  const [addressFormIsDefault, setAddressFormIsDefault] = useState(false);
  const [modalAddressData, setModalAddressData] = useState<SelectedAddressData>(EMPTY_LOCATION);

  // Trang tài khoản là nội dung riêng của từng khách; chưa đăng nhập thì đưa về đăng nhập
  // thay vì hiện khung rỗng.
  useEffect(() => {
    if (authLoaded && !isAuthenticated) router.replace('/login');
  }, [authLoaded, isAuthenticated, router]);

  // Hồ sơ lấy từ API tài khoản. Bản trước hiển thị tên và email viết cứng trong mã nguồn,
  // nên mọi khách đăng nhập đều thấy cùng một người.
  const profileQuery = useGetCustomerProfile({
    query: { enabled: authLoaded && isAuthenticated },
  });
  const profileName = profileQuery.data?.name ?? '';
  const profileEmail = profileQuery.data?.email ?? '';
  const profilePhone = profileQuery.data?.phone ?? '';

  const { success } = useToast();
  const showToast = (msg: string) => {
    success('Thông báo', msg);
  };

  const { error: showError } = useToast();

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressFormName(profileName);
    setAddressFormPhone(profilePhone);
    setAddressFormIsDefault(addresses.length === 0);
    setModalAddressData(EMPTY_LOCATION);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: AddressView) => {
    setEditingAddress(addr);
    setAddressFormName(addr.recipient);
    setAddressFormPhone(addr.phone);
    setAddressFormIsDefault(addr.isDefault);
    setModalAddressData(toSelectorInitialData(addr));
    setIsAddressModalOpen(true);
  };

  const reportAddressError = (fallback: string) => (error: unknown) => {
    const message = error instanceof Error ? error.message : fallback;
    showError('Không thực hiện được', message);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAddressData.streetAddress.trim() || modalAddressData.provinceCode == null) {
      showError('Thiếu thông tin', 'Vui lòng chọn Tỉnh/Thành và nhập số nhà, tên đường.');
      return;
    }

    const values = {
      recipient: addressFormName,
      phone: addressFormPhone,
      isDefault: addressFormIsDefault,
      location: modalAddressData,
    };

    try {
      if (editingAddress) {
        // `expectedVersion` là optimistic concurrency của BE: gửi đúng version đã
        // đọc để một bản ghi bị sửa nơi khác sẽ bị từ chối thay vì ghi đè.
        await updateAddress.mutateAsync({
          addressId: editingAddress.id,
          data: toUpdateAddressPayload(values, editingAddress.version),
        });
        showToast('Đã cập nhật địa chỉ thành công!');
      } else {
        await createAddress.mutateAsync({ data: toCreateAddressPayload(values) });
        showToast('Đã thêm địa chỉ mới vào sổ địa chỉ!');
      }
      setIsAddressModalOpen(false);
    } catch (error) {
      // Giữ nguyên modal và dữ liệu đã nhập khi mutation thất bại.
      reportAddressError('Không lưu được địa chỉ, vui lòng thử lại.')(error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      await removeAddress.mutateAsync({ addressId: id });
      showToast('Đã xóa địa chỉ thành công.');
    } catch (error) {
      reportAddressError('Không xóa được địa chỉ, vui lòng thử lại.')(error);
    }
  };

  const handleSetDefaultAddress = async (addr: AddressView) => {
    try {
      await updateAddress.mutateAsync({
        addressId: addr.id,
        data: { isDefault: true, expectedVersion: addr.version },
      });
      showToast('Đã đổi địa chỉ mặc định!');
    } catch (error) {
      reportAddressError('Không đổi được địa chỉ mặc định.')(error);
    }
  };

  const handleLogout = () => {
    logout();
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
                    <p className="mt-1 truncate text-xs text-slate-400">{profileEmail}</p>
                  </div>
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
                      onClick={() => {
                        if (id === 'orders') {
                          router.push('/orders');
                          return;
                        }
                        setActiveTab(id);
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
                  {addressesLoading && addresses.length === 0 ? (
                    <div className="mt-6 space-y-4" aria-busy="true">
                      {[0, 1].map((row) => (
                        <div key={row} className="rounded-2xl border border-slate-200 p-5">
                          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                          <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
                        </div>
                      ))}
                    </div>
                  ) : addressesError ? (
                    <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-xs text-rose-700">
                      <p className="font-bold">Không tải được sổ địa chỉ.</p>
                      <button
                        type="button"
                        onClick={() => void refetchAddresses()}
                        className="mt-2 font-bold underline"
                      >
                        Thử lại
                      </button>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                      Chưa có địa chỉ nhận hàng nào. Thêm địa chỉ để thanh toán nhanh hơn.
                    </div>
                  ) : (
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
                            <strong className="text-sm font-bold text-slate-900">{addr.recipient}</strong>
                            <span className="text-xs text-slate-400">· {addr.phone}</span>
                            {addr.isDefault && (
                              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase text-white">
                                Mặc định
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3 text-xs">
                            {!addr.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr)}
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
                  )}
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

                  {/* Chưa có API bảo hành. Hiển thị đúng trạng thái thay vì tra cứu trên dữ
                      liệu dựng sẵn — khách tra ra một máy không phải của mình là sai nghiêm
                      trọng hơn là chưa có chức năng. */}
                  <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
                    <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-200 text-slate-500">
                      <ShieldCheck className="size-6" />
                    </div>
                    <p className="mt-4 text-sm font-bold text-slate-700">
                      Chức năng đang phát triển
                    </p>
                    <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                      Tra cứu bảo hành điện tử sẽ mở khi hệ thống hoàn tất kết nối dữ liệu bảo
                      hành. Trong lúc chờ, vui lòng liên hệ hotline {STORE_CONTACT.primaryHotline} kèm
                      số serial trên máy để được hỗ trợ.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: SETTINGS (CÀI ĐẶT TÀI KHOẢN) */}
              {activeTab === 'settings' && (
                <div>
                  <div className="border-b border-slate-100 pb-5">
                    <h2 className="text-xl font-black text-slate-900">Cài đặt tài khoản cá nhân</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Thông tin đăng nhập của tài khoản
                    </p>
                  </div>

                  {/* Storefront Auth chỉ có register/login/refresh/logout/me: chưa có
                      operation đổi hồ sơ hay đổi mật khẩu cho khách. Hiển thị read-only
                      thay vì form ghi khống, tránh báo "đã lưu" cho thao tác không tồn tại. */}
                  <dl className="mt-6 max-w-lg divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/60">
                    <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Họ và tên
                      </dt>
                      <dd className="text-xs font-semibold text-slate-800 sm:text-sm">{profileName}</dd>
                    </div>
                    <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Email đăng nhập
                      </dt>
                      <dd className="break-all text-xs font-semibold text-slate-800 sm:text-sm">{profileEmail}</dd>
                    </div>
                    <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Số điện thoại
                      </dt>
                      <dd className="text-xs font-semibold text-slate-800 sm:text-sm">{profilePhone}</dd>
                    </div>
                  </dl>

                  <p className="mt-4 max-w-lg rounded-2xl bg-amber-50 px-4 py-3 text-xs font-medium leading-relaxed text-amber-900">
                    Để thay đổi họ tên, email, số điện thoại hoặc mật khẩu, vui lòng liên hệ
                    bộ phận chăm sóc khách hàng. Chúng tôi sẽ mở chức năng tự thay đổi trên
                    website sau khi hoàn tất bước xác minh danh tính.
                  </p>
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
                  {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ nhận hàng mới'}
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

                {/* Default toggle — contract chưa có nhãn loại địa chỉ nên bỏ phần chọn nhãn. */}
                <div className="flex flex-wrap items-center justify-end gap-4 pt-1">
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
                    disabled={addressMutating}
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {addressMutating ? 'Đang lưu…' : 'Lưu địa chỉ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </StorefrontLayout>
  );
}
