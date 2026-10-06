'use client';

import { useId, useState } from 'react';
import { Save } from 'lucide-react';
import type { CustomerProfileDto } from '@/generated/api/customer/customer.schemas';
import { InlineAlert } from '@/foundation/components/feedback';
import { Checkbox, Field, TextInput } from '@/foundation/components/field-system';
import { PROFILE_LABEL_CLASS, ProfileSubmitButton } from './profile-form-field';
import { useUpdateProfile } from '../hooks/use-update-profile';

/**
 * Form khởi tạo một lần từ hồ sơ; refetch (focus lại tab, sau khi lưu) không ghi đè chữ khách đang gõ.
 * Nơi gọi đặt `key={profile.id}` để đổi tài khoản thì form khởi tạo lại.
 */
export function ProfileInfoForm({ profile }: { profile: CustomerProfileDto }) {
  const [form, setForm] = useState(() => ({
    name: profile.name,
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    marketingConsent: profile.marketingConsent,
  }));
  const { mutation: updateProfile, notice: profileNotice, error: profileError } = useUpdateProfile();
  const fieldId = useId();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        updateProfile.mutate({
          data: {
            // Version đọc từ hồ sơ đang xem: hai tab mở cùng lúc thì tab cũ nhận lỗi thay vì
            // ghi đè im lặng lên thay đổi của tab kia.
            expectedVersion: profile.version,
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            marketingConsent: form.marketingConsent,
          },
        });
      }}
    >
      <div>
        <Field label="Họ và tên" labelClassName={PROFILE_LABEL_CLASS}>
          <TextInput
            id={`${fieldId}-name`}
            required
            autoComplete="name"
            maxLength={255}
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            size="md"
            className="mt-1.5"
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Field label="Email đăng nhập" labelClassName={PROFILE_LABEL_CLASS}>
            <TextInput
              id={`${fieldId}-email`}
              type="email"
              autoComplete="email"
              maxLength={255}
              value={form.email}
              onChange={(event) => setForm((c) => ({ ...c, email: event.target.value }))}
              size="md"
              className="mt-1.5"
            />
          </Field>
        </div>
        <div>
          <Field label="Số điện thoại" labelClassName={PROFILE_LABEL_CLASS}>
            <TextInput
              id={`${fieldId}-phone`}
              type="tel"
              autoComplete="tel"
              maxLength={32}
              value={form.phone}
              onChange={(event) => setForm((c) => ({ ...c, phone: event.target.value }))}
              size="md"
              className="mt-1.5"
            />
          </Field>
        </div>
      </div>

      {/* Email và SĐT cũng là thông tin đăng nhập; nói rõ để khách không đổi rồi mới biết. */}
      <p className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
        Email và số điện thoại cũng là thông tin dùng để đăng nhập. Đổi xong, lần sau bạn cần
        dùng thông tin mới để vào tài khoản.
      </p>

      <Checkbox
        checked={form.marketingConsent}
        onChange={(event) => setForm((c) => ({ ...c, marketingConsent: event.target.checked }))}
        wrapperClassName="items-center gap-2 py-0"
        label={<span className="text-xs font-medium text-slate-600">Nhận email về khuyến mãi và sản phẩm mới</span>}
      />

      {profileNotice && (
        <InlineAlert as="p" role="status" className="rounded-xl bg-success-50 px-3 py-2 text-xs font-semibold text-success-800">
          {profileNotice}
        </InlineAlert>
      )}
      {profileError && (
        <InlineAlert as="p" role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
          {profileError}
        </InlineAlert>
      )}

      <ProfileSubmitButton pending={updateProfile.isPending} icon={<Save className="size-4" aria-hidden />}>
        Lưu thông tin
      </ProfileSubmitButton>
    </form>
  );
}
