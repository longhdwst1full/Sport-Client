'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { KeyRound, Loader2, Save } from 'lucide-react';
import {
  getGetCustomerProfileQueryKey,
  useUpdateCustomerProfile,
} from '@/generated/api/customer/customer';
import { useChangeCustomerPassword } from '@/generated/api/auth/auth';
import type { CustomerProfileDto } from '@/generated/api/customer/customer.schemas';
import { ApiError } from '@/lib/api/fetcher';

function messageOf(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.payload && typeof error.payload === 'object') {
    const message = (error.payload as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return fallback;
}

/**
 * Cài đặt tài khoản: sửa hồ sơ và đổi mật khẩu.
 *
 * Hai việc tách thành hai form riêng vì chúng có hai kết cục khác nhau — sửa hồ sơ trả về hồ sơ
 * mới, còn đổi mật khẩu **đăng xuất mọi thiết bị khác**. Gộp vào một nút Lưu thì người dùng không
 * biết mình vừa gây ra cái nào.
 */
export function AccountSettingsForm({ profile }: { profile: CustomerProfileDto }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', email: '', phone: '', marketingConsent: false });
  const [profileNotice, setProfileNotice] = useState<string>();
  const [profileError, setProfileError] = useState<string>();

  const [password, setPassword] = useState({ current: '', next: '', confirm: '' });
  const [passwordNotice, setPasswordNotice] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  useEffect(() => {
    setForm({
      name: profile.name,
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      marketingConsent: profile.marketingConsent,
    });
  }, [profile]);

  const updateProfile = useUpdateCustomerProfile({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetCustomerProfileQueryKey() });
        setProfileError(undefined);
        setProfileNotice('Đã lưu thông tin tài khoản.');
      },
      onError: (error) => {
        setProfileNotice(undefined);
        setProfileError(messageOf(error, 'Không lưu được thông tin. Vui lòng thử lại.'));
      },
    },
  });

  const changePassword = useChangeCustomerPassword({
    mutation: {
      onSuccess: () => {
        setPassword({ current: '', next: '', confirm: '' });
        setPasswordError(undefined);
        setPasswordNotice(
          'Đã đổi mật khẩu. Các thiết bị khác đang đăng nhập đã bị đăng xuất.',
        );
      },
      onError: (error) => {
        setPasswordNotice(undefined);
        setPasswordError(messageOf(error, 'Không đổi được mật khẩu. Vui lòng thử lại.'));
      },
    },
  });

  return (
    <div className="mt-6 max-w-lg space-y-6">
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
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
            {profileNotice}
          </p>
        )}
        {profileError && (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {profileError}
          </p>
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

      <form
        className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (password.next !== password.confirm) {
            setPasswordNotice(undefined);
            setPasswordError('Hai ô mật khẩu mới không khớp nhau.');
            return;
          }
          changePassword.mutate({
            data: { currentPassword: password.current, newPassword: password.next },
          });
        }}
      >
        <div className="flex items-center gap-2 text-sm font-black text-slate-900">
          <KeyRound className="size-4 text-slate-400" />
          Đổi mật khẩu
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Mật khẩu hiện tại
          </label>
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password.current}
            onChange={(event) => setPassword((c) => ({ ...c, current: event.target.value }))}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Mật khẩu mới
            </label>
            <input
              required
              type="password"
              minLength={8}
              autoComplete="new-password"
              value={password.next}
              onChange={(event) => setPassword((c) => ({ ...c, next: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Nhập lại mật khẩu mới
            </label>
            <input
              required
              type="password"
              minLength={8}
              autoComplete="new-password"
              value={password.confirm}
              onChange={(event) => setPassword((c) => ({ ...c, confirm: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-slate-500">
          Đổi mật khẩu sẽ đăng xuất mọi thiết bị khác đang đăng nhập; thiết bị này vẫn giữ nguyên.
        </p>

        {passwordNotice && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
            {passwordNotice}
          </p>
        )}
        {passwordError && (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {passwordError}
          </p>
        )}

        <button
          type="submit"
          disabled={changePassword.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {changePassword.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <KeyRound className="size-4" />
          )}
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
}
