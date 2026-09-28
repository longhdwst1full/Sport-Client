'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { CustomerProfileDto } from '@/generated/api/customer/customer.schemas';
import { InlineAlert } from '@/foundation/components/feedback';
import { useUpdateProfile } from '../hooks/use-update-profile';

export function ProfileInfoForm({ profile }: { profile: CustomerProfileDto }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', marketingConsent: false });
  const { mutation: updateProfile, notice: profileNotice, error: profileError } = useUpdateProfile();

  useEffect(() => {
    setForm({
      name: profile.name,
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      marketingConsent: profile.marketingConsent,
    });
  }, [profile]);

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
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
          Họ và tên
        </label>
        <input
          required
          maxLength={255}
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Email đăng nhập
          </label>
          <input
            type="email"
            maxLength={255}
            value={form.email}
            onChange={(event) => setForm((c) => ({ ...c, email: event.target.value }))}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Số điện thoại
          </label>
          <input
            maxLength={32}
            value={form.phone}
            onChange={(event) => setForm((c) => ({ ...c, phone: event.target.value }))}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* Email và SĐT cũng là thông tin đăng nhập; nói rõ để khách không đổi rồi mới biết. */}
      <p className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
        Email và số điện thoại cũng là thông tin dùng để đăng nhập. Đổi xong, lần sau bạn cần
        dùng thông tin mới để vào tài khoản.
      </p>

      <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
        <input
          type="checkbox"
          checked={form.marketingConsent}
          onChange={(event) => setForm((c) => ({ ...c, marketingConsent: event.target.checked }))}
          className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />
        Nhận email về khuyến mãi và sản phẩm mới
      </label>

      {profileNotice && (
        <InlineAlert as="p" className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
          {profileNotice}
        </InlineAlert>
      )}
      {profileError && (
        <InlineAlert as="p" className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
          {profileError}
        </InlineAlert>
      )}

      <button
        type="submit"
        disabled={updateProfile.isPending}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {updateProfile.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}
        Lưu thông tin
      </button>
    </form>
  );
}
