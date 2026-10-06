import { useId } from 'react';
import Link from 'next/link';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/foundation/components/buttons';
import { PasswordInput, TextInput } from '@/foundation/components/field-system';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import type { LoginDto } from '@/generated/api/auth/auth.schemas';
import {
  AUTH_LEADING_ICON_CLASS,
  AUTH_PASSWORD_TOGGLE_CLASS,
  AUTH_SUBMIT_CLASS,
  AUTH_INPUT_CLASS,
  AuthField,
  authPasswordInputClassName,
} from './auth-field';

interface LoginFormProps {
  form: UseFormReturn<LoginDto>;
  isPending: boolean;
  onSubmit: (data: LoginDto) => void;
}

export function LoginForm({ form, isPending, onSubmit }: LoginFormProps) {
  const fieldId = useId();
  const identifierId = `${fieldId}-identifier`;
  const passwordId = `${fieldId}-password`;
  const { errors } = form.formState;

  return (
    <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <AuthField id={identifierId} label="Email hoặc Số điện thoại" error={errors.identifier?.message}>
        <div className="relative mt-2">
          <TextInput
            {...form.register('identifier')}
            id={identifierId}
            size="lg"
            invalid={Boolean(errors.identifier)}
            autoComplete="username"
            className={AUTH_INPUT_CLASS}
            placeholder="email@example.com hoặc 0912 345 678"
          />
          <Mail className={AUTH_LEADING_ICON_CLASS} />
        </div>
      </AuthField>

      <AuthField
        id={passwordId}
        label="Mật khẩu"
        error={errors.password?.message}
        aside={
          <Link
            href="/forgot-password"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Quên mật khẩu?
          </Link>
        }
      >
        <PasswordInput
          {...form.register('password')}
          id={passwordId}
          aria-invalid={errors.password ? true : undefined}
          autoComplete="current-password"
          wrapperClassName="relative mt-2"
          className={authPasswordInputClassName(Boolean(errors.password))}
          placeholder="Nhập tối thiểu 8 ký tự"
          leadingIcon={<Lock className={AUTH_LEADING_ICON_CLASS} />}
          toggleClassName={AUTH_PASSWORD_TOGGLE_CLASS}
        />
      </AuthField>

      {/* Remember Me — chưa có primitive Checkbox trong foundation */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            {...form.register('rememberMe')}
            className="size-4 rounded-md border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <span>Ghi nhớ đăng nhập trên thiết bị này</span>
        </label>
      </div>

      <Button type="submit" size="lg" fullWidth disabled={isPending} className={AUTH_SUBMIT_CLASS}>
        {isPending ? (
          <span>Đang xác thực thông tin…</span>
        ) : (
          <>
            <span>Đăng nhập ngay</span>
            <ArrowRight className="size-4" aria-hidden />
          </>
        )}
      </Button>
    </form>
  );
}
