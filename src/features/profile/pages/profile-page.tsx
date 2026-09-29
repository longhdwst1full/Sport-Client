'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomerAuth } from '@/features/auth';
import { useGetCustomerProfile } from '@/generated/api/customer/customer';
import { AccountSettingsForm } from '../components/account-settings-form';
import { AddressBookPanel } from '../components/address-book-panel';
import { AddressFormDialog } from '../components/address-form-dialog';
import { ProfileSidebar, type ProfileTab } from '../components/profile-sidebar';
import { useAddressBook } from '../hooks/use-address-book';

export function ProfilePage() {
  const router = useRouter();
  const { logout, isAuthenticated, isLoaded: authLoaded } = useCustomerAuth();
  // Order history now has a dedicated API-backed feature. Keep Profile focused
  // on account preferences instead of rendering the legacy local fixture first.
  const [activeTab, setActiveTab] = useState<ProfileTab>('settings');

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

  return (
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
            <ProfileSidebar
              profileName={profileName}
              profileEmail={profileEmail}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onNavigateOrders={() => router.push('/orders')}
              onNavigateReturns={() => router.push('/returns')}
              onNavigateSupport={() => router.push('/account/support')}
              onLogout={handleLogout}
            />

            {/* ======================================================== */}
            {/* MAIN CONTENT PANE                                        */}
            {/* ======================================================== */}
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              {/* TAB 2: ADDRESS MANAGEMENT (SỔ ĐỊA CHỈ & VIETNAMESE DIVISION API) */}
              {activeTab === 'address' && (
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

                  {profileQuery.data ? (
                    <AccountSettingsForm profile={profileQuery.data} />
                  ) : (
                    <p className="mt-6 text-xs text-slate-500">Đang tải thông tin tài khoản…</p>
                  )}

                </div>
              )}
            </div>
          </div>
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
