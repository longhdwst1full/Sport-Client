'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarDays, Mail, Phone, RefreshCw } from 'lucide-react';
import { useCustomerAuth } from '@/features/auth';
import { useGetCustomerProfile } from '@/generated/api/customer/customer';
import { AddressBookPanel } from '../components/address-book-panel';
import { AddressFormDialog } from '../components/address-form-dialog';
import { ChangePasswordForm } from '../components/change-password-form';
import { ProfileInfoForm } from '../components/profile-info-form';
import {
  PROFILE_TABS,
  ProfileShoppingLinks,
  ProfileSidebar,
  type ProfileTab,
} from '../components/profile-sidebar';
import { useAddressBook } from '../hooks/use-address-book';

const TAB_COPY: Record<ProfileTab, { title: string; description: string }> = {
  info: { title: 'Thông tin cá nhân', description: 'Họ tên, email và số điện thoại dùng để đăng nhập và liên hệ giao hàng.' },
  security: {
    title: 'Mật khẩu & bảo mật',
    description: 'Đổi mật khẩu sẽ đăng xuất tài khoản khỏi mọi thiết bị khác.',
  },
  address: { title: 'Sổ địa chỉ', description: 'Địa chỉ giao hàng và lắp đặt dùng khi thanh toán.' },
};

function isProfileTab(value: string | null): value is ProfileTab {
  return PROFILE_TABS.some((tab) => tab.id === value);
}

/** Chữ cái đầu của hai từ cuối tên ("Nguyễn Văn An" → "VA"), đủ nhận ra mà không cần ảnh đại diện. */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  return words
    .slice(-2)
    .map((word) => word[0]!.toUpperCase())
    .join('');
}

const memberSince = (iso: string) =>
  new Intl.DateTimeFormat('vi-VN', { month: '2-digit', year: 'numeric' }).format(new Date(iso));

export function ProfilePage() {
  const router = useRouter();
  const { logout, isAuthenticated, isLoaded: authLoaded } = useCustomerAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');

  // `?tab=address` mở thẳng đúng mục (ví dụ link "Thêm địa chỉ" từ trang khác). Đọc sau khi mount
  // để HTML SSR và lần render đầu ở client giống nhau.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('tab');
    if (isProfileTab(requested)) setActiveTab(requested);
  }, []);

  const selectTab = useCallback((tab: ProfileTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState(null, '', url);
  }, []);

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
  const profilePhone = profileQuery.data?.phone ?? '';

  // Address state — dữ liệu do API tài khoản sở hữu, form chỉ giữ input đang nhập.
  const {
    addresses,
    addressesLoading,
    addressesError,
    refetchAddresses,
    addressMutating,
    isAddressModalOpen,
    setIsAddressModalOpen,
    editingAddress,
    addressFormName,
    setAddressFormName,
    addressFormPhone,
    setAddressFormPhone,
    addressFormIsDefault,
    setAddressFormIsDefault,
    modalAddressData,
    setModalAddressData,
    handleOpenAddAddress,
    handleOpenEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
  } = useAddressBook(authLoaded && isAuthenticated, profileName, profilePhone);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const profile = profileQuery.data;
  const copy = TAB_COPY[activeTab];

  return (
      <div className="pb-20 pt-6">
        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-5 flex items-center gap-2 text-xs font-semibold text-[var(--dc-text-secondary)]">
            <Link href="/" className="hover:text-[var(--dc-primary-700)]">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="font-bold text-[var(--dc-text-primary)]">Tài khoản</span>
          </nav>

          {/* Thẻ chào: ai đang đăng nhập — tên, liên hệ, mã khách để báo khi gọi hỗ trợ. */}
          <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[var(--dc-primary-700)] to-[var(--dc-primary-900)] p-6 text-white shadow-lg shadow-[var(--dc-primary-900)]/15 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-white/5" />
            {profile ? (
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/15 text-2xl font-black ring-1 ring-white/25 sm:size-20 sm:text-3xl">
                  {initialsOf(profile.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white/70">Xin chào,</p>
                  <h1 className="truncate text-xl font-black sm:text-2xl">{profile.name}</h1>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/80 sm:text-sm">
                    {profile.email && (
                      <span className="inline-flex min-w-0 items-center gap-1.5">
                        <Mail className="size-4 shrink-0" />
                        <span className="truncate">{profile.email}</span>
                      </span>
                    )}
                    {profile.phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="size-4" />
                        {profile.phone}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-4" />
                      Thành viên từ {memberSince(profile.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-xs ring-1 ring-white/15">
                  <p className="text-white/70">Mã khách hàng</p>
                  <p className="mt-0.5 font-mono text-sm font-bold tracking-wide">{profile.customerNo}</p>
                </div>
              </div>
            ) : profileQuery.isError ? (
              <div className="relative flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold">Không tải được thông tin tài khoản.</p>
                <button
                  type="button"
                  onClick={() => void profileQuery.refetch()}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-xs font-bold ring-1 ring-white/25 hover:bg-white/25"
                >
                  <RefreshCw className="size-4" />
                  Thử lại
                </button>
              </div>
            ) : (
              <div className="relative flex items-center gap-5" aria-busy="true">
                <div className="size-16 animate-pulse rounded-2xl bg-white/15 sm:size-20" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-white/15" />
                  <div className="h-6 w-56 animate-pulse rounded bg-white/20" />
                  <div className="h-3 w-72 max-w-full animate-pulse rounded bg-white/15" />
                </div>
              </div>
            )}
          </section>

          <div className="mt-6 space-y-4 lg:hidden">
            <ProfileShoppingLinks />
            {/* Màn hình nhỏ: tab ngang thay cho sidebar. */}
            <div role="tablist" aria-label="Tài khoản" className="flex gap-2 overflow-x-auto pb-1">
              {PROFILE_TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === id}
                  onClick={() => selectTab(id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                    activeTab === id
                      ? 'bg-[var(--dc-primary-700)] text-white shadow-sm'
                      : 'border border-[var(--dc-border)] bg-white text-[var(--dc-text-secondary)]'
                  }`}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
            <ProfileSidebar activeTab={activeTab} onSelectTab={selectTab} onLogout={handleLogout} />

            <section className="rounded-[28px] border border-[var(--dc-border)] bg-white p-5 shadow-sm sm:p-8">
              {activeTab === 'address' ? (
                <AddressBookPanel
                  addresses={addresses}
                  addressesLoading={addressesLoading}
                  addressesError={addressesError}
                  onRetry={() => void refetchAddresses()}
                  onAdd={handleOpenAddAddress}
                  onEdit={handleOpenEditAddress}
                  onDelete={handleDeleteAddress}
                  onSetDefault={handleSetDefaultAddress}
                />
              ) : (
                <>
                  <header className="border-b border-[var(--dc-border)] pb-5">
                    <h2 className="text-xl font-black text-[var(--dc-text-primary)]">{copy.title}</h2>
                    <p className="mt-1 text-sm text-[var(--dc-text-secondary)]">{copy.description}</p>
                  </header>
                  <div className="mt-6 max-w-xl">
                    {activeTab === 'security' ? (
                      <ChangePasswordForm />
                    ) : profile ? (
                      <ProfileInfoForm profile={profile} />
                    ) : (
                      <div className="space-y-4" aria-busy="true">
                        {[0, 1, 2].map((row) => (
                          <div key={row} className="h-11 animate-pulse rounded-xl bg-[var(--dc-canvas)]" />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-2xl border border-rose-200 bg-white py-3 text-sm font-bold text-rose-600 lg:hidden"
          >
            Đăng xuất
          </button>
        </main>

        {/* ======================================================== */}
        {/* MODAL: ADD / EDIT ADDRESS WITH VIETNAM CASCADING SELECTOR */}
        {/* ======================================================== */}
        {isAddressModalOpen && (
          <AddressFormDialog
            editingAddress={editingAddress}
            addressFormName={addressFormName}
            onAddressFormNameChange={setAddressFormName}
            addressFormPhone={addressFormPhone}
            onAddressFormPhoneChange={setAddressFormPhone}
            addressFormIsDefault={addressFormIsDefault}
            onAddressFormIsDefaultChange={setAddressFormIsDefault}
            modalAddressData={modalAddressData}
            onModalAddressDataChange={setModalAddressData}
            addressMutating={addressMutating}
            onClose={() => setIsAddressModalOpen(false)}
            onSubmit={handleSaveAddress}
          />
        )}

      </div>
  );
}
