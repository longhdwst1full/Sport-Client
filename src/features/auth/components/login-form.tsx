import Link from 'next/link';
import type { UseFormReturn } from 'react-hook-form';
import { PasswordInput } from '@/foundation/components/field-system';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import type { LoginDto } from '@/generated/api/auth/auth.schemas';

interface LoginFormProps {
  form: UseFormReturn<LoginDto>;
  isPending: boolean;
  onSubmit: (data: LoginDto) => void;
}

export function LoginForm({ form, isPending, onSubmit }: LoginFormProps) {
  return (
    <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Identifier Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Email hoặc Số điện thoại
        </label>
        <div className="relative mt-2">
          <input
            {...form.register('identifier')}
            autoComplete="username"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 pl-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
            placeholder="email@example.com hoặc 0912 345 678"
          />
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        </div>
        {form.formState.errors.identifier && (
          <span className="mt-1.5 block text-xs font-medium text-rose-600">
            {form.formState.errors.identifier.message}
          </span>
        )}
      </div>

      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Mật khẩu
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <PasswordInput
          {...form.register('password')}
          autoComplete="current-password"
          wrapperClassName="relative mt-2"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 pl-11 pr-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
          placeholder="Nhập tối thiểu 8 ký tự"
          leadingIcon={<Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />}
          toggleClassName="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        />
        {form.formState.errors.password && (
          <span className="mt-1.5 block text-xs font-medium text-rose-600">
            {form.formState.errors.password.message}
          </span>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            {...form.register('rememberMe')}
            className="size-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Ghi nhớ đăng nhập trên thiết bị này</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-black text-white shadow-lg shadow-emerald-600/25 transition hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-600/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <span>Đang xác thực thông tin…</span>
        ) : (
          <>
            <span>Đăng nhập ngay</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
