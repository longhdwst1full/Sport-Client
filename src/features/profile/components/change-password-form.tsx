'use client';

import { useId, useState } from 'react';
import { KeyRound } from 'lucide-react';
import { InlineAlert } from '@/foundation/components/feedback';
import { Field, TextInput } from '@/foundation/components/field-system';
import { PROFILE_LABEL_CLASS, ProfileSubmitButton } from './profile-form-field';
import { useChangePassword } from '../hooks/use-change-password';

export function ChangePasswordForm() {
  const fieldId = useId();
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
        <KeyRound className="size-4 text-slate-900" aria-hidden />
        Đổi mật khẩu
      </div>

      <div>
        <Field label="Mật khẩu hiện tại" labelClassName={PROFILE_LABEL_CLASS}>
          <TextInput
            required
            type="password"
            autoComplete="current-password"
            id={`${fieldId}-current`}
            value={password.current}
            onChange={(event) => setPassword((c) => ({ ...c, current: event.target.value }))}
            size="md"
            className="mt-1.5"
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Field label="Mật khẩu mới" labelClassName={PROFILE_LABEL_CLASS}>
            <TextInput
              required
              type="password"
              minLength={8}
              autoComplete="new-password"
              id={`${fieldId}-next`}
              value={password.next}
              onChange={(event) => setPassword((c) => ({ ...c, next: event.target.value }))}
              size="md"
              className="mt-1.5"
            />
          </Field>
        </div>
        <div>
          <Field label="Nhập lại mật khẩu mới" labelClassName={PROFILE_LABEL_CLASS}>
            <TextInput
              required
              type="password"
              minLength={8}
              autoComplete="new-password"
              id={`${fieldId}-confirm`}
              value={password.confirm}
              onChange={(event) => setPassword((c) => ({ ...c, confirm: event.target.value }))}
              size="md"
              className="mt-1.5"
            />
          </Field>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-600">
        Đổi mật khẩu sẽ đăng xuất mọi thiết bị khác đang đăng nhập; thiết bị này vẫn giữ nguyên.
      </p>

      {passwordNotice && (
        <InlineAlert as="p" role="status" className="rounded-xl bg-success-50 px-3 py-2 text-xs font-semibold text-success-800">
          {passwordNotice}
        </InlineAlert>
      )}
      {passwordError && (
        <InlineAlert as="p" role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
          {passwordError}
        </InlineAlert>
      )}

      <ProfileSubmitButton pending={changePassword.isPending} icon={<KeyRound className="size-4" aria-hidden />}>
        Đổi mật khẩu
      </ProfileSubmitButton>
    </form>
  );
}
