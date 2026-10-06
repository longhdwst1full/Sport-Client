import { useId } from 'react';
import Link from 'next/link';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/foundation/components/buttons';
import { Checkbox, PasswordInput, TextInput } from '@/foundation/components/field-system';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import type { LoginDto } from '@/generated/api/auth/auth.schemas';
import { AUTH_INPUT_CLASS, AUTH_LEADING_ICON_CLASS, AUTH_SUBMIT_CLASS, AuthField } from './auth-field';

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
    <form className="mt-4 space-y-3 sm:space-y-3.5" onSubmit={form.handleSubmit(onSubmit)}>
      <AuthField id={identifierId} label="Email hoặc Số điện thoại" error={errors.identifier?.message}>
        <div className="relative mt-1.5">
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
        labelAction={
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
          size="lg"
          invalid={Boolean(errors.password)}
          autoComplete="current-password"
          wrapperClassName="mt-1.5"
          className={AUTH_INPUT_CLASS}
          placeholder="Nhập tối thiểu 8 ký tự"
          leadingIcon={<Lock className={AUTH_LEADING_ICON_CLASS} />}
        />
      </AuthField>

      <div className="flex items-center justify-between pt-1">
        <Checkbox
          {...form.register('rememberMe')}
          label={<span className="text-xs font-semibold">Ghi nhớ đăng nhập trên thiết bị này</span>}
          wrapperClassName="items-center gap-2.5 py-0"
        />
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
