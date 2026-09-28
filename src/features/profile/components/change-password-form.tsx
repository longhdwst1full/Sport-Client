'use client';

import { useState } from 'react';
import { KeyRound, Loader2 } from 'lucide-react';
import { InlineAlert } from '@/foundation/components/feedback';
import { useChangePassword } from '../hooks/use-change-password';

export function ChangePasswordForm() {
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' });
  const {
    mutation: changePassword,
    notice: passwordNotice,
    error: passwordError,
    setNotice: setPasswordNotice,
    setError: setPasswordError,
  } = useChangePassword(() => setPassword({ current: '', next: '', confirm: '' }));

  return (
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
        <InlineAlert as="p" className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
          {passwordNotice}
        </InlineAlert>
      )}
      {passwordError && (
        <InlineAlert as="p" className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
          {passwordError}
        </InlineAlert>
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
  );
}
